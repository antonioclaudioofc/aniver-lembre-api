import { Server } from 'socket.io';
export declare class ContactGateway {
    server: Server;
    sendUpdate(data: any): void;
}
