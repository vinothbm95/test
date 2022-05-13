import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'elpis-rms-digital-rotation-onff',
  templateUrl: './digital-rotation-onff.component.html',
  styleUrls: ['./digital-rotation-onff.component.scss']
})
export class DigitalRotationOnffComponent implements OnInit {
@Input() signalDataType;
  constructor() { }

  ngOnInit(): void {
    this.signalDataType = 1;
  }

}
