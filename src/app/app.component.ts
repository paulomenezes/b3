import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as $ from 'jquery';
import B3 from './b3/b3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  data = [
    {
      pickUpDate: '2019-03-12',
      pickUpCount: 103,
      occupancyRate: 30.61,
      occupancyCount: 932.92,
      lorSum: 8558,
      lorCount: 1133,
      expectedPickUpRate: 6.76,
      ticketPriceSum: 6188.78,
      ticketPriceCount: 103,
      vehicleClassCount: 3048,
      store: null,
    },
    {
      pickUpDate: '2019-03-13',
      pickUpCount: 127,
      occupancyRate: 30.25,
      occupancyCount: 922.08,
      lorSum: 11176,
      lorCount: 1397,
      expectedPickUpRate: 8.33,
      ticketPriceSum: 7731.79,
      ticketPriceCount: 127,
      vehicleClassCount: 3048,
      store: null,
    },
    {
      pickUpDate: '2019-03-14',
      pickUpCount: 128,
      occupancyRate: 30.99,
      occupancyCount: 944.58,
      lorSum: 9405,
      lorCount: 1408,
      expectedPickUpRate: 8.4,
      ticketPriceSum: 7766.64,
      ticketPriceCount: 128,
      vehicleClassCount: 3048.08,
      store: null,
    },
    {
      pickUpDate: '2019-03-15',
      pickUpCount: 156,
      occupancyRate: 32.63,
      occupancyCount: 994.67,
      lorSum: 10010,
      lorCount: 1716,
      expectedPickUpRate: 10.24,
      ticketPriceSum: 10292.68,
      ticketPriceCount: 156,
      vehicleClassCount: 3048,
      store: null,
    },
    {
      pickUpDate: '2019-03-16',
      pickUpCount: 126,
      occupancyRate: 33.07,
      occupancyCount: 1008.08,
      lorSum: 10076,
      lorCount: 1386,
      expectedPickUpRate: 8.27,
      ticketPriceSum: 7639.37,
      ticketPriceCount: 126,
      vehicleClassCount: 3047.92,
      store: null,
    },
    {
      pickUpDate: '2019-03-17',
      pickUpCount: 79,
      occupancyRate: 31.28,
      occupancyCount: 953.33,
      lorSum: 8261,
      lorCount: 869,
      expectedPickUpRate: 5.18,
      ticketPriceSum: 4469.45,
      ticketPriceCount: 79,
      vehicleClassCount: 3048,
      store: null,
    },
    {
      pickUpDate: '2019-03-18',
      pickUpCount: 104,
      occupancyRate: 28.54,
      occupancyCount: 869.92,
      lorSum: 9328,
      lorCount: 1144,
      expectedPickUpRate: 6.82,
      ticketPriceSum: 6358.04,
      ticketPriceCount: 104,
      vehicleClassCount: 3048.17,
      store: null,
    },
  ];

  ngOnInit(): void {
    new B3(this.data, {
      bindTo: '#bar',
      axis: {
        x: {
          column: 'pickUpDate',
          parser: '%Y-%m-%d',
          formatter: '%d/%m',
        },
      },
      columns: [
        {
          type: 'bar',
          name: 'occupancyRate',
          color: '#008BFF',
        },
        {
          type: 'bar',
          name: 'expectedPickUpRate',
          color: '#FFAA00',
        },
      ],
    });

    new B3(this.data, {
      bindTo: '#line',
      axis: {
        x: {
          column: 'pickUpDate',
        },
      },
      columns: [
        {
          type: 'bar',
          name: 'occupancyRate',
          color: '#008BFF',
        },
      ],
    });
  }
}
