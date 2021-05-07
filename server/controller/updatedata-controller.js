const router = require('express').Router()

router.get('/' , (req,res) => {
    res.status(200).json({data: "Update user data"})
})

router.get('/:playerID' , (req,res) => {
    try {
        const {playerID} = req.params
        res.status(200).json({data: `Update user ${playerID} `})
    } catch (error) {
        res.status(400).json({data: `Fail Update user ${playerID} `})
    }
})

module.exports = router