import {
 WebSocketGateway,
 WebSocketServer,
 SubscribeMessage,
 OnGatewayConnection,
 OnGatewayDisconnect,
 ConnectedSocket,
 OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebsocketService } from './websocket.service';
import { UseGuards } from '@nestjs/common';
import { WsAuthGuard } from './gurds/wsAuth.guard';
@UseGuards(WsAuthGuard)
@WebSocketGateway({ cors: { origin: '*' } })
export class WebsocketGateway
 implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
 @WebSocketServer()
 server: Server;

 constructor(private websocketService: WebsocketService) {}
 afterInit(server: Server) {
  this.websocketService.setServer(server);
 }

 handleConnection(client: Socket) {
  void this.websocketService.addClient(client);
 }

 handleDisconnect(client: Socket) {
  this.websocketService.removeClient(client.id);
 }

 @SubscribeMessage('ping')
 handlePing(@ConnectedSocket() client: Socket) {
  client.emit('');
 }
}
