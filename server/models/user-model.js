const mongoose = require('mongoose')

const User = new mongoose.Schema({
    Name : {type:String},
    UserName : {type:String},
    Password : {type:String},
    Level : {type:Number},
})

module.exports = mongoose.model('User', User)