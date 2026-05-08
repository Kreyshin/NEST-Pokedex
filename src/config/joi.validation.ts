import * as Joi from "joi";
export const JoiValidationSchema = Joi.object({
<<<<<<< HEAD
  NODE_ENV: Joi.string().valid('dev', 'prod', 'test','production').default('dev'),
=======
  NODE_ENV: Joi.string().valid('dev', 'prod', 'test').default('dev'),
>>>>>>> origin/main
  MONGODB: Joi.required().default('mongodb://localhost:27017/nest'),      
  PORT: Joi.number().default(4000),
  DEFAULT_LIMIT: Joi.number().default(10),
});