import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { HydacRoutingModule } from './hydac-routing.module';
import { HydacComponent } from './hydac.component';
import { HydacDashboardComponent } from './components/hydac-dashboard/hydac-dashboard.component';


@NgModule({
  declarations: [HydacComponent, HydacDashboardComponent],
  imports: [
    CommonModule,
    SharedModule,
    HydacRoutingModule
  ]
})
export class HydacModule { }
