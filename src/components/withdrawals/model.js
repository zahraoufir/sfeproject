const db = Core.Model;
const schema = new db.Schema({
    id_user :{
        type : Number,
        required : true
    },
    total: {
        type: Number,
        required: true,
        
    },
    earnings: {
        type: [mongoose.ObjectId],
        required: true,
    },
    date:
    {
        type:Date,
        required:true
    }
   
},{timestamps : true});

module.exports = db.model('withdrawals',schema);