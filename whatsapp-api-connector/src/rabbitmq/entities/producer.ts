import { Injectable } from '@nestjs/common';
import { RabbitMqService } from '../services/rabbitmq-connection.service';

@Injectable()
export class RabbitMQProducer {
  constructor(private rabbitMQService: RabbitMqService) {}

  async sendMessage(channelName: string, queueName: string, message: any) {
    const channel = this.rabbitMQService.getChannel(channelName);

    if (!channel) {
      return;
    }

    try {
      await channel.assertQueue(queueName, { durable: true });
      channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
    } catch (error: any) {
      console.error(`Failed to send message: ${error.message}`);
    }
  }
}
