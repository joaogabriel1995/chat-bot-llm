import * as Joi from 'joi';

export const rabbitValidationSchema = Joi.object({
  RABBIT_HOST: Joi.string().required(),
  RABBIT_PORT: Joi.number().default(5432),
  RABBIT_USER: Joi.string().required(),
  RABBIT_PASSWORD: Joi.string().required(),
});
