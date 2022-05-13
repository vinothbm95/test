import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import * as solidgauge from 'highcharts/modules/solid-gauge';
declare var require: any;
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/solid-gauge')(Highcharts);
require('highcharts/modules/heatmap')(Highcharts);
require('highcharts/modules/treemap')(Highcharts);
require('highcharts/modules/funnel')(Highcharts);
@Component({
  selector: 'elpis-rms-solid-gauge',
  templateUrl: './solid-gauge.component.html',
  styleUrls: ['./solid-gauge.component.scss']
})
export class SolidGaugeComponent implements OnInit {
  @Input() series;
@Input() signal;
@Input() threshold;
@Input() sensorMin:any;
@Input() sensorMax:any;
@Input() rulercolor:any;
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
  seriesdata; 
  constructor() { }
  ngOnInit(): void {
    this.renderSolidGaugeGraph();
  }
  renderSolidGaugeGraph(){
    this.rulercolor =  this.rulercolor ?  this.rulercolor : "#58d126";
    console.log(this.rulercolor,"this.rulercolor checking")
    console.log(this.ind,"index checking");
    if(this.grid1){
      if(this.ind == 4 ){
          this.height = "350"
          this.width = "550"
      } 
      else if(this.ind == 1){
          this.height = "200"
          this.width = "600"
      }
      else if(this.ind == 3 || this.ind == 5 ){
         this.height = "250"
         this.width = "600"
     }
 
   else{
       this.height = "190"
       this.width = "250"
      }
     }else if(this.grid2){
      if(this.ind == 4){
          this.height = "200"
          this.width = "800"
      }else if(this.ind == 5){
        this.height = "200"
        this.width = "400"
    }else if(this.ind == 6){
      this.height = "200"
      this.width = "600"
  }
     
      else{
       this.height = "190"
       this.width = "250"
      }
     }
     else if(this.grid3){
      if(this.ind == 3){
          this.height = "400"
          this.width = "600"
      }else if(this.ind == 1){
        this.height = "190"
        this.width = "600"
    }else if(this.ind == 4 || this.ind == 5 || this.ind == 6 || this.ind == 7){
      this.height = "160"
      this.width = "250"
    }else{
      this.height = "190"   
      this.width = "250"
      }
     }
     else if(this.grid4){
      if(this.ind == 4 || this.ind == 5 || this.ind == 6 || this.ind == 7){
          this.height = "190"
          this.width = "600"
      } 
     else{
       this.height = "190"
       this.width = "250"
      }
     }else if(this.customsize){
      this.height = "95"
      this.width = "125"
     }
     else{       
      this.height = "180"
      this.width = "250"
       //   alert("other grid") 
     }
    this.seriesdata = parseInt(this.series);
    this.chartOptions = {
      chart: {
        type: 'solidgauge',
        height:this.height,
        width: this.width
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
          ['',this.rulercolor], // green
          // [100, 'yellow'], // yellow
          // [200, 'red'] // red
          
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
        min: this.sensorMin,
        max: this.sensorMax,
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
          data: [this.seriesdata]
        }
      ]
    };     
  
  
 
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.renderSolidGaugeGraph();
    
}
}