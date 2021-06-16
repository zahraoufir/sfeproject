const db = require('./db');
const logger = Utils.logger;
const { PORT } = Utils.constants;
exports.start = function(app){
    db.start();
    console.log(`http://localhost:${PORT}`);
    return app.listen(PORT);
}
exports.close = function(app){
    app.off();
    db.close();
    return logger(`Server stopped listening at post [${PORT}]`);
}