import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import Exporting from 'highcharts/modules/exporting';

import * as Highcharts from 'highcharts';
import { HighchartsChartComponent } from 'highcharts-angular';
declare var require: any;
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/solid-gauge')(Highcharts);
require('highcharts/modules/heatmap')(Highcharts);
require('highcharts/modules/treemap')(Highcharts);
require('highcharts/modules/funnel')(Highcharts);


import HC_exporting from 'highcharts/modules/exporting';

@Component({
  selector: 'elpis-rms-areaspline-chart',
  templateUrl: './areaspline-chart.component.html',
  styleUrls: ['./areaspline-chart.component.scss']
})
export class AreasplineChartComponent implements OnInit, OnChanges {
  Highchartscertificate = Highcharts;
  chartOptions : Highcharts.Options = {};
  @Input() categories;
  @Input() data : Highcharts.SeriesOptionsType[]; 
  updateFlag = false;
  @Input() yAxisLabel;
  constructor() { 
    
  }


  ngOnInit(): void {
    console.log(this.categories,this.data,"graph data in areas line ngoninit")
    Exporting(Highcharts);
    this.graphRender();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("graph data in areas spline")
    console.log(this.categories,this.data);
   
    // console.log(this.data)
    if(changes.data && !changes.data.firstChange) {
      this.updateChart();
    }
    
  }

  graphRender() {
    //graph start
    this.chartOptions = {
      chart: {
        type: 'areaspline',
        zoomType: 'x',
      },
      title: {
        text: ''
      },
      
      legend: {
        enabled: false,
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'top',
        // x: 150,
        // y: 100,
        x: 0,
        y: 0,
        floating: true,
        borderWidth: 1,
        backgroundColor:
          Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF'
      },
      xAxis: {
        
        categories: this.categories,
        endOnTick: false,
        startOnTick: false,
        min: 0,
        //  max:5.1,
        tickInterval: 1,
        maxPadding: 0,
        plotBands: [{
          // visualize the weekend
          // from: 4.5,
          // to: 6.5,
          // color: 'rgba(68, 170, 213, .2)'
        }]

      },
      yAxis: {
        title: { text: this.yAxisLabel ? this.yAxisLabel : '' }
    },
      tooltip: {
        shared: true,
        valueSuffix: ' units'
      },
      credits: {
        enabled: false
      },
      exporting: {
        enabled: true
      },
      plotOptions: {
        areaspline: {
          fillOpacity: 0.5
        }
      },

      series: this.data,
    }

    // HC_exporting(this.Highchartscertificate);


    // exporting(this.Highchartscertificate);


    //graph end
  }

  updateChart() {
    // console.log(this.chartOptions.xAxis);
    this.chartOptions={xAxis:{categories:this.categories}}
    // this.chartOptions.xAxis = { categories: this.categories }
    console.log(this.chartOptions.xAxis);
    this.chartOptions.series = [];
    this.chartOptions.series = this.data;
    this.updateFlag = true;
  }

}
