const db = Core.Model;
const schema = new db.Schema({
    id :{
        type : Number,
        default: 1,
        unique: true,
        required : true
    },
    first_name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    last_name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },    
    full_name: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    address: {
        country: { type: String },
        city: { type: String },
        zip_code: { type: Number },
        address: { type: String }
      },
   paypal: { 
            email: { type: String  }       
      },
    resetlink: {
        data: String,
        default:''
    },
 
},{timestamps : true});

module.exports = db.model('user',schema);