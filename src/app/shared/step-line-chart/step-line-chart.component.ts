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
@Component({
  selector: 'elpis-rms-step-line-chart',
  templateUrl: './step-line-chart.component.html',
  styleUrls: ['./step-line-chart.component.scss']
})
export class StepLineChartComponent implements OnInit {
  chartOptions = {};
  Highcharts = Highcharts;
  @Input() categories;
  @Input() data;
  @Input() yAxisLabel;
  constructor() { }

  ngOnInit(): void {
    this.graphRender();
  }
 graphRender() {
   console.log(this.data,"step line graph data ceckin")
    //graph start
    this.chartOptions = {
      chart: {
       
        zoomType: 'x',
      },
      title: {
        text: ''
    },
    //  yAxis: {
    //     categories: ['on','off']
    // },
    yAxis: {
      title: { text: this.yAxisLabel ? this.yAxisLabel : '' }
  },
    xAxis: {
        categories: this.categories
    },
    series: this.data
    }

    // HC_exporting(this.Highchartscertificate);


    // exporting(this.Highchartscertificate);


    //graph end
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log("graph data in areas spline")
    console.log(this.categories,this.data);
    this.graphRender();
    
  }
}
