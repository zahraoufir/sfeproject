const pluralize = require('pluralize');

module.exports = class Request {
    constructor(httpRequest) {
        this.options = {};
        this.filters = {};
        this.id = httpRequest.query.id;
        this.query = httpRequest.query;
        this.body = httpRequest.body;
        this.params = httpRequest.params;
        this.cookies = httpRequest.cookies;
        this.session = httpRequest.session ? httpRequest.session : {};

        this.headers = {
            Referer: httpRequest.get('referer'),
            cookies: httpRequest.get('Cookie'),
            'x-auth-token': httpRequest.get('x-auth-token'),
            'Content-Type': httpRequest.get('Content-Type'),
            'Access-Control-Allow-Origin': httpRequest.get('Access-Control-Allow-Origin'),
        };
        this.mongoRequest(this.query);
    }

    mongoRequest(query) {
        const queryEntries = query ? Object.entries(query) : [];
        // if (queryEntries.length === 0) return {};
        const options = ['page', 'sort', 'limit', 'lang', 'populate'];
        const filters = ['from', 'to', 'eq', 'ne', 'in', 'nin', 'contains'];
        const unfilters = ['lang', 'cur', 'country', 'province', 'city', 'today'];
        const filtredQuery = queryEntries.reduce((prev, curr) => {
            let [key, val] = curr;
            // val = this.formatValue(val);
            if (key.indexOf('-') > -1) {
                let [field, filter] = key.split('-');
                if (filters.indexOf(filter) === -1) return prev;
                filter = this.mongoFormatFilters(filter);
                if (prev.filters[field]) {
                    prev.filters[field][`$${filter}`] = val;
                    if (filter == 'regex') prev.filters[field].$options = 'si';
                } else {
                    prev.filters[field] = { [`$${filter}`]: val };
                    if (filter == 'regex') prev.filters[field].$options = 'si';
                }
            } else if (options.indexOf(key) > -1) {
                if (key === 'populate') {
                    let model;
                    if (Components[val.model]) model = Components[val.model].Model;
                    val = {
                        path: val.path,
                        model,
                    };
                }
                prev.options[key] = val;
            } else if (unfilters.indexOf(key) > -1) return prev;
            else if (key === 'only') {
                if (!Array.isArray(query.only)) return prev;
                const schema = new Components[this.params.module].Schema();
                prev.fields = query.only.filter((field) => schema.fields.private.indexOf(field));
                return prev;
            } else if (key === 'search') {
                const { Schema } = Components[this.params.module];
                if (!Schema) return prev;
                const schema = new Schema();
                if (schema.fields.search.length === 0) return prev;
                const orFilter = [];
                val.split(' ').forEach(word =>{
                    schema.fields.search.forEach((_field) => {
                        orFilter.push({ [_field]: { $regex: word.replace('+', ''), $options: 'si' } });
                    });
                })
                if(!prev.filters) prev.filters = { $or: [] };
                prev.filters.$or = orFilter;
                return prev;
            } else if (key === 'with') {
                /*console.log('==> in with');*/
                /*console.log({ val });*/
                const populate = val.map((proprety) => {
                    /*console.log({ proprety });*/

                    const [path, model] = proprety.split('-as-');
                    const component = model || path.split('.').pop();
                    /*console.log('compoenent', Components[pluralize(component)]);*/
                    // if (!Components[pluralize(component)]) return {};
                    return { path, model: Components[pluralize(component)].Model };
                });
                /*console.log({populate});*/
                prev.options.populate = populate;
                /*console.log(prev.options.populate);*/
            } else {
                if (key === 'id') key = '_id';
                prev.filters[key] = val;
            }
            return prev;
        }, { options: {}, filters: {}, fields: [] });
        this.options = filtredQuery.options;
        this.filters = filtredQuery.filters;
        this.fields = filtredQuery.fields.length > 0 ? filtredQuery.fields : [];
    }

    // formatValue(val) {
    //     /*console.log('isValid', Utils.functions.isValidDate(val));*/
    //     if (Utils.functions.isValidDate(val)) return new Date(val);
    //     return val;
    // }


    mongoFormatFilters(filter) {
        switch (filter) {
        case 'from': return 'gte';
        case 'to': return 'lte';
        case 'contains': return 'regex';
        default: return filter;
        }
    }
};