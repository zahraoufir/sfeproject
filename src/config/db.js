const db = require('mongoose');
const logger = Utils.logger;
module.exports.start = function(){
    db.connect('mongodb://localhost/storeinocore',{ useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false, useCreateIndex: true,}).then(()=>{
    }).catch(err => {
        logger(`Error database : ${err}`);
        process.exit(1);
    });
}
module.exports.close = function(){
    try {
        db.disconnect();
    } catch (error) {
        return logger(`${error}`);
    }
}