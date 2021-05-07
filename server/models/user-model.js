const mongoose = require('mongoose')

const User = new mongoose.Schema({
    TokenSession : {type: String},
    PlayerID: {type : String},
    Name : {type:String},
    UserName : {type:String},
    Password : {type:String},
    Level : {type:Number},
    Character : {type:Object},
})

module.exports = mongoose.model('User', User)