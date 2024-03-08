const Joi = require('joi');

const joiSchema = Joi.object({
    name: Joi.string().required(),
    classRoom: Joi.string().required(),
    rollNo: Joi.string().required()
});



module.exports = joiSchema;