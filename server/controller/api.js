const router = require('express').Router()
const User = require('../models/user-model')

router.get('/signup', (req,res) => {
    res.render('signup')
})

router.post('/signup', (req,res,next) => {
    console.log(req.body);
    try {
        const user = new User({...req.body})
        user.save((err,data) => {
            if(err)  return console.log(err);
            console.log(data);
            res.status(201).json(data)
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
            return res.status(401)
        }
        console.log(user);
        res.status(200).json(user)

    } catch (error) {
        console.log(error);
    }
})

router.get("/getdata/:id" , async(req,res,next) => {
    try {
        const user = await User.findById(req.params.id)
        console.log(user);
        if(user){
            res.status(200).json(user)
        } else {
            res.status(400)
        }
    } catch (error) {
        console.log(error);
        res.status(500)
    }
} )


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


module.exports= router

