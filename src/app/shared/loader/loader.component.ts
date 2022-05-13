import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'elpis-rms-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  @Input() isLoading: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

}
