const db = Core.Model;
const schema = new db.Schema({
    userId: {
        type: Number,
        required: true,
    },
    linkId:
    {
        type:String,
        required:true
    },
    link: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type:Date,
        default: Date.now
      }
},{timestamps : true});
module.exports = db.model('click',schema);