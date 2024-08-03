import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-store';
import { RedisService } from './services/redis.services';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: String(process.env.REDIS_HOST),
      port: Number(process.env.REDIS_PORT),
      ttl: 0,
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
