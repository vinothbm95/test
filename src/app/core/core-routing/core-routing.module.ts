import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../access/login/login.component';
import { RegisterComponent } from '../access/register/register.component';
import { ResetPasswordComponent } from '../access/reset-password/reset-password.component';
import { DashboardViewComponent } from '../dashboard/dashboard-view/dashboard-view.component';
import { DashboardCustomViewComponent } from '../dashboard/dashboard-custom-view/dashboard-custom-view.component'
import { HomeComponent } from '../dashboard/home/home.component'
import { SignalDataComponent } from '../rms-catalog/signal-data/signal-data.component';
import { SelectDeviceComponent } from '../dashboard/select-device/select-device.component';
import { CompareComponent } from '../dashboard/compare/compare.component';
import { DeviceComponent } from '../rms-catalog/device/device.component';
import { DeviceResolverService } from '../dashboard/select-device/device-resolver.service';
import { SignalComponent } from '../dashboard/signal/signal.component';
import { AccountSettingComponent } from '../dashboard/account-setting/account-setting.component';
import { NotFoundComponent } from '../../shared/error-pages/not-found/not-found.component';
// import { GroupsComponent } from '../dashboard/groups/groups.component';
// import { GroupViewComponent } from '../dashboard/group-view/group-view.component'
import { MapComponent } from '../dashboard/map/map.component';
import { CertificateComponent } from '../dashboard/certificate/certificate.component';
import { ReportComponent } from '../dashboard/report/report.component';
import { AlarmComponent } from '../dashboard/alarm/alarm.component';
import { UserDashboardsListComponent } from '../dashboard/user-dashboards-list/user-dashboards-list.component';
const coreRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: RegisterComponent },
  { path: 'reset', component: ResetPasswordComponent },
  {
    path: 'dashboard', component: HomeComponent,
    children: [

      { path: '', component: DashboardViewComponent },
      {  path: 'users', component: DashboardViewComponent},
      {  path: 'users/:userAccountId', component: DashboardViewComponent},
      { path: 'cd', component: DashboardCustomViewComponent },
      { path: 'selectdevice', component: SelectDeviceComponent, resolve: { devicelist: DeviceResolverService } },
      { path: 'user/selectdevice/:id', component: SelectDeviceComponent, resolve: { devicelist: DeviceResolverService } },
      { path: 'signaldata', component: SignalDataComponent },
      { path: 'compare', component: CompareComponent, resolve: { devicelist: DeviceResolverService } },
      { path: 'device', component: DeviceComponent },
      { path: 'signal', redirectTo: 'signal/', pathMatch: 'full' },
      { path: 'signal/:deviceId', component: SignalComponent },
      { path: 'accountsetting', component: AccountSettingComponent },
      { path: 'md', loadChildren: () => import('../dashboard/groups-module/groups.module').then(m => m.GroupsModule) },
      { path: 'users/md', loadChildren: () => import('../dashboard/groups-module/groups.module').then(m => m.GroupsModule) },
      // {path: 'group/:id', component:GroupViewComponent },
      { path: 'map', component: MapComponent },
      { path: 'certificate', component: CertificateComponent },
      { path: 'report', component: ReportComponent },
      { path: 'alarm', component: AlarmComponent, resolve: { devicelist: DeviceResolverService } },
      { path: 'userDashboards', component: UserDashboardsListComponent },

    ]
  },
  { path: 'notFound', component: NotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(coreRoutes)
  ],
  providers: [DeviceResolverService],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
