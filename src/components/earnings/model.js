const db = Core.Model;
const schema = new db.Schema({
 
    userId:{
        type:Number,
        required:true
    },
    linkId:
    {
        type:String,
        required:true
    },
    originalPrice:
    {
        type:Number,
        required:true
    },
    pourcentage:
    {
        type:Number,
        required:true
    },
    price:
    { 
        type:Number,
        required:true
    },
  date:
  {
      type:Date,
      required:true
  },
 
 
  isPaidOut:
  {
      type:Boolean,
      required:true
  },
  
  isCenceled:
  {
      type:Boolean,
      required:true
  }

},{timestamps : true});

module.exports = db.model('earning',schema);