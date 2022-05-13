import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CircularGaugeComponent, ILoadedEventArgs } from '@syncfusion/ej2-angular-circulargauge';

@Component({
  selector: 'elpis-rms-multi-rang-cg',
  templateUrl: './multi-rang-cg.component.html',
  styleUrls: ['./multi-rang-cg.component.scss']
})
export class MultiRangCgComponent implements OnInit {
  @Input() grid1;
  @Input() grid2;
  @Input() grid3;
  @Input() grid4;
  @Input() customsize;
@Input() ind;
@Input() threshold;
@Input() sensorMin:any;
@Input() sensorMax:any;
@Input() series;
height;
width;
seriesVal;
  @ViewChild('range')

  public circulargauge: CircularGaugeComponent;
  public cap: Object = { radius: 5, border: { color: '#33BCBD', width: 10 } };
  public animation: Object = { enable: true, duration: 1500 };
  // public title: string = 'Tooltip Customization';
  //Initializing titleStyle
  public titleStyle: Object = { size: '10px', color: 'grey' };
  public majorTicks: Object = { color: 'grey', offset: 0, height: 2};
  public minorTicks: Object = { width: 0, };
  public labelStyle: Object = { useRangeColor: true, font: { color: 'black', size: '15px', fontFamily: 'Roboto'}, style:{padding:'20px'}};
  public lineStyle: Object = { width: 2 };
  tail = {
    length: '10%', color: '#757575' 
 };
pointerCap = {
    radius: 7, color: '#757575'
  };

constructor() { }


ngOnInit() {
 
this.renderMultiRangeGraph();

}
renderMultiRangeGraph(){
  this.seriesVal = this.series;
  console.log(this.threshold,"multi range threshold checking")
  console.log(this.ind,"index checking");

  if(this.grid1){
    if(this.ind == 4 ){
        this.height = "600"
        this.width = "600"
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
     this.height = "200"
     this.width = "250"
    }
   }else if(this.grid2){
    if(this.ind == 4){
        this.height = "200"
        this.width = "800"
    }
    else if(this.ind == 5){
      this.height = "200"
      this.width = "400"
  }
   else if(this.ind == 6){
    this.height = "200"
    this.width = "600"
  }
    else{
     this.height = "200"
     this.width = "250"
    }
   }
   else if(this.grid3){
    if(this.ind == 1){
        this.height = "200"
        this.width = "600"
    }else if(this.ind == 3){
      this.height = "600"
      this.width = "600"
    }
    else if(this.ind == 4 || this.ind == 5 || this.ind == 6 || this.ind == 7){
      this.height = "250"
      this.width = "250"
    }
    else{
     this.height = "200"
     this.width = "250"
    }
   }
   else if(this.grid4){
    if(this.ind == 4 || this.ind == 5 || this.ind == 6 || this.ind == 7){
        this.height = "200"
        this.width = "600"
    } 
   else{
     this.height = "200"
     this.width = "250"
    }
   }else if(this.customsize){
    this.height = "95"
    this.width = "100"
   }
   else{
    this.height = "200"
    this.width = "250"
     //   alert("other grid")
   }
    // setTimeout(()=>{
  
    
  //   this.lineStyle = {
  
  //     width: 10, color: 'transparent'
  
  //   };
  
  // Initializing LabelStyle
  
  //   this.labelStyle = {
  
  //     position: 'Inside', useRangeColor: false,
  
  //     font: { size: '12px', fontFamily: 'Roboto', fontStyle: 'Regular' }
  
  //   };
  
  //   this.majorTicks = {
  
  //     height: 10, offset: 5, color: '#9E9E9E'
  
  //   };
  
  //   this.minorTicks = {
  
  //     height: 0
  
  //   };
  
    
  // },100)
  
}

ngOnChanges(changes: SimpleChanges): void {
  //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
  //Add '${implements OnChanges}' to the class.
  this.renderMultiRangeGraph();
  
}
  


}
