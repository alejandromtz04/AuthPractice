import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io'

import { ChatService } from './chat.service';


@WebSocketGateway(3001, { cors: { origin: '*' } }) // this allows the connection on the any client
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  public server: Server;

  onModuleInit() {
    console.log("WebSocket initialized")
  }

  handleConnection(client: Socket) {
    console.log("User Connected...", client.id);

    this.server.emit('user-joined', {
      message: `New User Joined the chat: ${client.id}`
    })
  }

  handleDisconnect(client: Socket) {
    console.log("User disconnected...", client.id);

    this.server.emit('user-left', {
      message: `User left the chat: ${client.id}`
    })
  }

  @SubscribeMessage('newMessage')
  handleNewMessage(client: Socket, message: any) {
    console.log(message)
    this.server.emit('Reply','Broadcaasting...'); // this message is all dif connected client
  }
}
