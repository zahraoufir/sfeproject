module.exports = class Schema extends Core.Schema{
    constructor(){
        super();
        this.actions = {
            get : [],
            search : [],
            create : [],
            update : [],
            delete : []
        }
    }
}