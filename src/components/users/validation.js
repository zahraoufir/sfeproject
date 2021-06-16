module.exports = class Validation extends Core.Validation{
    constructor(data, update = false){
        super(data, update);
        this.schema = this.Joi.object({
            email : Joi.string().email().lowercase().required(),
            password : Joi.string().min(8).required(),
            first_name : Joi.string().min(3).max(20).required(),
            last_name : Joi.string().min(3).max(20).required()
        });
        this.validate();
    }
}