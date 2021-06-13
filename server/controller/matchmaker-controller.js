const router = require('express').Router()
const {generateRandomString} = require('../utils/util')
const redis_store = require('../utils/redis-store')
const Redis = require('ioredis');  
const redis = new Redis()
// const {RoomState} =require('../utils/matchmaker')
const {portGenerate, GetAllRoom, CreateContainer, RoomReady} = require('../matchmaker/instance')
const {StartContainer} = require('../matchmaker/start')
const {CheckRoom, PlayerJoin, FindRoom} = require('../matchmaker/lobby')
const {log} = require('../utils/logger')
const {RestartDockerGame} = require('../docker-controller/docker')

router.get('/', (req,res) => {
    res.json({msg : "Matchmaker area"})
})

/**
 * Public Room
 * Private Room
 * Join Room
 * Auto Join Room
 */

router.get('/createContainer' , async (req,res) => {
    try {
        CreateContainer().then(val => {
            res.status(200).json(val)
        }).catch(err => {
            res.status(400).json(err)
        })
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get('/getAllRooms' , async(req,res) => {
    try {
        const result = await GetAllRoom()
        res.json(result)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get('/roomReady' , async(req,res) => {
    try {
        RoomReady().then(val => {
            res.status(200).json(val)
        }).catch(err => {
            res.status(400).json(err)
        })
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get('/createPublic', async(req,res) => {
    try {
        StartContainer(true).then(val => {
            console.log(val);
            log.bg_success(`Created roomid : ${val}`)
            res.status(200).json({
                data: "Public room created",
                RoomID : val.roomID,
                Port : val.port,
                IsPublic : val.isPublic
            })
        })
    } catch (error) {
        res.status(400).json({error : "Public room not created"})
    }
})

router.get('/createPrivate' , async(req,res) => {
    try {
        await StartContainer(false).then(val => {
            console.log(val);
            res.status(200).json({
                data: "Private room created",
                ...val
            })
        })
    } catch (error) {
        res.status(400).json({error : "Private room not created"})
    }
} )

//! Player Join
router.get('/join/:roomID' , async(req,res) => {
    let {roomID, playerID} = req.params
    roomID = roomID.toUpperCase();
    try {
        log.bg_warn(`Join Room PlayerID : ${playerID} Room : ${roomID}`)
        await CheckRoom(roomID).then(isAvail => {
            console.log(isAvail);
            if(!isAvail){
                log.bg_success("room not found")
                return res.status(200).json({
                    data:false,
                    msg : "Room ID false"
                })
            }
            return
        })
        const result = await PlayerJoin(roomID,playerID)
        log.bg_success("room success load")
        res.status(200).json({
            ...result,
        })
    } catch (error) {
        log.bg_err("room not found")
        res.status(400).json({error : `Failed to join ${roomID}`})
    }
} )

/**
 * If room container not found, backend will create new instance public room
 */
router.get('/find' , (req,res) => {
    try {
        FindRoom().then(val => {
            console.log(val);
            res.status(200).json(val)
        })
    } catch (error) {
        res.status(400).json({error : `Not found room`})
    }
} )

router.get('/getOffline' ,async  (req,res) => {
    try {

    } catch (error) {
        console.log(error);
    }
})


// ! Error
router.get('/restartServer' , async(req,res) => {
    try {
        // await RestartDockerGame().then(val => {
        //     val.map(data => {
        //         console.log(data);
        //     })
        // }).then(() => {
        //     console.log("success Restart");
        // })
        // const result =  RestartDockerGame().then(val => {
        //     console.log(val);
        // })
        const result = await RestartDockerGame()
        console.log(result);
        res.json(result)
    } catch (error) {
        console.log(error);
    }
})


module.exports = router