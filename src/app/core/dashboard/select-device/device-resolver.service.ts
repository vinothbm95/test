import { Injectable, OnInit } from '@angular/core';
import { Resolve } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { empty, Observable, of  } from 'rxjs';
import { DashboardService } from '../../rms-services/index';

@Injectable({
  providedIn: 'root'
})
export class DeviceResolverService implements OnInit,Resolve<Observable<any>>{
  rmsAct:any
  constructor(private dashboardSVC : DashboardService) { }
ngOnInit(){
  
}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let accountObject = sessionStorage.getItem('rmsAccount');
  // let dummyPwd = sessionStorage.getItem('dummyPwd');
  // let selectedUser = sessionStorage.getItem('rmsSelectedUser');
  this.rmsAct = JSON.parse(accountObject);
    console.log(this.rmsAct.customerId,'Inside resolver')
     return this.dashboardSVC.getDeviceData(this.rmsAct.customerId).pipe(

      catchError((error) => {
        return empty();
      })
    );
  }
}
