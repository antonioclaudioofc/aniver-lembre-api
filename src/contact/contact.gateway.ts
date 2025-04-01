import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})

export class ContactGateway {
  @WebSocketServer()
  server: Server;

  sendUpdate(data: any) {
    this.server.emit('contatosAtualizados', data);
  }
}
