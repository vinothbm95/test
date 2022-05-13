export class MqttConfig {
    hostname: string;
    port: number;
    path: string;
    protocol: 'wss' | 'ws' | 'mqtt' | 'mqtts' | 'tcp' | 'ssl' | 'wx' | 'wxs';
}