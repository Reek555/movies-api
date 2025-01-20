const mongoose = require("mongoose"); 
require("dotenv").config()


//mongoose.connect('mongodb://127.0.0.1:27017/test');
//mongoose.connect("mongodb+srv://rickswass:9bpClcBDMyAqHbVp@cluster0.1zeidif.mongodb.net/test")
mongoose.connect(process.env.DB);



const UserSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, "why no name?"] 
    }, 
    email : {
        type: String,
        required: [true, "why no email?"] ,
        unique: true
    }, 
    password: {
        type: String, 
        required: [true, "why no password?"],
        minlength: 6
    },
    watchList : [{
        movie : {type: "objectId"},
        watched: {type: Boolean}, 
        _id: false
    }
    ],
    
    isAdmin: {
        type: Boolean, 
        default: false
    }

})


const Users = mongoose.model("User", UserSchema)


async function main () {
    
    let a = new Users({name: "the rick", email: "therick@gmail.com", password: "123456"});   // this is a promise
    a.save()
    console.log(1)

}



module.exports = Users; 
