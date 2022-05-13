import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import { from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { authService } from '../shared-services/auth.service';
const BASEURL = `${environment.baseURL}`;

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private _router: Router, private authServ: authService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (request.url.startsWith(BASEURL)) {
      console.log('In auth interceptor');
      // const headers = new HttpHeaders({
      //   'content-type': 'application/json'
      // });
      // const authReq = request.clone({ headers });
      // console.log(headers);
      //return next.handle(request);
      let isLogin = JSON.parse(sessionStorage.getItem('jwtToken'));
      // let isLogin = null;
      console.log(isLogin," checking")
      let authReq;
      if(isLogin !== null) {
        authReq = request.clone({
          setHeaders: { Authorization: `Bearer ${isLogin['token']}`,ContentEncoding: 'gzip'} 
      });
      console.log(authReq,"authReq checking")
      }else{
       authReq = request.clone();
      }
  
      return next.handle(authReq).pipe(tap(_=> { }, error => {
        console.log(error,'Main error block Net issues');
        var respError = error as HttpErrorResponse;
        console.log(respError,"respError checking")
        // if (error?.errorCode === 401 || error?.errorCode === 403) {
        if (error?.errorCode === 401) {
          // this._router.navigate(['/unauthorized']);
          this.authServ.logOut(); 
        }
        if(respError == undefined) {
          this._router.navigate(['/notFound']);
        }
      }))      
 
    } else {
      console.log('handled')
      return next.handle(request);
    }
  }
}
