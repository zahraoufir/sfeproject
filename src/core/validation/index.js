const _ = require('lodash');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
// validate
module.exports = class Validation{
    constructor(data, update){
        this.Joi = Joi;
        this.data = data;
        this.update = update;
    }
    validate(){
        const result = this.getResult();
        this.error = result.error;
        this.data = result.data;
    }
    getResult(){
        if(!this.update) return this.schema.validate(this.data);
        let data = JSON.parse(JSON.stringify(this.data));
        let result = validateObject(this.schema, data);
        if(result.error) return result;
        result = this.schema.validate(data);
        if(result.error) return result;
        else return { value : this.data };
    }
}
function validateArray(object, newObject){
    for(let index=0;index<object.$_terms.items.length;index++){
        if(object.$_terms.items[index].type == 'object'){
            for(let index2=0;index2<newObject.length;index2++){
                const newSchema = _.cloneDeep(object.$_terms.items[index]);
                validateObject(newSchema, newObject[index2]);
                return newSchema.validate(newObject[index2]);
            }
        }else if( object.$_terms.items[index].schema && object.$_terms.items[index].schema.type == 'array'){
            validateArray(object.$_terms.items[index], newObject[index]);
        }
    };
    return { value : {}};
}
function validateObject(object, newObject){
    if(object.$_terms.keys == null) return { value : {}};
    for(let index=0;index<object.$_terms.keys.length;index++){
        if(!(object.$_terms.keys[index].key in newObject)){
            object.$_terms.keys.splice(index, 1);
            index--;
        }else{
            if(object.$_terms.keys[index].schema.type == 'object'){
                validateObject(object.$_terms.keys[index].schema, newObject[object.$_terms.keys[index].key]);
            }else if(object.$_terms.keys[index].schema.type == 'array'){
                const result = validateArray(object.$_terms.keys[index].schema, newObject[object.$_terms.keys[index].key]);
                if(result.error){
                    return result;
                }else {
                    delete(newObject[object.$_terms.keys[index].key]);
                    object.$_terms.keys.splice(index, 1);
                    index--;
                }
            }
        }
    };
    return { value : {}};
}