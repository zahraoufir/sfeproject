module.exports = class Validation extends Core.Validation{
    constructor(data, update = false){
        super(data, update);
        this.schema = this.Joi.object({
            userId: Joi.number().integer(),
        });
        this.validate();
    }
}