import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import * as solidgauge from 'highcharts/modules/solid-gauge';
declare var require: any;
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/solid-gauge')(Highcharts);
require('highcharts/modules/heatmap')(Highcharts);
require('highcharts/modules/treemap')(Highcharts);
require('highcharts/modules/funnel')(Highcharts);
@Component({
  selector: 'elpis-rms-activity-gauge',
  templateUrl: './activity-gauge.component.html',
  styleUrls: ['./activity-gauge.component.scss']
})
export class ActivityGaugeComponent implements OnInit {
  chartOptions = {};
  Highcharts = Highcharts;
  seriesdata:number; 
  constructor() { }

  ngOnInit(): void {
    this.renderActivityGaugeGraph();
  }

  renderActivityGaugeGraph(){
    // this.seriesdata = parseInt(this.series);
    this.chartOptions = {
      chart: {
        type: 'solidgauge'
      },
      title: {
        text: ''
      },
      pane: {
        center: ['50%', '85%'],
        size: '140%',
        startAngle: -100,
        endAngle: 100,
        background: {
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
            shape: 'full'
        }
    },
      tooltip: {
        enabled: false
      },
      // the value axis
      yAxis: {
        stops: [
          [10, 'green'], // green
          [100, 'yellow'], // yellow
          [200, 'red'] // red
          
        ],
        length: 5,
        lineWidth: 0,
        minorTickInterval: null,
        tickAmount: 2,
        title: {
          y: -70
        },
        labels: {
          y: 16
        },
        min: 0,
        max: 200,
        plotBands: [
          // { from: 0, to: 100, color: 'green' },
          // { from: 100, to: 120, color: 'yellow' },
          // { from: 120, to: 200, color: 'red' }
        ]
      },
      plotOptions: {
        solidgauge: {
          dataLabels: {
            y: 5,
            borderWidth: 0,
            useHTML: true
          }
        }
      },
      series: [
        {
          data: [100]
        }
      ]
    };
  
  
 
  }


}
