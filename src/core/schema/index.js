module.exports = class Schema{
    constructor(){
        this.actions = {
            get : ['auth', 'authorize'],
            search : ['auth', 'authorize'],
            create : ['auth', 'authorize'],
            update : ['auth', 'authorize'],
            delete : ['auth', 'authorize']
        }
    }
    hasAction(action){
        return this.actions[action];
    }
    setAction(action, moddlewares = []){
        this.actions[action] = moddlewares;
    }
    setActions(actions){
        this.actions = actions;
    }
    getActions(){
        return Object.keys(this.actions);
    }
    addModdleware(action, middleware){
        if(this.actions[action]) this.actions[action].push(middleware);
        else this.actions[action] = [middleware];
    }
    setMiddlewares(action, moddlewares){
        this.actions[action] = moddlewares;
    }
    getMiddlewares(action){
        return this.actions[action];
    }
}