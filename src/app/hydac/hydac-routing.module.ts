import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from '../shared/error-pages/not-found/not-found.component';
import { HydacDashboardComponent } from './components/hydac-dashboard/hydac-dashboard.component';

import { HydacComponent } from './hydac.component';

const routes: Routes = [
  { path: '', component: HydacComponent,
    children: [

      { path:'dashboard', component: HydacDashboardComponent }
    ]
  
  },
  { path: 'notFound', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HydacRoutingModule { }
