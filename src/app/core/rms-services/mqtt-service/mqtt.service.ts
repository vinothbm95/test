import { Inject, Injectable } from "@angular/core";

import * as mqtt from 'mqtt';
import { Subject, Subscription } from 'rxjs';
import { MqttConfig } from './mqtt.config';

export interface IMqttMessage {
    topic: string;
    message: any;
    packet: mqtt.Packet;
}

@Injectable({
    providedIn: 'root'
  })
export class MqttService {
    private client: mqtt.Client;
    public  isConnected:boolean=false;
    private message: Subject<IMqttMessage>;

    public constructor(@Inject('MqttConfig') private config: MqttConfig) {
        this.message = new Subject<IMqttMessage>();
    }

    public observe(onReceive: (data: IMqttMessage) => void) : Subscription {
        return this.message.subscribe(onReceive); 
    }

    public connect(username: string, password: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {

            const options: mqtt.IClientOptions = {
                clientId: 'clientId' + Math.floor(Math.random() * 65535),
                username: username,
                password: password,
                protocol: this.config.protocol,
                path: this.config.path,
                protocolId: 'MQTT',
                hostname: this.config.hostname,
                port: this.config.port
            }
            this.client = mqtt.connect(undefined, options);
            const onConnect : mqtt.OnConnectCallback = (packet) => {
                resolve();
            };
            const onError : mqtt.OnErrorCallback= (err) => {
                console.error(err);
                reject();
            }
            this.client.addListener('connect', onConnect);
            this.client.addListener('message', this.onMessage);
            this.client.addListener('error', onError);
        })
    }

    public subscribe(topic: string): Promise<void> {
        if (this.client) {
            return new Promise<void>((resolve, reject) => {
                this.client.subscribe(topic, (err, _) => {
                    if (err) {
                        reject();
                    } else {
                        resolve();
                    }
                });
            });
        }
        return Promise.reject('not connected');
    }

    public unsubcribe(topic: string) : Promise<void> {
        if (this.client) {
            return new Promise<void>((resolve, reject) => {
                this.client.unsubscribe(topic, (err, _) => {
                    if (err) {
                        reject();
                    } else {
                        resolve();
                    }
                });
            });
        }
        return Promise.reject('not connected');
    }

    public disconnect(): void {
        if (this.client && this.client.connected) {
            this.client.end(false);
        }
    }

    onMessage : mqtt.OnMessageCallback = (topic, payload, packet) => {
        this.message.next({
            topic: topic,
            message: payload,
            packet: packet
        })
    }
}