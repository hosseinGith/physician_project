import {
 ConnectedSocket,
 MessageBody,
 SubscribeMessage,
 WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { WebsocketGateway } from '../websocket.gateway';
import { WebsocketService } from '../websocket.service';
import { Access } from 'src/shared/guards/access.decorator';
import { AccessType } from 'src/types';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AccessGuard } from 'src/shared/guards/access.guard';
import AddPatientDto from './dtos/addPatient.dto';

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway extends WebsocketGateway {
 constructor(
  private readonly service: ChatService,
  websocketService: WebsocketService,
 ) {
  super(websocketService);
 }
 @SubscribeMessage('contacts')
 async contacts(client: Socket) {
  return await this.service.contacts(client);
 }
 @SubscribeMessage('messages')
 async messages(
  @MessageBody() [response]: [{ targetUser: string }],

  @ConnectedSocket() client: Socket,
 ) {
  return await this.service.getMessages(response.targetUser, client);
 }
 @SubscribeMessage('send-text')
 async send(
  @MessageBody() [response]: [{ roomId: string; content: string }],

  @ConnectedSocket() client: Socket,
 ) {
  console.log(response);

  return await this.service.send(response.roomId, response.content, client);
 }
 @SubscribeMessage('joinRoom')
 async joinRoom(
  @MessageBody() [response]: [{ id: string }],
  @ConnectedSocket() client: Socket,
 ) {
  return await this.service.join(response.id, client);
 }

 @Access(AccessType.DOCTOR)
 @UseGuards(AccessGuard)
 @SubscribeMessage('addPatient')
 @UsePipes(new ValidationPipe())
 async addPatient(
  @MessageBody()
  [response]: [AddPatientDto],
  @ConnectedSocket() client: Socket,
 ) {
  return await this.service.addPatient(response.id, client);
 }
 @SubscribeMessage('exitRoom')
 exitRoom(@ConnectedSocket() client: Socket) {}
}
