import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'elpis-rms-hydac',
  templateUrl: './hydac.component.html',
  styleUrls: ['./hydac.component.scss']
})
export class HydacComponent implements OnInit {
  sidenavmobile;
  constructor() { }

  ngOnInit(): void {
  }

  // SideBarOpen = true;
  // togglesidenav(ev){
  //   this.SideBarOpen = !this.SideBarOpen;
  // }  

  toggleheader(ev){
    document.getElementById("mySidenav").style.width = "250px";
  }


}
