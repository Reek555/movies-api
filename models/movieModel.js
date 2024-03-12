const mongoose = require("mongoose"); 
require("dotenv").config()


//mongoose.connect('mongodb://127.0.0.1:27017/test');
//mongoose.connect("mongodb+srv://rickswass:9bpClcBDMyAqHbVp@cluster0.1zeidif.mongodb.net/test")
mongoose.connect(process.env.LOCAL_DB);



const MovieSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, "why no name?"] 
    }, 
    gener : {
        type: String,
        required: [true, "why no gener?"] ,
    }, 
    rate: {
        type: Number,
        default: 0
    },

    reviews : {
        type :[{
            user : {type: "objectId"}, 
            comment: {type: String},
            rate: {type: Number}, 
            _id: false
        }], 
        default: []
    }

})


const Movies = mongoose.model("Movie", MovieSchema)


module.exports = Movies; 