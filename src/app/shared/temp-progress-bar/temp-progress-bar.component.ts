import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'elpis-rms-temp-progress-bar',
  templateUrl: './temp-progress-bar.component.html',
  styleUrls: ['./temp-progress-bar.component.scss']
})
export class TempProgressBarComponent implements OnInit {
@Input() data;
@Input() customsize;
coursesPercentage;
datasize;
  constructor() { } 

  ngOnInit(): void {
  }
  gettemprature(){
    this.coursesPercentage = (this.data?.signalDataModels[0]?.dataValue / this.data?.signalModel?.signalEndRange) * 100;
    this.datasize = this.coursesPercentage + '%';
  }

ngOnChanges(changes: SimpleChanges): void {
  console.log("graph data in areas spline")
  this.gettemprature();
  
}
}
