import { Injectable } from '@nestjs/common';
import { RabbitMqService } from '../services/rabbitmq-connection.service';
import { ConsumeMessage } from 'amqplib';

@Injectable()
export class RabbitMQConsumer {
  constructor(private rabbitMQService: RabbitMqService) {}

  async setupConsumer(
    channelName: string,
    queueName: string,
    processFunction: (msg: ConsumeMessage | null) => Promise<any>,
    failedFunction?: (msg: ConsumeMessage | null, error: Error) => void,
  ) {
    const channel = this.rabbitMQService.getChannel(channelName);
    if (!channel) {
      return;
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
    } catch (error: any) {
      console.error(`Failed to setup consumer: ${error.message}`);
    }
  }
}
