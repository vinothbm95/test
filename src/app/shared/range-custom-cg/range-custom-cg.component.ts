import { Component, ViewEncapsulation, ViewChild, OnInit, Input, SimpleChanges } from '@angular/core';
import { ILoadedEventArgs, IPointerDragEventArgs, ITooltipRenderEventArgs, GaugeTheme } from '@syncfusion/ej2-circulargauge';
import { CircularGaugeComponent } from '@syncfusion/ej2-angular-circulargauge';

@Component({
  selector: 'elpis-rms-range-custom-cg',
  templateUrl: './range-custom-cg.component.html',
  styleUrls: ['./range-custom-cg.component.scss']
})
export class RangeCustomCgComponent implements OnInit {
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
  @ViewChild('tooltipContainer')
    public circulargauge: CircularGaugeComponent;
    public cap: Object = { radius: 5, border: { color: '#33BCBD', width: 0 } };
    public animation: Object = { enable: true, duration: 1500 };
    // public title: string = 'Tooltip Customization';
    //Initializing titleStyle
    public titleStyle: Object = { size: '10px', color: 'grey' };
    public majorTicks: Object = { color: 'white', offset: 0, height: 2 };
    public minorTicks: Object = { width: 0 };
    public labelStyle: Object = { useRangeColor: true, font: { color: 'black', size: '18px', fontFamily: 'Roboto' } };
    public lineStyle: Object = { width: 2 };


    //Initializing Tooltip
    public tooltip: Object = {
        // type: ['Pointer', 'Range'],
        enable: true,  
        enableAnimation: true
        
        
    };
    public rangeWidth: number = 10;

//another chart end

  constructor() { }

  ngOnInit(): void {
this.renderRangcustomGraph();
   
  }

  renderRangcustomGraph(){
    this.seriesVal = this.series;
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
  }
   else if(this.ind == 3){
        this.height = "600"
        this.width = "600"
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
}
ngOnChanges(changes: SimpleChanges): void {
  //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
  //Add '${implements OnChanges}' to the class.
  this.renderRangcustomGraph();
  
}
  public load(args: ILoadedEventArgs): void {
    let selectedTheme: string = location.hash.split('/')[1];
    selectedTheme = selectedTheme ? selectedTheme : 'Material';
    args.gauge.theme = <GaugeTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1));
}

}
