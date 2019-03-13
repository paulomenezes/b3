import * as d3 from 'd3';
import * as $ from 'jquery';

class Column {
  type: string;
  name: string;
  color: string;
}

class Axis {
  column: string;
  parser?: string;
  formatter?: string;
}

class Options {
  bindTo: string;
  axis: {
    x: Axis;
  };
  columns: Column[];
}

export default class B3 {
  constructor(data: any[], options: Options) {
    const chart = new Chart(options, data);

    options.columns.forEach(column => {
      chart.addComponent(column);
    });

    chart.render();
  }
}

class Chart {
  width: number;
  height: number;

  marginHorizontal: number;
  marginVertial: number;

  xScale: d3.ScaleBand<string>;
  yScale: d3.ScaleLinear<number, number>;

  svg: d3.Selection<SVGGElement, {}, HTMLElement, any>;

  options: Options;
  data: any[];

  components: Component[] = [];

  formatter: (date: Date) => string;
  parser: (dateString: string) => Date;

  constructor(options: Options, data: any[]) {
    this.options = options;
    this.data = data;

    this.parser = d3.timeParse(options.axis.x.parser || '%Y-%m-%d');
    this.formatter = d3.timeFormat(options.axis.x.formatter || '%d/%m/%Y');

    const container = $(options.bindTo);

    if (!container.width() || !container.height()) {
      throw Error('Define the container width and height');
    }

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    this.marginHorizontal = margin.left + margin.right;
    this.marginVertial = margin.top + margin.bottom;

    this.width = container.width() - this.marginHorizontal;
    this.height = container.height() - this.marginVertial;

    this.svg = d3
      .select(options.bindTo)
      .append('svg')
      .attr('width', this.width + this.marginHorizontal)
      .attr('height', this.height + this.marginVertial)
      .append('g');

    const dates = data.map(d => d[options.axis.x.column]);
    this.xScale = d3
      .scaleBand()
      .range([this.marginHorizontal, this.width])
      .domain(dates)
      .padding(0.6);
  }

  addComponent(column: Column) {
    let component: Component;

    switch (column.type) {
      case 'bar':
        component = new BarComponent(this, column);
        break;
      case 'line':
        component = new LineComponent(this, column);
        break;
    }

    if (component) {
      this.components.push(component);
    }
  }

  render() {
    const xAxis = d3.axisBottom(this.xScale).tickFormat(date => this.formatter(this.parser(date)));

    this.svg
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${this.height})`)
      .call(xAxis);

    let domain: [number, number];
    for (const component of this.components) {
      const d = component.getYDomain();

      if (!domain) {
        domain = d;
      } else {
        domain[0] = Math.min(domain[0], d[0]);
        domain[1] = Math.max(domain[1], d[1]);
      }
    }

    this.yScale = d3
      .scaleLinear()
      .range([this.height, this.marginVertial])
      .domain(domain);

    const yAxis = d3.axisLeft(this.yScale);

    this.svg
      .append('g')
      .attr('class', 'y axis')
      .attr('transform', `translate(${this.marginVertial}, 0)`)
      .call(yAxis);

    for (const component of this.components) {
      component.render();
    }
  }
}

interface Component {
  getYDomain(): [number, number];
  render(): void;
}

class BarComponent implements Component {
  chart: Chart;
  column: Column;

  constructor(chart: Chart, column: Column) {
    this.chart = chart;
    this.column = column;
  }

  getYDomain(): [number, number] {
    return [0, d3.max(this.chart.data, d => d[this.column.name])];
  }

  render() {
    this.chart.svg
      .selectAll('rect')
      .data(this.chart.data)
      .enter()
      .append('rect')
      .attr('x', d => this.chart.xScale(d[this.chart.options.axis.x.column]))
      .attr('y', d => this.chart.yScale(d[this.column.name]))
      .attr('width', this.chart.xScale.bandwidth())
      .attr('height', d => this.chart.yScale(0) - this.chart.yScale(d[this.column.name]))
      .attr('fill', d => this.column.color);
  }
}

class LineComponent {
  chart: Chart;
  column: Column;

  constructor(chart: Chart, column: Column) {
    this.chart = chart;
    this.column = column;
  }

  getYDomain(): [number, number] {
    return d3.extent(this.chart.data, d => d[this.column.name]);
  }

  render() {
    const line = d3
      .line()
      .defined(d => d[this.column.name] !== null)
      .x(d => this.chart.xScale(d[this.chart.options.axis.x.column]) + this.chart.xScale.bandwidth() / 2)
      .y(d => this.chart.yScale(d[this.column.name]));

    this.chart.svg
      .append('path')
      .datum(this.chart.data)
      .attr('fill', 'none')
      .attr('stroke', this.column.color)
      .attr('stroke-width', 2)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('d', line);
  }
}
