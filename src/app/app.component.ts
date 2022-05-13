import { Component, OnInit } from '@angular/core';
import { Event, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { MqttService } from './core/rms-services/mqtt-service/mqtt.service';
import { authService } from './core/rms-services/shared-services/auth.service';

@Component({
  selector: 'elpis-rms-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'rms';
  isLoading: boolean = false;

  constructor(private router: Router, private authServ: authService,private mqttService:MqttService) {
    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          console.log('Navigate');
          this.isLoading = true;
          break;
        }
        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          console.log('Navigate End')
          this.isLoading = false;
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    console.log("in app component");
    let userDetails=this.authServ.getCurrentUser();
    if (userDetails != null) {
           this.mqttService.connect(userDetails.email,userDetails.password).finally(()=>console.log("mqtt connected from app component"));
    }
    this.authServ.autoLogOut();


  }

}
