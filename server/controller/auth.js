const router = require('express').Router()
const User = require('../models/user-model')

router.get('/signup', (req,res) => {
    res.render('signup')
})

router.post('/signup', (req,res,next) => {
    try {
        const user = new User({...req.body})
        user.save((err,data) => {
            if(err)  return console.log(err);
            console.log(data);
            res.redirect('stat')
        })
    } catch (error) {
        console.log(error);
    }
})

router.get('/signin', (req,res) => {
    res.render('login')
})
router.post('/signin' , async(req,res) => {
    try {
        let user = await User.findOne({UserName : req.body.UserName}).exec()
        if(!user){
            return res.status(401).redirect('/')
        } 
        // console.log(user);
        // console.log(req.body.Password)
        let passCheck = user.Password == req.body.Password
        // console.log(passCheck);
        if(!passCheck) {
            console.log("Wrong Pass");
            return res.redirect('/')
        }
        console.log("User sign in");
        res.redirect('stat')

    } catch (error) {
        console.log(error);
    }
})

router.get('/stat', async(req,res) => {
    try {
        let data = await User.find()
        res.render('stat', {
            data:data
        })
    } catch (error) {
        console.log(error);
    }
})

module.exports = router




