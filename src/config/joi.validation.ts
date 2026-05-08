import * as Joi from "joi";
export const JoiValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('dev', 'prod', 'test','production').default('dev'),
  MONGODB: Joi.required().default('mongodb://localhost:27017/nest'),      
  PORT: Joi.number().default(4000),
  DEFAULT_LIMIT: Joi.number().default(10),
});