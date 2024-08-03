import { Module, OnModuleInit } from '@nestjs/common';
import { RabbitMQConsumer } from './entities/consumer';
import { RabbitMqService } from './services/rabbitmq-connection.service';

@Module({
  exports: [RabbitMQConsumer, RabbitMqService],
  providers: [RabbitMQConsumer, RabbitMqService],
})
export class RabbitmqModule {
}
