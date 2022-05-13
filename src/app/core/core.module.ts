import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AgmCoreModule } from '@agm/core';   
import { LoginComponent } from './access/login/login.component';
import { RegisterComponent } from './access/register/register.component';
import { HomeComponent } from './dashboard/home/home.component';
import { SignalDataComponent } from './rms-catalog/signal-data/signal-data.component';
import { CoreRoutingModule } from './core-routing/core-routing.module';
import { SharedModule } from '../shared/shared.module';
import { GroupsModule } from '../core/dashboard/groups-module/groups.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResetPasswordComponent } from './access/reset-password/reset-password.component';
import { AngularMaterialModule } from '../shared/angular-material/angular-material.module';
import { DashboardViewComponent, PetronashConfigPopup,DateRangeConfigurePopup,tvsUtilizationConfigPopup,ReleaseAssetsPopup} from './dashboard/dashboard-view/dashboard-view.component';
import { SelectDeviceComponent, ConfirmationDialog, mobileSignalListDialog } from './dashboard/select-device/select-device.component';
import { CompareComponent } from './dashboard/compare/compare.component';
import { DeviceComponent, DeviceInfoDialog, DeviceDetailsComponent, DeviceEditComponent, DeviceDeletePopup, DeviceClonePopup,DeviceSignalsDeletePopup } from './rms-catalog/device/device.component';

// import { ClickOutsideModule } from 'ng-click-outside';
import { SignalComponent, SignalDetailsPopup, SignalEditPopup, SignalDeletePopup, AddSignalPopup,SignalsDeleteAlarmPopup } from './dashboard/signal/signal.component';
import { AccountSettingComponent, CameraImagePopup,EditUserPopup,InactiveUserPopup } from './dashboard/account-setting/account-setting.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';  
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AngularResizedEventModule } from 'angular-resize-event';
import { DragDropModule } from '@angular/cdk/drag-drop';
// import { GroupsComponent, GroupDialog, DeleteGroupDialog } from './dashboard/groups/groups.component';
// import { GroupViewComponent, DeleteSignalDialog, AddSignalDialog } from './dashboard/group-view/group-view.component';
import { MapComponent } from './dashboard/map/map.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { CertificateComponent } from './dashboard/certificate/certificate.component';
import { parametercomponenetdialog, ReportComponent, reportdatadialog, SelectSignalsDetailsDialog,logsheetThresholdConfigPopup } from './dashboard/report/report.component';
import { DashboardCustomViewComponent } from './dashboard/dashboard-custom-view/dashboard-custom-view.component';
import { AlarmComponent,AddAlarmPopup,AlarmDetailsPopup,AlarmDeletePopup} from './dashboard/alarm/alarm.component';
import { environment as env } from 'src/environments/environment';
import { MqttConfig } from './rms-services/mqtt-service/mqtt.config';
import { MqttService } from './rms-services/mqtt-service/mqtt.service';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { LoadingComponent } from './dashboard/report/loading';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { UserDashboardsListComponent } from './dashboard/user-dashboards-list/user-dashboards-list.component';
export function getMqttConfig(): MqttConfig {
  return {
    hostname: env.mqtt.server,
    port: env.mqtt.port,
    path: env.mqtt.path,
    protocol: env.mqtt.protocol === 'mqtt' ? 'mqtt' : env.mqtt.protocol === 'wss' ? 'wss' : 'ws'
  }
}


@NgModule({
  declarations: [LoginComponent, RegisterComponent, HomeComponent, SignalDataComponent, ResetPasswordComponent,
    DashboardViewComponent, SelectDeviceComponent, CompareComponent, ConfirmationDialog, DeviceComponent,
    SignalComponent, AccountSettingComponent, DeviceInfoDialog, CameraImagePopup,
    SignalDetailsPopup, SignalEditPopup, SignalDeletePopup, AddSignalPopup, MapComponent, mobileSignalListDialog, ReportComponent,
    CertificateComponent, SelectSignalsDetailsDialog,reportdatadialog,parametercomponenetdialog, DashboardCustomViewComponent, DeviceDetailsComponent, DeviceEditComponent, DeviceDeletePopup, 
    AlarmComponent,EditUserPopup,InactiveUserPopup,
    CertificateComponent, SelectSignalsDetailsDialog, DashboardCustomViewComponent, DeviceDetailsComponent, DeviceEditComponent, DeviceDeletePopup, DeviceClonePopup,
    AlarmComponent,EditUserPopup,InactiveUserPopup,PetronashConfigPopup,DateRangeConfigurePopup,AddAlarmPopup,AlarmDetailsPopup,AlarmDeletePopup,LoadingComponent,logsheetThresholdConfigPopup,
    tvsUtilizationConfigPopup,DeviceSignalsDeletePopup,SignalsDeleteAlarmPopup, UserDashboardsListComponent,ReleaseAssetsPopup
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    InfiniteScrollModule,
    CoreRoutingModule,
    SharedModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    // ClickOutsideModule,
    ImageCropperModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    MatTooltipModule, 
    MatSlideToggleModule,
    ColorPickerModule,
    GroupsModule,
    AngularResizedEventModule,
    DragDropModule,
    AgmCoreModule.forRoot({ 
      apiKey: 'AIzaSyDu98fEELb_sXzQ3bHCAPSYR3gub9ocLjs',
      libraries: ['places']
    }),
    FilterPipeModule,
    NgxMaterialTimepickerModule
  ],
  entryComponents: [ConfirmationDialog, DeviceInfoDialog, CameraImagePopup,
    SignalDetailsPopup, SignalEditPopup, SignalDeletePopup, AddSignalPopup, mobileSignalListDialog,
    SelectSignalsDetailsDialog,reportdatadialog, parametercomponenetdialog,DeviceDetailsComponent, DeviceEditComponent, DeviceDeletePopup,
EditUserPopup,InactiveUserPopup, SelectSignalsDetailsDialog, DeviceDetailsComponent, DeviceEditComponent, DeviceDeletePopup,DeviceClonePopup,
EditUserPopup,InactiveUserPopup,PetronashConfigPopup,DateRangeConfigurePopup,AddAlarmPopup,AlarmDetailsPopup,AlarmDeletePopup,logsheetThresholdConfigPopup,
tvsUtilizationConfigPopup,DeviceSignalsDeletePopup,SignalsDeleteAlarmPopup,ReleaseAssetsPopup],
  exports: [GroupsModule],
  providers: [{ provide: 'MqttConfig', useFactory: getMqttConfig }]
})
export class CoreModule { }
