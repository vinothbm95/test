import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CoreModule } from './core/core.module'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { httpInterceptProviders } from 'src/app/core/rms-services/rms-interceptors/http-.interceptor';
import { SharedModule }  from 'src/app/shared/shared.module';
import { ToastrModule } from 'ngx-toastr';
import { DatePipe } from '@angular/common';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    ToastrModule.forRoot(
      {
        timeOut: 1500,
        positionClass: 'toast-top-center',
        preventDuplicates: true,
        closeButton: true
      }
    ), // ToastrModule added
  ],
  providers: [httpInterceptProviders, DatePipe,],
  bootstrap: [AppComponent]
})
export class AppModule { }


