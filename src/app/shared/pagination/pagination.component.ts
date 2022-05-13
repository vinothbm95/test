import { Component, Input, OnInit } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';
@Component({
  selector: 'elpis-rms-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
@Input() config;
  constructor() { }

  ngOnInit(): void {
    console.log(this.config,"config check")
  }
  pageChanged(event){
    this.config.currentPage = event;
  }

}
