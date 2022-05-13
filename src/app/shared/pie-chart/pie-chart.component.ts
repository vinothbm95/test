import { Component, VERSION ,OnInit ,Input, OnChanges, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';

declare var require: any;
// const More = require('highcharts/highcharts-more');
// More(Highcharts);

// const Exporting = require('highcharts/modules/exporting');
// Exporting(Highcharts);

// const ExportData = require('highcharts/modules/export-data');
// ExportData(Highcharts);

// const Accessibility = require('highcharts/modules/accessibility');
// Accessibility(Highcharts);

@Component({
  selector: 'elpis-rms-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit ,OnChanges {
  Highcharts = Highcharts;
// @Input() index;
    @Input()series: any ;
    public chartOptions: any ;
 

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(){
    this.optionRender();
   // Highcharts.chart('container', this.chartOptions);
    console.log(this.chartOptions.series);
    
  }

  

  optionRender(){
    this.chartOptions= {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: true,
            type: 'pie'
        },
        title: {
            text: 'Status Pie Chart'
        },
        tooltip: {
            pointFormat: '<b>{point.percentage:.2f}%</b> '
        },
        
        plotOptions: {
          pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                  enabled: true,
                  format: '<b>{point.name}</b>: {point.percentage:.2f} %',
                  style: {
                      color: (Highcharts.theme && Highcharts.theme) || 'black'
                  }
              },
              showInLegend: true
          }
      },
        series: this.series
      }
  }
//   ngOnChanges(){
//     this.isDataPresent=true;
//     this.optionRender();
//     Highcharts.chart('container', this.options);
//     console.log(this.options.series);

//   }
 

}
