const db = require('mongoose');
module.exports =  class Model{
    static Schema = db.Schema;
    static model(name,schema){
        return db.model(name,schema);
    }
}