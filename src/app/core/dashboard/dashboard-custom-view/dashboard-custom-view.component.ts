import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../rms-services/dashboard/dashboard.service';
import { io } from 'socket.io-client';

import { environment } from 'src/environments/environment';
import { DashboarviewResponse } from '../../rms-interfaces/dashboard/dashboard-view/dashboard-view-response';
// Import the resized event model
import { ResizedEvent } from 'angular-resize-event';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { LogingViewResponse } from '../../rms-interfaces/dashboard/dashboard-view/LoginViewResponse';
import { MqttService } from '../../rms-services/mqtt-service/mqtt.service';
import { ToastrService } from 'ngx-toastr';
interface device {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'elpis-rms-dashboard-custom-view',
  templateUrl: './dashboard-custom-view.component.html',
  styleUrls: ['./dashboard-custom-view.component.scss']
})
export class DashboardCustomViewComponent implements OnInit {

  moredrop: boolean = false;
  inlinedevice = "";
  socket;
  socketSignalLive;
  width: number;
  height: number;
  devicelist: device[] = [
    { value: 'Custom', viewValue: 'Custom' },
    { value: 'Bar', viewValue: 'Bar' },
    { value: 'Ruler', viewValue: 'Ruler' },
    { value: 'Gauge', viewValue: 'Gauge' }
  ];

  data;
  dashboardLoading: boolean;
  devicedata: any[];
  rulerseries;
  gaugeseries;
  rmsAct: any;
  accountdetails = {
    email: "sharan.g@elpis.com",
    password: "Test123"
  }
  constructor(private _dashboardservice: DashboardService, private toastr: ToastrService,
    private _mqttService: MqttService) { }

  ngOnInit() {
    let accountObject = sessionStorage.getItem('rmsAccount');
    this.rmsAct = JSON.parse(accountObject);

    if (this._mqttService.isConnected) {
      this._mqttService.connect(this.rmsAct.email, this.rmsAct.password).finally(() => {
        this._mqttService.isConnected = true;
        console.log("mqtt connected from dashboard");
      })
    }
    // this.socket = io(environment.SOCKET_ENDPOINT);
    // this.socket.on('update', (data: any) => {
    //   console.log(data);
    //   var str = String.fromCharCode.apply(String, data);
    //   console.log(str);

    //   this.socketSignalLive = JSON.parse(str);

    //   this.devicedata.map(x=>{
    //     let result=this.socketSignalLive.filter(y=> y.deviceId==x.deviceModel.deviceId && y.signalId==x.signalModel.signalId);
    //     if(result.length>0) { 
    //       x.signalDataModels[0]['dataValue']= result[0].dataValue;
    //       x.deviceModel.dateOfInstallation= result[0].dateOfInstallation;
    //      }
    //     return x;
    //   })
    // });

    this.accountdetails.email = this.rmsAct.email;
    this.accountdetails.password = this.rmsAct.password;
    this.dashboardLoading = true;
    this._dashboardservice.getAllSignals(this.accountdetails).subscribe(
      (data: LogingViewResponse) => {
        console.log(data, "data checking");
        let x: any = data['userAccountModel'];
        this.dashboardLoading = false;
        this.devicedata = JSON.parse(x.userPreference);
        if (this.devicedata == null) {
          this.devicedata = []
        }
        console.log(this.devicedata, "device data checking");
      },
      error => {
        console.error(error);
        this.toastr.error(error?.errorMessage)

      },
      () => console.log('COMPLETE')
    );
  }

  opensnack(text: string): void {
    console.log(text);
  }
  onResized(event: ResizedEvent) {
    this.width = event.newWidth;
    this.height = event.newHeight;
  }

  onDrop(event: CdkDragDrop<any>) {
    this.devicedata[event.previousContainer.data.index] = { ...event.container.data.item }
    this.devicedata[event.container.data.index] = { ...event.previousContainer.data.item }
    event.currentIndex = 0;
    console.log(event.previousContainer.data, '-->', event.container.data);
    // console.log('cur -> '+event.currentIndex, 'pre -> '+event.previousIndex)
    // moveItemInArray(this.devicedata, event.previousIndex, event.currentIndex);
  }

  Device1(item) {
    item.widgetTypeModel.bar = true;
    item.widgetTypeModel.rule = false;
    item.widgetTypeModel.gauge = false;
    item.widgetTypeModel.solidGauge = false;
    item.widgetTypeModel.needlePointer = false;
    item.rangeCustom = false;
  }
  Device2(item) {
    item.widgetTypeModel.bar = false;
    item.widgetTypeModel.rule = true;
    item.widgetTypeModel.gauge = false;
    item.widgetTypeModel.solidGauge = false;
    item.widgetTypeModel.needlePointer = false;
    item.rangeCustom = false;
  }
  Device3(item) {
    item.widgetTypeModel.bar = false;
    item.widgetTypeModel.rule = false;
    item.widgetTypeModel.gauge = true;
    item.widgetTypeModel.solidGauge = false;
    item.widgetTypeModel.needlePointer = false;
    item.rangeCustom = false;
  }

  Device4(item) {
    item.widgetTypeModel.bar = false;
    item.widgetTypeModel.rule = false;
    item.widgetTypeModel.gauge = false;
    item.widgetTypeModel.solidGauge = true;
    item.widgetTypeModel.needlePointer = false;
    item.rangeCustom = false;
  }
  Device5(item) {
    item.widgetTypeModel.bar = false;
    item.widgetTypeModel.rule = false;
    item.widgetTypeModel.gauge = false;
    item.widgetTypeModel.solidGauge = false;
    item.widgetTypeModel.needlePointer = true;
    item.rangeCustom = false;
  }
  Device6(item) {
    item.widgetTypeModel.bar = false;
    item.widgetTypeModel.rule = false;
    item.widgetTypeModel.gauge = false;
    item.widgetTypeModel.solidGauge = false;
    item.widgetTypeModel.needlePointer = false;
    item.rangeCustom = true;
  }
  deviceglobalchange(device) {
    console.log(device, "device global checking");
    if (device.value == "Bar") {
      console.log("bar")
      for (let i = 0; i < this.devicedata.length; i++) {
        this.devicedata[i].widgetTypeModel.bar = true;
        this.devicedata[i].widgetTypeModel.rule = false;
        this.devicedata[i].widgetTypeModel.gauge = false;
      }
    }
    if (device.value == "Ruler") {
      for (let i = 0; i < this.devicedata.length; i++) {
        this.devicedata[i].widgetTypeModel.bar = false;
        this.devicedata[i].widgetTypeModel.rule = true;
        this.devicedata[i].widgetTypeModel.gauge = false;
      }
      console.log("Ruler")
    }
    if (device.value == "Gauge") {
      for (let i = 0; i < this.devicedata.length; i++) {
        this.devicedata[i].widgetTypeModel.bar = false;
        this.devicedata[i].widgetTypeModel.rule = false;
        this.devicedata[i].widgetTypeModel.gauge = true;
      }
      console.log("Gauge")
    }
  }

}
 