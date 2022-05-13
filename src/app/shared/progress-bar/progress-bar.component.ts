import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'elpis-rms-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {
  @Input() progressdata:any;
  @Input() signallist:any;
  @Input() progresscolor:any;
  @Input() sensorMin:any;
  @Input() sensorMax:any;
  @Input() signal:any;
  @Input() heightsetting;
  @Input() grid1;
@Input() grid2;
@Input() grid3;
@Input() grid4;
@Input() customsize;
@Input() ind;

height;
width;
gridOneShow:boolean = false;
  coursesPercentage;
  constructor() { }
  datasize;
  ngOnInit(): void {
    if(this.grid1){
      if(this.ind == 4 ){
          this.height = "150"
        
      } 
      else if(this.ind == 3 || this.ind == 5 ){
         this.height = "60"
       
     }
      else{
       this.height = "40"
      
      }
     }else if(this.grid2){
      this.height = "40"
     }
     else if(this.grid3){
     if(this.ind == 3){
          this.height = "150"
         
      }
     
      else{
       this.height = "40"
       
      }
     }
     else if(this.grid4){
      this.height = "40"
     }
     else if(this.customsize){
      this.height = "15"
     }
     else{
      this.height = "40"
     this.gridOneShow = true;
       //   alert("other grid")
     }
    
    console.log(this.datasize,"data size");
    console.log(this.progresscolor,"progress color checking");
    console.log(this.sensorMax,"sensor max");
    console.log(this.sensorMin,"sensor min")
    // setInterval(function () {
    //   var x = (new Date()).getTime(), // current time
    //   y = Math.round(Math.random() * 100);
    //   this.progressdata = y;
    //   console.log(this.progressdata,"contineous")
    //   }, 1000);
    this.percal();

  }

  percal(){
    this.coursesPercentage = (this.progressdata / this.sensorMax) * 100;
    console.log(this.coursesPercentage,"percentage val check")
    this.datasize = this.coursesPercentage + '%';
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    // this.datasize = this.progressdata + '%';
    this.percal();
  }

}
