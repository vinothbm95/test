import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'elpis-rms-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
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
