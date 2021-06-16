module.exports = class BaseRepository {
    constructor(Model) {
        this.Model = Model;
    }

    async get(conditions, fields = ['-__v'], options = {}) {
        fields = fields.join(' ');
        try {
            return await this.Model.findOne(conditions, fields, options);
        } catch (error) {
            return this.error(error);
        }
    }

    async search(conditions, fields = ['-__v'], options = {}) {
        fields = fields.join(' ');
        let _options = options;
        /*console.log({options});*/
        options.limit = options.limit ? parseInt(options.limit, 10) : Utils.constants.PER_PAGE;
        options.page = options.page ? parseInt(options.page, 10) : 1;
        options.skip = (options.page - 1) * options.limit;
        if (options.noLimit) delete (options.limit);
        _options = Utils.functions.pick(options, ['skip', 'limit', 'sort', 'populate', 'lean']);
        try {
            const result = await this.Model.find(conditions, fields, _options);
            const total = await this.Model.countDocuments(conditions);
            const pages = Math.floor(total / options.limit);
            return {
                results: result,
                paginate: {
                    total: total,
                    per_page: options.limit,
                    current_page: options.page,
                    last_page: (pages % options.limit) == 0 ? pages : pages + 1,
                },
            };
        } catch (error) {
            return this.error(error);
        }
    }

    async create(doc, options = {}) {
        try {
            // /*console.log(doc);*/
            const model = new this.Model(doc);
            return await model.save(options);
        } catch (error) {
            return this.error(error);
        }
    }

    async update(conditions, doc, options = {}, isSet = true) {
        if (isSet) doc = { $set: doc };
        try {
            if (!options.new) options.new = true;
            return await this.Model.findOneAndUpdate(conditions, doc, options);
        } catch (error) {
            return this.error(error);
        }
    }

    async remove(conditions) {
        try {
            return await this.Model.findOneAndRemove(conditions);
        } catch (error) {
            return this.error(error);
        }
    }

    async bulkCreate(docs, options = {}) {
        try {
            return await this.Model.insertMany(docs, options);
        } catch (error) {
            return this.error(error);
        }
    }

    async bulkUpdate(conditions, doc, options = {}) {
        try {
            return await this.Model.updateMany(conditions, { $set: doc });
        } catch (error) {
            return this.error(error);
        }
    }

    error(error) {
        /*console.log('MongoERROR : ', JSON.stringify(error));*/
        if (error.errmsg) {
            /*console.log(error.errmsg);*/
            if (error.code && error.code === 11000) {
                let field;
                /*console.log('1');*/
                
                if (!error.keyValue) {
                    /*console.log('2');*/
                    field = (/(index: (\w+)(_\d+))/).exec(error.message)[2].toLowerCase();
                    // error.message = `duplicate_${field}`;
                } else {
                    /*console.log('3');*/
                    field = Object.keys(error.keyValue).join(',').toLowerCase();
                    // error.message = `duplicate_${field}`;
                }
                /*console.log('4');*/
                error.errors = { [field]: 'errors_duplicate' };
            }
        } else if (error.errors) {
            /*console.log('error.errors', error.errors);*/
            const keys = Object.keys(error.errors);
            /*console.log('keys', keys);*/
            const myCustomError = {};
            keys.forEach((field) => {
                myCustomError[field] = `errors_${error.errors[field].kind || error.errors[field]}`;
            });
            error.errors = myCustomError;
        } else { error.errors = {}; }
        if (!error.status) error.status = 500;
        return error;
    }
};