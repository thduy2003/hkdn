import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiOperation } from '@nestjs/swagger';
import { ApiOkResponseDefault } from '@core/services/response.decorator';
import { PushNotificationDto } from './dto/push-notification.dto';
import { BaseController } from '@core/services/base.controller';
import { Notification } from '@database/typeorm/entities/notification.entity';
import { NotificationQueryDto } from './dto/notification.query';

@Controller('')
export class NotificationController extends BaseController<Notification, NotificationService, NotificationQueryDto>(
  Notification,
  NotificationService,
  NotificationQueryDto,
) {
  constructor(private readonly notificationService: NotificationService) {
    super(notificationService);
  }
  @Post('push-notification')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    tags: ['notification'],
    operationId: 'pushNotification',
    summary: 'push notification',
    description: 'push notification',
  })
  @ApiOkResponseDefault(String)
  async enrollClass(@Body() data: PushNotificationDto): Promise<string> {
    return this.notificationService.pushNotification(data);
  }
}
