import { Component, OnInit, } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { DashboardService } from '../../rms-services/dashboard/dashboard.service';
import { MapResponse } from '../../rms-interfaces/dashboard/dashboard-view/map-response';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'elpis-rms-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  myControl1 = new FormControl();
  filteredOptions1;
  lat;

  lng;
  previous;
  devicedata;
  devicemap=[
    {
      isSelected: true,
      deviceId:1,
      deviceName:"Device 1",
      dateOfInstallation:"2020-08-01T10:20:40",
      sensorMin:0,
      sensorMax:400,
      lat: 12.971599,
      lng: 77.594566,
      vechileNumber:"KA 01 AB 2020",
      timing:"15 :27:46",
      vechileSpeed:"30",
      speedCal:"KPH",
      color:"blue",
     widgetTypeModel:{
            area: false,
            bar: false,
            chart: false,
            gauge: false,
            rule: true
        }

    },
    {
      isSelected: true,
      deviceId:2,
      deviceName:"Device 2",
      dateOfInstallation:"2020-08-01T10:20:40",
      sensorMin:0,
      sensorMax:400,
      lat: 17.385044,
      lng: 78.486671,
      vechileNumber:"KA 02  CD 2021",
      timing:"10 :40:05",
      vechileSpeed:"50",
      speedCal:"KPH",
      color:"blue",
      widgetTypeModel:{
            area: false,
            bar: false,
            chart: false,
            gauge: false,
            rule: true
        }

    },
    {
      isSelected: true,
      deviceId:3,
      deviceName:"Device 3",
      dateOfInstallation:"2020-08-01T10:20:40",
      sensorMin:0,
      sensorMax:400,
      lat: 13.082680,
      lng: 80.270721,
      vechileNumber:"KA 03 DE 2022",
      timing:"20 :27:46",
      vechileSpeed:"40",
      speedCal:"KPH",
      color:"blue",
      widgetTypeModel:{
            area: false,
            bar: false,
            chart: false,
            gauge: false,
            rule: true
        }

    }
  ]  
  markers = [
	  {
		  lat: 51.673858,
		  lng: 7.815982,
      label: 'A',
      name:"venu",
      course:"Angular",
		  draggable: true
	  },
	  {
		  lat: 51.373858,
		  lng: 7.215982,
      label: 'B',
      name:"gopal",
      course:"HTML5",
		  draggable: false
	  },
	  {
		  lat: 51.723858,
		  lng: 7.895982,
      label: 'C',
      name:"vgc",
      course:"javascript",
		  draggable: true
	  }
  ]
  name="";
  course="";
 
  devicename:any;
  devicedatadropdown;
  rmsAct:any;
  deviceMapData;
  mapShow;
  constructor(private _dashboardservice:DashboardService, private toastr: ToastrService,) { }


  ngOnInit() {
    let accountObject = sessionStorage.getItem('rmsAccount');
    // let dummyPwd = sessionStorage.getItem('dummyPwd');
    // let selectedUser = sessionStorage.getItem('rmsSelectedUser');
    this.rmsAct = JSON.parse(accountObject);
    // this._dashboardservice.getDeviceData(this.rmsAct.customerId).subscribe(
    //   (data) => {
      
    //     // let x:any = data;
    //     this.devicedatadropdown = data;
    //     this.devicename = this.devicedatadropdown?.map(function(a) {return a["deviceName"];});
    //     console.log(this.devicedatadropdown,"signal data checking")
    //     console.log(this.devicename,"device name checking")
    //   }
    // )

    // this.filteredOptions1 = this.myControl1.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filterdevicename(value))
    // );

    //getting the device map data(lat,lang)
    this.mapShow = true;
    this._dashboardservice.getMapDeviceApi(this.rmsAct.customerId).subscribe(
        (data:MapResponse[]) => {
        console.log(data,"map data checking");
        this.lat = data[0]?.["latitude"];
        this.lng = data[0]?.["longitude"];
        if(typeof this.lat === "string"){
          let num = parseFloat(this.lat);
          this.lat = num;
        }else{
         
        }
        if(typeof this.lng === "string"){
          let num = parseFloat(this.lng);
          this.lng = num;
        }else{
         
        }
        this.deviceMapData = data;
        this.mapShow = false;
     
        },
        error => {
          console.error(error);
          this.mapShow = false;
           this.toastr.error(error?.errorMessage)
        },
        () => console.log('COMPLETE')
      )
  }

  // private _filterdevicename(value: string) {
  //   const filterValue1 = value.toLowerCase();
    
  //   return this.devicename?.filter(option => option?.toLowerCase().indexOf(filterValue1) === 0);
  // }
  filterDevice;
  getDeviceName(){
    console.log(this.myControl1.value)

    console.log(this.devicedatadropdown.filter(x => x.deviceName === this.myControl1.value),"filrer device data in map");

    let device = 1;

    this._dashboardservice. getDeviceSignalDetails(device).
    subscribe(
      (res)=>{
        console.log(res,"all signals checkinf")
      }
    )

  }
  clickedMarker(m,infowindow, i){

    console.log(m,i,"map checking");
    console.log(m,"device map checking");
    this.lat = m.lat;
    this.lng = m.lng;
  this.devicedata = m;
  if (this.previous) {
    this.previous.close();
}
this.previous = infowindow;

  }

  getlng(lang){
    // for(let i = 0; i < this.devicedata?.length; i++){
      // if(this.devicedata[i].signalModel?.signalName == 'Longitude'){
        console.log(typeof lang)
        if(typeof lang === "string"){
          let num = parseInt(lang);
          return num;
        }else{
          return lang;
        }
       
      // }
    // }
  } 
  getlat(lang){
    console.log(typeof lang)
    if(typeof lang === "string"){
      let num = parseInt(lang);
      return num;
    }else{
      return lang;
    }
  }


}
