import { Notification } from '@database/typeorm/entities/notification.entity';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ApiConfigService } from '@shared/services/api-config.service';
import { Server, Socket } from 'socket.io';
import { Repository } from 'typeorm';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway {
  @WebSocketServer() server: Server;
  private users: { [key: string]: { socket_id: string } } = {};
  // eslint-disable-next-line prettier/prettier
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private jwtService: JwtService,
    private readonly configService: ApiConfigService,
  ) {}

  @SubscribeMessage('send_notification')
  async handleSendMessage(client: Socket, payload: any): Promise<void> {
    console.log('payload', payload);
    const { receiver_id, content, classId, studentId, examResultId } = payload;
    let data: any = {};
    if (classId && studentId && examResultId) {
      data = {
        classId,
        studentId,
        examResultId,
      };
    }
    const receiver_socket_id = this.users[receiver_id]?.socket_id;
    const notification = this.notificationRepository.create({
      content,
      user: {
        id: receiver_id,
      },
      metadata: data,
    });
    const result = await this.notificationRepository.save(notification);
    notification.id = result.id;
    if (receiver_socket_id) {
      this.server.to(receiver_socket_id).emit('receive_notification', notification);
    }
  }

  afterInit(server: Server) {
    // Apply middleware
    server.use(async (socket: Socket, next) => {
      const { Authorization } = socket.handshake.auth;
      const accessToken = Authorization?.split(' ')[1];
      try {
        const payload = await this.jwtService.verifyAsync(accessToken, {
          secret: this.configService.authConfig.secret,
        });
        socket.handshake.auth.userId = payload.userId;
        next();
      } catch (error) {
        console.log(error);
        next({
          message: 'Unauthorized',
          name: 'UnauthorizedError',
          data: error,
        });
      }
    });
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
    const userId = client.handshake.auth.userId;
    delete this.users[userId];
  }
  async handleConnection(client: Socket) {
    console.log(`Connected: ${client.id}`);
    const userId = client.handshake.auth.userId;
    this.users[userId] = {
      socket_id: client.id,
    };
    console.log(this.users);
  }
}
