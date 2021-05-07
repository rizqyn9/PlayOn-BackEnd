const router = require('express').Router()
const User = require('../models/user-model')
const {v4 : uuidv4} = require('uuid')
router.get('/signup', (req,res) => {
    res.render('signup')
})

router.post('/signup', (req,res,next) => {
    console.log(req.body);
    try {
        const user = new User({
            ...req.body,
            PlayerID : Date.now(),
            Level : 0,
            Character :null
        })
        user.save((err,data) => {
            if(err)  return console.log(err);
            console.log(data);
            console.log("New User Registered");
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
            console.log("anonymous Login");
            return res.status(401).redirect('/')
        } 
        console.log(user);
        let passCheck = user.Password == req.body.Password

        if(!passCheck) {
            console.log("Wrong Pass");
            return res.status(401).json({err:"error"})
        }
        console.log("Generated Ticket");
        console.log("--> User Sign In");
        res.status(200).json(user)

    } catch (error) {
        console.log(error);
    }
})

router.get("/getdata/:id" , async(req,res,next) => {
    try {
        const user = await User.findById(req.params.id)
        console.log("User Online");
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

