import { Injectable } from "@angular/core";
import { Subject, Subscription } from "rxjs";

@Injectable()
export class NotificationService {

    private notificationInflight = new Subject<any>();

    private notifications: any = {};

    initialize() : any {
        let accountObject: any = sessionStorage.getItem('rmsAccount');
        console.log();
        

        let notification = JSON.parse(accountObject);
        const userconfi: any[] = JSON.parse(notification.userPreference);
        const item = userconfi?.find(sig => sig.signalModel.signalId === 289);
        if (item) {
            //   this.headertrue=false;
            const dataValues: any[] = item.signalDataModels;

            const isEmpergency = dataValues[0];
            if(isEmpergency) {
                notification[isEmpergency.signalId] = isEmpergency;
                //   this.emergencystop=isEmpergency;
                this.notificationInflight.next(isEmpergency);
            }
            console.log(isEmpergency ? 'Empergency' : 'Not Empergency');
        }
        return Promise.resolve();
    }

    public getNotification(signalId: any) {
        return this.notifications[signalId];
    }

    public observe(onReceive: (data: any) => void): Subscription {
        return this.notificationInflight.subscribe(onReceive);
    }

    public notify(signal: any) {
        const current = this.notifications[signal.signalId];
        if (current && signal.dataValue !== current.dataValue) {
            this.notifications[signal.signalId] = signal;
            this.notificationInflight.next(signal);
        }
    }

}