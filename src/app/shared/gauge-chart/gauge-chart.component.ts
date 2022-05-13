import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
// import * as Highcharts from 'highcharts';
// import HC_stock from 'highcharts/modules/stock';

import * as Highcharts from 'highcharts';
declare var require: any;
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/solid-gauge')(Highcharts);
require('highcharts/modules/heatmap')(Highcharts);
require('highcharts/modules/treemap')(Highcharts);
require('highcharts/modules/funnel')(Highcharts);

@Component({
  selector: 'elpis-rms-gauge-chart',
  templateUrl: './gauge-chart.component.html',
  styleUrls: ['./gauge-chart.component.scss']
})
export class GaugeChartComponent implements OnInit {
@Input() series; 
@Input() signal;
@Input() threshold;
@Input() sensorMin:any;
@Input() sensorMax:any;
@Input() grid1;
@Input() grid2;
@Input() grid3;
@Input() grid4;
@Input() customsize;
@Input() ind;
@Input() heightparent;
@Input() widthparent;
height;
width;
chartOptions = {};

  Highcharts = Highcharts;
  gaugeseries;
  seriesdata:number; 
  plotbandsThreshold;
  constructor() {
    // HC_stock(Highcharts);
   }

  ngOnInit() {
      this.renderGaugeGraph();
  }

  renderGaugeGraph() {
    this.plotbandsThreshold = [];
      for(let i = 0; i < this.threshold.length; i++){
          if(i == 0){
            this.plotbandsThreshold.push(  {
              from: this.sensorMin,
              to: this.threshold[i]?.['thresholdValue'],
              color: this.threshold[i]?.['thresholdColor']   // green
          }
        )
          }else{
            this.plotbandsThreshold.push(  {
                from: this.threshold[i - 1]?.['thresholdValue'],
                to: this.threshold[i]?.['thresholdValue'],
                color: this.threshold[i]?.['thresholdColor']   // green
            }
          )
          }
      }
      
    if(this.grid1){
        if(this.ind == 4 ){
            this.height = "600"
            this.width = "500"
        } 
        else if(this.ind == 1){
            this.height = "200"
            this.width = "500"
        }
        else if(this.ind == 3 || this.ind == 5 ){
           this.height = "250"
           this.width = "600"
       }
        else{
         this.height = "200"
         this.width = "250"
        }
       }else if(this.grid2){
        if(this.ind == 4){
            this.height = "200"
            this.width = "700"
        }else if(this.ind == 5){
            this.height = "200"
            this.width = "300"
        }
        else if(this.ind == 6){
            this.height = "200"
            this.width = "550"
        }
        else{
         this.height = "200"
         this.width = "250"
        }
       }
       else if(this.grid3){
        if(this.ind == 1){
            this.height = "200"
            this.width = "500"
        }
        else if(this.ind == 3){
            this.height = "550"
            this.width = "550"
        }
       
        else{
         this.height = "200"
         this.width = "250"
        }
       }
       else if(this.grid4){
        if(this.ind == 4 || this.ind == 5 || this.ind == 6 || this.ind == 7){
            this.height = "200"
            this.width = "500"
        } 
       else{
         this.height = "200"
         this.width = "250"
        }
       }else if(this.customsize){
        //    alert("custom")
           this.height = "95"
           this.width = "110"
       }
       else{
        this.height = "200"
        this.width = "250"
         //   alert("other grid")
       }
    //   console.log(this.threshold, "gauge threshold checking");
      this.seriesdata = parseInt(this.series);

      this.gaugeseries = [{
          name: '',
          data: [this.seriesdata]

      }]
      this.chartOptions = {
          chart: {
              type: 'gauge',
              plotBackgroundColor: null,
              plotBackgroundImage: null,
              plotBorderWidth: 0,
              plotShadow: false,
              height:this.height,
              width: this.width
          },

          title: {
              text: ''
          },

          pane: {
              startAngle: -150,
              endAngle: 150,
              background: [{
                  backgroundColor: {
                      linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                      stops: [
                          [0, '#FFF'],
                          [1, '#333']
                      ]
                  },
                  borderWidth: 0,
                  outerRadius: '109%'
              }, {
                  backgroundColor: {
                      linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                      stops: [
                          [0, '#333'],
                          [1, '#FFF']
                      ]
                  },
                  borderWidth: 1,
                  outerRadius: '107%'
              }, {
                  // default background
              }, {
                  backgroundColor: '#DDD',
                  borderWidth: 0,
                  outerRadius: '105%',
                  innerRadius: '103%'
              }]
          },

          // the value axis
          yAxis: {
              min: this.sensorMin,
              max: this.sensorMax,

              minorTickInterval: 'auto',
              minorTickWidth: 1,
              minorTickLength: 10,
              minorTickPosition: 'inside',
              minorTickColor: '#666',

              tickPixelInterval: 30,
              tickWidth: 2,
              tickPosition: 'inside',
              tickLength: 10,
              tickColor: '#666',
              labels: {
                  step: 2,
                  rotation: 'auto'
              },
              title: { 
                  text: ''
              },
              plotBands: this.plotbandsThreshold
            //   plotBands: [
            //       {
            //           from: 0,
            //           to: this.threshold[0]?.['thresholdValue'],
            //           color: this.threshold[0]?.['thresholdColor']   // green
            //       }, {
            //           from: this.threshold[0]?.['thresholdValue'],
            //           to: this.threshold[1]?.['thresholdValue'],
            //           color: this.threshold[1]?.['thresholdColor'] // yellow
            //       }, {
            //           from: this.threshold[1]?.['thresholdValue'],
            //           to: this.threshold[2]?.['thresholdValue'],
            //           color: this.threshold[2]?.['thresholdColor'] // red
            //       },
            //       {
            //           from: this.threshold[2]?.['thresholdValue'],
            //           to: this.threshold[3]?.['thresholdValue'],
            //           color: this.threshold[3]?.['thresholdColor'] // red
            //       },
            //       {
            //           from: this.threshold[3]?.['thresholdValue'],
            //           to: this.threshold[4]?.['thresholdValue'],
            //           color: this.threshold[4]?.['thresholdColor'] // red
            //       }
            //   ]
          },
          tooltip: {
              enabled: false,
              //  headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
              //  pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
          },
          // series: [{
          //     name: 'Speed',
          //     data: [80],
          //     tooltip: {
          //         valueSuffix: ' km/h'
          //     }
          // }]
          series: this.gaugeseries

      },
          // Add some life
          function (chart) {
              if (!chart.renderer.forExport) {
                  setInterval(function () {
                      var point = chart.series[0].points[0],
                          newVal,
                          inc = Math.round((Math.random() - 0.5) * 20);

                      newVal = point.y + inc;
                      if (newVal < 0 || newVal > 200) {
                          newVal = point.y - inc;
                      }

                      point.update(newVal);

                  }, 3000);
              }


          }
  }

  ngOnChanges(changes: SimpleChanges): void {
      //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
      //Add '${implements OnChanges}' to the class.
      this.renderGaugeGraph();
      
  }
  

}
