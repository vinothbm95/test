import { Injectable } from '@angular/core';
// import * as io from 'socket.io-client';
import {io} from 'socket.io-client';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  socket;
  constructor() { }

  setupSocketConnection() {
    this.socket = io(environment.SOCKET_ENDPOINT);
    this.socket.emit('my message', 'Hello there from Angular.');

    this.socket.on('broadcast', (data: any) => {
      console.log(data);
      return data;
    });
  }
}
