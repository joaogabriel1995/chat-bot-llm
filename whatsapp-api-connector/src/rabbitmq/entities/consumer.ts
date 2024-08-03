import { Injectable } from '@nestjs/common';
import { RabbitMqService } from '../services/rabbitmq-connection.service';
import { ConsumeMessage } from 'amqplib';

@Injectable()
export class RabbitMQConsumer {
  constructor(private rabbitMQService: RabbitMqService) {}

  async setupConsumer(
    channelName: string,
    queueName: string,
    processFunction: (msg: ConsumeMessage) => Promise<any>,
    failedFunction?: (msg: ConsumeMessage, error: Error) => void,
  ) {
    const channel = this.rabbitMQService.getChannel(channelName);
    if (!channel) {
      throw new Error(`Channel ${channelName} not found`);
    }

    try {
      await channel.assertQueue(queueName, { durable: true });
      channel.consume(
        queueName,
        async (msg) => {
          if (msg) {
            try {
              const response = await processFunction(msg);
              channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(response)), {
                correlationId: msg.properties.correlationId,
              });
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
