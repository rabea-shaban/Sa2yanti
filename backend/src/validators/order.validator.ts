const Joi = require('joi');

export const createOrderSchema = Joi.object({
  service: Joi.string().required(),

  location: Joi.string().required(),
});
