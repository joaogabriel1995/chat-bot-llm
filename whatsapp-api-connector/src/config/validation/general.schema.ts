import * as Joi from 'joi';
import { appValidationSchema } from './app.schema';
import { redisValidationSchema } from './redis.schema';

export const generalSchema = Joi.object({
  SERVER_PORT: appValidationSchema.extract('SERVER_PORT'),
  REDIS_HOST: redisValidationSchema.extract("REDIS_HOST"),
  REDIS_PORT: redisValidationSchema.extract("REDIS_PORT")
});
