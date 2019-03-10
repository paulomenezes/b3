import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  data = [
    {
      date: '2019-03-07',
      value: 100,
    },
    {
      date: '2019-03-08',
      value: 110,
    },
    {
      date: '2019-03-09',
      value: null,
    },
    {
      date: '2019-03-10',
      value: 20,
    },
    {
      date: '2019-03-11',
      value: 220,
    },
  ];

  ngOnInit(): void {
    const container = $('#chart');

    if (!container.width() || !container.height()) {
      throw Error('Define the container width and height');
    }

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    const marginHorizontal = margin.left + margin.right;
    const marginVertial = margin.top + margin.bottom;

    const width = container.width() - marginHorizontal;
    const height = container.height() - marginVertial;

    const svg = d3
      .select('#chart')
      .append('svg')
      .attr('width', width + marginHorizontal)
      .attr('height', height + marginVertial)
      .append('g');

    const formatter = d3.timeFormat('%d/%m/%Y');
    const parser = d3.timeParse('%Y-%m-%d');

    const valueMax = d3.max(this.data, d => d.value);
    const dates = this.data.map(d => d.date);

    const xScale = d3
      .scaleBand()
      .range([marginHorizontal, width])
      .domain(dates)
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .range([height, marginVertial])
      .domain([0, valueMax]);

    const xAxis = d3.axisBottom(xScale).tickFormat(date => formatter(parser(date)));
    const yAxis = d3.axisLeft(yScale);

    d3.select('svg')
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);

    d3.select('svg')
      .append('g')
      .attr('class', 'y axis')
      .attr('transform', `translate(${marginVertial}, 0)`)
      .call(yAxis);

    svg
      .selectAll('rect')
      .data(this.data)
      .enter()
      .append('rect')
      .attr('x', d => xScale(d.date))
      .attr('y', d => yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', d => yScale(0) - yScale(d.value))
      .attr('fill', 'red');
  }
}
