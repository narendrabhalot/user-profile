const mongoose = require('mongoose')

const userSchema= new mongoose.Schema({

 firstName :{
    type :String,
    required: true,
    trim:true,
 },
lastName:{
    type: String,
    trim:true,
    required: true,
},
email:{
    type:String,
    unique:true

},
password:{

    type: String,
    required: true,
    trim: true
    

}


},{timestamps: true})



module.exports = mongoose.model("Userprofile", userSchema);
