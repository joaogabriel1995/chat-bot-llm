import * as Joi from 'joi';
import { appValidationSchema } from './app.schema';
import { redisValidationSchema } from './redis.schema';
import { rabbitValidationSchema } from './rabbit.schema';

export const generalSchema = Joi.object({
  SERVER_PORT: appValidationSchema.extract('SERVER_PORT'),
  REDIS_HOST: redisValidationSchema.extract("REDIS_HOST"),
  REDIS_PORT: redisValidationSchema.extract("REDIS_PORT"),
  RABBIT_HOST: rabbitValidationSchema.extract('RABBIT_HOST'),
  RABBIT_PORT: rabbitValidationSchema.extract('RABBIT_PORT'),
  RABBIT_USER: rabbitValidationSchema.extract('RABBIT_USER'),
  RABBIT_PASSWORD: rabbitValidationSchema.extract('RABBIT_PASSWORD'),
});
