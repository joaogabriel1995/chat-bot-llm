import { Module } from '@nestjs/common';
import { ConfigAppModule } from './config/config.module';
import { RedisModule } from './redis/redis.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';

@Module({
  imports: [ConfigAppModule, RedisModule, RabbitmqModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
