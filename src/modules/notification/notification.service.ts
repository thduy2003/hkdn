import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { PushNotificationDto } from './dto/push-notification.dto';
import { AbstractBaseService } from '@core/services/base.service';
import { NotificationQueryDto } from './dto/notification.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from '@database/typeorm/entities/notification.entity';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class NotificationService extends AbstractBaseService<Notification, NotificationQueryDto> {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {
    super(notificationRepository);
  }
  protected async populateSearchOptions(searchParams: NotificationQueryDto): Promise<FindManyOptions> {
    const options = await super.populateSearchOptions(searchParams);

    const criteriaOptions: any = {
      where: {
        user: {
          id: searchParams.userId,
        },
      },
      order: {
        createdAt: searchParams.order || 'DESC',
      },
    };
    return Promise.resolve(criteriaOptions);
  }
  async pushNotification(data: PushNotificationDto): Promise<string> {
    if (data.token === '') {
      throw new BadRequestException('Token can not be empty');
    }
    const { title, body, token, username } = data;
    try {
      const message = {
        notification: {
          title,
          body,
        },
        token,
      };

      const result = await admin.messaging().send(message);
      console.log('rs', result);
      return `Push notification was sent to ${username}`;
    } catch (error) {
      console.log('error', error);
      throw new InternalServerErrorException(`Error sending push notification to username: ${username}`);
    }
  }
}
