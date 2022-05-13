import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'elpis-rms-number-card',
  templateUrl: './number-card.component.html',
  styleUrls: ['./number-card.component.scss']
})
export class NumberCardComponent implements OnInit {
  
@Input() series;
@Input() grid1;
@Input() grid2;
@Input() grid3;
@Input() grid4;
@Input() customsize;
@Input() ind;
@Input() chartpopup;
val = 12.0123;
height;
fsize;
linehight;

  constructor() { }

  ngOnInit(): void {
    console.log(this.grid1,this.ind,"checking")
    this.getNumber();
  }
  getNumber(){
    if(this.grid1){ 
      if(this.ind == 4 ){
        this.height = "210";
        this.fsize = "80"
        this.linehight = "200"
      } 
      else{
        this.fsize = "50"
        this.linehight = "200"
      }
     }else if(this.grid2){
      
     }
     else if(this.grid3){
    
      if(this.ind == 3 ){
        this.height = "210";
        this.fsize = "80"
        this.linehight = "200"
      } 
      else{
        this.fsize = "50"
        this.linehight = "200"
      }
     }
     else if(this.grid4){ 
      
     }else if(this.customsize){
        //  alert("custom")
      this.height = "100";
      this.fsize = "30"
      this.linehight = "35"
     }else if(this.chartpopup){
    
      this.height = "200";
      this.fsize = "50"
      this.linehight = "200" 
     }
     else{ 
      this.height = "235";
      this.fsize = "50"
      this.linehight = "200"
       //   alert("other grid")
     }
    
  }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.getNumber();
    
}
}
