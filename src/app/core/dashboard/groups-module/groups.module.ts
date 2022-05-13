import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import { DeviceResolverService } from '../../dashboard/select-device/device-resolver.service';

import { GroupsComponent, GroupDialog, DeleteGroupDialog } from './groups/groups.component';
import { GroupViewComponent, DeleteSignalDialog } from './group-view/group-view.component';
import { AddSignalGroupComponent, ConfirmationDialog, mobileSignalListDialog } from './add-signal-group/add-signal-group.component';
import { SelectDeviceComponent } from '../select-device/select-device.component';

const groupsRoutes: Routes = [
  { path: 'groups', component: GroupsComponent },
  { path: 'groups/group/:id', component: GroupViewComponent, pathMatch: 'full' },
  { path: 'groups/group/:id/signals', component: SelectDeviceComponent,  resolve: { devicelist: DeviceResolverService } },
];

@NgModule({
  declarations: [
    GroupsComponent, GroupDialog, DeleteGroupDialog,
    GroupViewComponent, DeleteSignalDialog, AddSignalGroupComponent, 
    ConfirmationDialog, mobileSignalListDialog 
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    RouterModule.forChild(groupsRoutes)
  ],
  entryComponents: [
     GroupDialog, DeleteGroupDialog,
    DeleteSignalDialog,
    ConfirmationDialog, mobileSignalListDialog ],
  providers:    [ DeviceResolverService ],
  exports: [RouterModule, GroupsComponent, GroupViewComponent]
})
export class GroupsModule { }
