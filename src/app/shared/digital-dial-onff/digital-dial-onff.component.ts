import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'elpis-rms-digital-dial-onff',
  templateUrl: './digital-dial-onff.component.html',
  styleUrls: ['./digital-dial-onff.component.scss']
})
export class DigitalDialOnffComponent implements OnInit {
@Input() signalDataType;
@Input() grid1;
@Input() grid2;
@Input() grid3;
@Input() grid4;
@Input() customsize;
@Input() ind;
@Input() series;
@Input() chartpopup;
height;
width;
divheight;
imgheight;
  constructor() { }

  ngOnInit(): void {
    this.getDigitalDial();
  }
  getDigitalDial(){
    if(this.grid1){
      if(this.ind == 4 ){
          this.divheight = "620"
          this.imgheight = "620"
      } 
      else{
        this.divheight = "210"
        this.imgheight = "220"
      }
     }else if(this.grid2){
      this.divheight = "210"
      this.imgheight = "220"
     }
     else if(this.grid3){
    
      if(this.ind == 3){
        this.divheight = "620"
        this.imgheight = "620"
      }
     else{
      this.divheight = "210"
      this.imgheight = "220"
      }
     }
     else if(this.grid4){
      this.divheight = "210"
      this.imgheight = "220"
     }else if(this.customsize){
        //  alert("custom")
         this.divheight = "105"
         this.imgheight = "105"
     }else if(this.chartpopup){
    
      this.divheight = "200"
      this.imgheight = "220"
     }
     else{
      this.divheight = "235"
      this.imgheight = "220"
       //   alert("other grid")
     }
    this.signalDataType = this.series;
  }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.getDigitalDial();
    
}
}
 