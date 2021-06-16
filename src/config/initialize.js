const fs = require('fs');
module.exports = function() {
    global.Components = {};
    global.Utils = {};
    global.Middlewares = {};
    global.Request = require('../core/httpClient/request');
    global.Response = require('../core/httpClient/response');
    fs.readdirSync('src/utils').forEach((util) => {
        global.Utils[util.split('.')[0]] = require(`../utils/${util}`);
    });
    global.Core = {
        Controller: require('../core/controller'), 
        Model: require('../core/model'),
        Validation: require('../core/validation'),
        Repository: require('../core/repository'),
        BaseRepository: require('../core/repository/base'),
        Schema: require('../core/schema'),
    }
    global.Components.get = function(name){
        if(Components[name]) return Components[name];
        component = {
            Schema:getComponent(`../components/${name}/schema.js`),
            Model:getComponent(`../components/${name}/model.js`),
            Controller: getComponent(`../components/${name}/index.js`),
            Validation:getComponent(`../components/${name}/validation.js`)
        }
        Components[name] = component;
        return component;
    }
    fs.readdirSync('src/middlewares').forEach(name=>{
        name = name.split('.')[0];
        global.Middlewares[name] = require(`../middlewares/${name}`);
    });
    fs.readdirSync('src/components').forEach((component) => {
        if(global.Components[component]) return;
        global.Components[component] = {
            Schema:getComponent(`../components/${component}/schema.js`),
            Model:getComponent(`../components/${component}/model.js`),
            Controller: getComponent(`../components/${component}/index.js`),
            Validation:getComponent(`../components/${component}/validation.js`)
        }
    });
}
function getComponent(componentPath){
    try{
        return require(componentPath);
    }catch(e){
        // if(componentPath == '../components/examples/index.js') console.log(e);
        return null;
    }
}