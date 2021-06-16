const pluralize = require('pluralize');
module.exports = class DefaultRepository{
    constructor(Model){
        let modelName =  pluralize(Model.modelName);
        const component = Components.get(modelName);
        return component.Repository ? new component.Repository(Model) : new Core.BaseRepository(Model);
    }
}