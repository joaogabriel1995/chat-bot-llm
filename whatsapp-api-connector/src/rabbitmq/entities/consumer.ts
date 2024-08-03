import { Injectable } from '@nestjs/common';
import { RabbitMqService } from '../services/rabbitmq-connection.service';
import { ConsumeMessage } from 'amqplib';

@Injectable()
export class RabbitMQConsumer {
  constructor(private rabbitMQService: RabbitMqService) {}

  async setupConsumer(
    channelName: string,
    queueName: string,
    processFunction: (msg: ConsumeMessage) => Promise<void>,
    failedFunction?: (msg: ConsumeMessage, error: Error) => void,
  ) {
    if (!channelName || !queueName || !processFunction) {
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
      channel.consume(
        queueName,
        async (msg) => {
          if (msg) {
            try {
              await processFunction(msg);
              channel.ack(msg);
            } catch (error: any) {
              if (failedFunction) {
                failedFunction(msg, error);
              }
              channel.nack(msg, false, true);
            }
          }
        },
        {
          noAck: false,
        },
      );
      return { success: true, message: 'Consumer setup successfully' };
    } catch (error: any) {
      console.error(`Failed to setup consumer: ${error.message}`);
      throw new Error(`Failed to setup consumer: ${error.message}`);
    }
  }
}
