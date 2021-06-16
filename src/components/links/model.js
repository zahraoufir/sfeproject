const db = Core.Model;
const schema = new db.Schema({
    userId: {
        type: Number,
        required: true,
    },
    route: {
        type: String,
        required: true,
        unique: true,
    },
    redirect: {
        type: String,
        required: true,
    },
    nbrClicks: {
        type: Number,
        required: true,
    },
},{timestamps : true});

module.exports = db.model('user',schema);