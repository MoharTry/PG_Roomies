const Joi = require('joi');

module.exports.pgroomiesSchema = Joi.object({
    pgroomies:Joi.object({
        title:Joi.string().required(),
        price:Joi.string().required().min(0),
        location:Joi.string().required(),
        description:Joi.string().required()
    }).required()
});


module.exports.reviewSchema = Joi.object({
    review:Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body:Joi.string().required()
    }).required()
})