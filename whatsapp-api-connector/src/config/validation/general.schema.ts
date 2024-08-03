import * as Joi from 'joi';
import { appValidationSchema } from './app.schema';

export const generalSchema = Joi.object({
  SERVER_PORT: appValidationSchema.extract('SERVER_PORT'),
});
