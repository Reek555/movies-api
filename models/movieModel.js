const mongoose = require("mongoose"); 
require("dotenv").config()


mongoose.connect(process.env.DB);



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
