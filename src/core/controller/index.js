module.exports =  class Controller{
    constructor(component){
        this.Model = Components.get(component).Model;
        this.Validation = Components.get(component).Validation;
        this.Repository = new Core.Repository(this.Model);
    }
    send(content = null, status = 200, headers = []){
        return new Response(content, status, headers);
    }

    async get({ filters, fields = [], options = {} }) {
        const result = await this.Repository.get(filters, fields, options);
        if (!result) return this.send(`${this.Model.modelName} not found`, 404);
        if (result.errors) return this.send(result.message, 400);
        return this.send(result);
    }

    async create({ body }) {
        const { error } = new this.Validation(body);
        if (error) return this.send(error.details[0].message, 400);
        const result = await this.Repository.create(body);
        if (result.errors) return this.send(result.message, 400);
        return this.send(result);
    }

    async search({ filters, fields = [], options = {}}) {
        const result = await this.Repository.search(filters, fields, options);
        if ( result.errors ) return this.send(result.message, 400);
        return this.send(result);
    }

    async update({ filters , body }) {
        const { error } = new this.Validation(body, true);
        if (error) return this.send(error.details[0].message, 400);
        const result = await this.Repository.update(filters, body);
        if (!result) return this.send(`${this.Model.modelName} not found`, 404);
        if (result.errors) return this.send(result.message, 400);
        return this.send(result);
    }
    async delete({ filters }) {
        const result = await this.Repository.remove(filters);
        if (!result) return this.send(`${this.Model.modelName} not found`, 404);
        if (result.errors) return this.send(result.message, 400);
        return this.send(result);
    }
}