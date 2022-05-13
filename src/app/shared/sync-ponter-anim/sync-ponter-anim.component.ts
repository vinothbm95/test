import { Component, ViewEncapsulation, ViewChild, OnInit, Input, SimpleChanges } from '@angular/core';
import { CircularGaugeComponent, ILoadedEventArgs, GaugeTheme, GradientService } from '@syncfusion/ej2-angular-circulargauge';
import { timeStamp } from 'console';
// import { DropDownList } from '@syncfusion/ej2-dropdowns';

@Component({
  selector: 'elpis-rms-sync-ponter-anim',
  templateUrl: './sync-ponter-anim.component.html',
  styleUrls: ['./sync-ponter-anim.component.scss'],
  encapsulation: ViewEncapsulation.None,
    providers: [GradientService]
})
export class SyncPonterAnimComponent implements OnInit {
    @Input() grid1;  
    @Input() grid2;
    @Input() grid3;
    @Input() grid4;
    @Input() ind;
    @Input() customsize;
    @Input() threshold;
    @Input() sensorMin:any;
@Input() sensorMax:any;
@Input() series;
    height;
width;
  @ViewChild('gauge')
    public circulargauge: CircularGaugeComponent;
    public load(args: ILoadedEventArgs): void {
        let selectedTheme: string = location.hash.split('/')[1];
        selectedTheme = selectedTheme ? selectedTheme : 'Material';
        args.gauge.theme = <GaugeTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1));
    }
    constructor() {
        // code
    }
    // public rangeLinearGradient: object = {
    //     startValue: '0%',
    //     endValue: '100%',
    //     colorStop: [
    //         { color: '#9E40DC', offset: '0%', opacity: 0.9 },
    //         { color: 'blue', offset: '70%', opacity: 0.9 },
    //     ]
    // };
    // public pointerLinearGradient: Object = {
    //     startValue: '0%',
    //     endValue: '100%',
    //     colorStop: [
    //         { color: '#FEF3F9', offset: '0%', opacity: 0.9 },
    //         { color: 'blue', offset: '70%', opacity: 0.9 }
    //       ]
    // };
    // public rangeRadialGradient: object = {
    //     radius: '50%',
    //     innerPosition: { x: '50%', y: '50%' },
    //     outerPosition: { x: '50%', y: '50%' },
    //     colorStop: [
    //         { color: '#9E40DC', offset: '90%', opacity: 0.9 },
    //         { color: 'blue', offset: '160%', opacity: 0.9 }
    //       ]
    // };
    // public pointerRadialGradient: object = {
    //     radius: '50%',
    //     innerPosition: { x: '50%', y: '50%' },
    //     outerPosition: { x: '50%', y: '50%' },
    //     colorStop: [
    //         { color: '#FEF3F9', offset: '0%', opacity: 0.9 },
    //         { color: 'blue', offset: '60%', opacity: 0.9 }
    //       ]
    // };
    public minorTicks: Object = {
        width: 0
    };
    // , interval: 30
    // public majorTicks: Object = {
    //     width: 0
    // };
    public majorTicks: Object = { color: 'white', offset: 0, height: 2 };
    public ticks: Object = {
        width: 0
    };
    public lineStyle: Object = {
        width: 2
    };
    public startAngle: Object = 210;
    public endangle: Object = 150;
    public radius: Object = '80%';
    public labelStyle: Object = {
        font: {
            fontFamily: 'Roboto',
            size: '12px',
            fontWeight: 'Regular'
        },
        offset:3
    };
    // public pointers: Object[] = [{
    //     animation: { enable: true, duration: 1500 }, value: 65, radius: '60%', color: ''
    //     // pointerWidth: 15,
    //     // cap: { radius: 14, border: { color: '#E63B86', width: 4.5 }, color: 'white' },
    //     // needleTail: { length: '10%' },
    //     // needleStartWidth: 5
    // }];
    pointers: Object[];
    public ranges: Object[];
//     = [
//       {
//         start: 0, end: 65, startWidth: 18, endWidth: 18, color: '#034ec0',
        
//         // linearGradient: this.rangeLinearGradient,
//         // roundedCornerRadius: 10
//     },
//     {
//       start: 65, end: 120, startWidth: 18, endWidth: 18, color: '#d2d2d2',
//       // linearGradient: this.rangeLinearGradient,
//       // roundedCornerRadius: 10
//   }
//   ];
  public animation: Object;
    ngOnInit(): void {
        this.getSyncPoint();
        console.log(this.threshold,"tresold ceckin")
       
      

    }
    
    getSyncPoint(){
        this.ranges = [];
        for(let i=0; i < this.threshold.length;i++){
            if(i == 0){
                this.ranges.push({start: this.sensorMin, end:this.threshold[i]["thresholdValue"], startWidth: 15, endWidth: 15, color: this.threshold[i]["thresholdColor"]})
            }else{
                this.ranges.push({start: this.threshold[i - 1]["thresholdValue"], end:this.threshold[i]["thresholdValue"], startWidth: 15, endWidth: 15, color: this.threshold[i]["thresholdColor"]})
            }
        }
        this.pointers = [{
            animation: { enable: true, duration: 1500 }, value:this.series, radius: '60%', color: ''
            
        }];

        if(this.grid1){
            if(this.ind == 4 ){
                this.height = "600"
                this.width = "600"
            } 
            else if(this.ind == 1){
                this.height = "180"
                this.width = "600"
            }
            else if(this.ind == 3 || this.ind == 5 ){
               this.height = "250"
               this.width = "600"
           }
            else{
             this.height = "180" 
             this.width = "280"
            }
           }else if(this.grid2){
            if(this.ind == 4){
                this.height = "180"
                this.width = "800"
            }else if(this.ind == 5){
                this.height = "200"
                this.width = "350"
            }
            else if(this.ind == 6){
                this.height = "180"
                this.width = "550"
            }
            else{
             this.height = "180"
             this.width = "280"
            }
           }
           else if(this.grid3){
            if(this.ind == 1){
                this.height = "180"
                this.width = "600"
            }
            else if(this.ind == 3){
                this.height = "550"
                this.width = "550"
            }
           
            else{
             this.height = "180"
             this.width = "280"
            }
           }
           else if(this.grid4){
            if(this.ind == 4 || this.ind == 5 || this.ind == 6 || this.ind == 7){
                this.height = "180"
                this.width = "550"
            } 
           else{
             this.height = "180"
             this.width = "280"
            }
           }else if(this.customsize){
            this.height = "95"
            this.width = "120"
           }
           else{
            this.height = "200"
            this.width = "280"
            
           }
        // this.animation= {
        //     enable: true,
        //     duration: 1500
        // };
    }

    ngOnChanges(changes: SimpleChanges): void {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.
        this.getSyncPoint();
        
    }

}
