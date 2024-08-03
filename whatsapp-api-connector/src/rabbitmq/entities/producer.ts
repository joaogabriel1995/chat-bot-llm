import { Injectable } from '@nestjs/common';
import { RabbitMqService } from '../services/rabbitmq-connection.service';
import { v4 as uuidv4 } from 'uuid';
import { ConsumeMessage } from 'amqplib';

@Injectable()
export class RabbitMQProducer {
  constructor(private rabbitMQService: RabbitMqService) {}

  async sendMessage<T>(
    channelName: string,
    queueName: string,
    message: T,
    replyQueue: string,
    processFunctionReply?: (msg: any) => Promise<any>,
    timeout: number = 5000
  ): Promise<any> {
    const channel = this.rabbitMQService.getChannel(channelName);

    if (!channel) {
      throw new Error(`Channel ${channelName} not found`);
    }

    const correlationId = uuidv4();

    return new Promise((resolve, reject) => {
      const onResponse = async (msg: ConsumeMessage | null) => {
        if (msg && msg.properties.correlationId === correlationId) {
          if (processFunctionReply) {
            try {
              const processedResponse = await processFunctionReply(JSON.parse(msg.content.toString()));
              resolve(processedResponse);
            } catch (error) {
              reject(error);
            }
          } else {
            resolve(JSON.parse(msg.content.toString()));
          }
        }
      };

      const timer = setTimeout(() => {
        channel.cancel(`consumer_${correlationId}`);
        reject(new Error('Timeout waiting for response'));
      }, timeout);

      channel.assertQueue(replyQueue, { durable: false });
      channel.consume(replyQueue, onResponse, { noAck: true, consumerTag: `consumer_${correlationId}` });

      const messageBuffer = Buffer.from(JSON.stringify(message));
      channel.sendToQueue(queueName, messageBuffer, {
        correlationId,
        replyTo: replyQueue,
      });
    });
  }
}
