module.exports = class Validation extends Core.Validation{
    constructor(data, update = false){
        super(data, update);
        this.schema = this.Joi.object({
            source:  this.Joi.string().max(120).required(),
            count:  this.Joi.number().max(120).required(),
            date: this.Joi.date().optional()
        });
        this.validate();
    }
}