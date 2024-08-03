import { Injectable } from '@nestjs/common';
import { RabbitMqService } from '../services/rabbitmq-connection.service';

@Injectable()
export class RabbitMQProducer {
  constructor(private rabbitMQService: RabbitMqService) {}

  async sendMessage<T>(channelName: string, queueName: string, message: T) {
    if (!channelName || !queueName || !message) {
      console.error('Invalid parameters provided');
      throw new Error('Invalid parameters provided');
    }

    const channel = this.rabbitMQService.getChannel(channelName);

    if (!channel) {
      console.error(`Channel ${channelName} not found`);
      throw new Error(`Channel ${channelName} not found`);
    }

    try {
      await channel.assertQueue(queueName, { durable: true });
      await channel.prefetch(1); // Limita o consumidor a processar uma mensagem por vez
      channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
      return { success: true, message: 'Message sent successfully' };
    } catch (error: any) {
      console.error(`Failed to send message: ${error.message}`);
      throw new Error(`Failed to send message: ${error.message}`);
    }
  }
}
