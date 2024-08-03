import { Connection, Channel, connect } from 'amqplib';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RabbitMqService {
  private static connection: Connection | null = null;
  static channels: Map<string, Channel> = new Map();
  constructor(private readonly configService: ConfigService) {}

  async connect() {
    if (!RabbitMqService.connection) {
      const password = this.configService.get<string>('RABBIT_PASSWORD');
      const user = this.configService.get<string>('RABBIT_USER');
      const host = this.configService.get<string>('RABBIT_HOST');
      const port = this.configService.get<string>('RABBIT_PORT');

      const rabbitUrl = `amqp://${user}:${password}@${host}:${port}`;
      RabbitMqService.connection = await connect(
        rabbitUrl || 'amqp://guest:guest@localhost:5672',
      );
    }
  }

  async createChannel(name: string) {
    if (!RabbitMqService.connection) {
      await this.connect();
    }
    const channel = await RabbitMqService.connection!.createChannel();
    RabbitMqService.channels.set(name, channel);
  }

  getChannel(name: string): Channel | undefined {
    return RabbitMqService.channels.get(name);
  }

  async closeConnection() {
    for (const channel of RabbitMqService.channels.values()) {
      await channel.close();
    }
    if (RabbitMqService.connection) {
      await RabbitMqService.connection.close();
    }
  }
}
