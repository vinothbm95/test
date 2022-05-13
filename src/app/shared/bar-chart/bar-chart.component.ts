import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'elpis-rms-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {
  chartOptions = {};
  Highcharts = Highcharts;
  rulerseries;
  @Input() series;
  @Input() rulercolor;
  @Input() signal;
  seriesdata:number; 
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

  constructor() { }

  ngOnInit() {  
    
      console.log(this.sensorMin,this.sensorMax,"min and max values checking")
    //   if(this.sensorMin < 0){
    //     this.seriesdata = 0
    //   }
    
      this.renderRuleGraph();  
  }


  renderRuleGraph() {
    console.log(this.ind,"index checking");
    if(this.grid1){
        if(this.ind == 4 ){
            this.height = "600"
            this.width = "500"
        } 
        else if(this.ind == 1){
            this.height = "200"
            this.width = "600"
        }
        else if(this.ind == 3 || this.ind == 5 ){
           this.height = "200"
           this.width = "600"
       }
        else{
         this.height = "200"
         this.width = "300"
        }
       }else if(this.grid2){
        if(this.ind == 4){
            this.height = "200"
            this.width = "800"
        }
       
        else{
         this.height = "200"
         this.width = "300"
        }
       }
       else if(this.grid3){
        if(this.ind == 3){
            this.height = "600"
            this.width = "600"
        }else if(this.ind == 4 || this.ind == 5 || this.ind == 6 || this.ind == 7){
            this.height = "250"
            this.width = "300"
        }
        else{
         this.height = "200"
         this.width = "300"
        }
       }
       else if(this.grid4){
        if(this.ind == 4 || this.ind == 5 || this.ind == 6 || this.ind == 7){
            this.height = "200"
            this.width = "600"
        } 
       else{
         this.height = "200"
         this.width = "300"
        }
       }else if(this.customsize){
        //    alert("custom")
        this.height = "94"
        this.width = "100"
       }
       else{
        //    alert("else")
        this.height = "200"
        this.width = "300"
         //   alert("other grid")
       }
    // this.series ="10"
    this.seriesdata = parseInt(this.series);
    if(this.sensorMax < this.seriesdata){
        this.seriesdata = this.sensorMax;
    }
    this.rulerseries = [
        {
            name: this.signal,
            data: [this.seriesdata],
            color: this.rulercolor != null ? this.rulercolor:'green'
        }
    ]
    console.log(this.rulerseries,"ruler series")
        // this.rulerseries = [
        //     {
        //         name: this.seriesdata,
        //         y: this.seriesdata,
        //         drilldown:this.seriesdata
        //     }
        // ]
      this.chartOptions = {
          // chart: {
          //    type: 'column'
          // },
          // title: {
          //    text: ''
          // },
          // subtitle:{
          //    text: '' 
          // },
          // xAxis:{
          //    categories:this.rulerseries.data,
          //    crosshair: false       
          // },     
          // yAxis : {
          //    min: 0,
          //    title: {
          //       text: ''         
          //    }      
          // },
          // tooltip : {
          //    enabled:false,
          //    // headerFormat: '<span style = "font-size:10px">{point.key}</span><table>',
          //    // pointFormat: '<tr><td style = "color:{rulerseries.color};padding:0"> </td>' +
          //    //    '<td style = "padding:0"><b>{rulerseries.data} </b></td></tr>', footerFormat: '</table>', shared: true, useHTML: true
          // },
          // plotOptions : {
          //    column: {
          //       pointPadding: 0.2,
          //       borderWidth: 0,
          //       fontSize:20,

          //      //  borderRadiusTopLeft: 10,
          //      // borderRadiusTopRight: 10
          //      dataLabels: {
          //       enabled: true,
          //       style: {
          //          fontWeight: 'bold',
          //          fontSize: '20px',
          //          position:'relative',
          //          top:'-20px'
          //       }

          //    }


          //    }
          // },
          // credits:{
          //    enabled: false
          // },
          // series: this.rulerseries

          chart: {
              type: 'column',
              height: this.height,
            //   width: this.width
          },
          title: {
              text: ''
          },
          subtitle: {
              text: ''
          },
          accessibility: {
              announceNewData: {
                  enabled: true
              }
          },
          xAxis: {
              categories: [],
              crosshair: false,
              title: {
                  text: ''  
              }
          },
          yAxis: {
            min: this.sensorMin,
            // max: this.sensorMax,
              title: {
                  text: ''
              }

          },
          legend: {
              enabled: false
          },
          plotOptions: {
              series: {
                  borderWidth: 0,
                  dataLabels: {
                      enabled: false,


                      style: {
                        //   fontWeight: 'bold',
                        //   fontSize: '20px',
                        //   textAlign: 'center',

                      },


                    //   format: '{point.y}'
                  }
              }
          },

          tooltip: {
              enabled: false,
              //  headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
              //  pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
          },
          series: this.rulerseries
          //  series: [
          //      {
          //          name: "Browsers",
          //          colorByPoint: true,
          //          data: this.rulerseries
          //      }
          //  ]

      };
  }

ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.renderRuleGraph();
    
}

}
