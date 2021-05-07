const Redis = require('ioredis');  
const redis = new Redis()
const {log} = require('../utils/logger');
const { CreateContainer, RedisInput } = require('./instance')
const {DockerStartContainer} = require('../docker-controller/docker')


const CheckRoomReady = async() => {
    let roomTotal = await redis.llen("RoomReady")
    while(roomTotal < 4) {
        await CreateContainer()
        roomTotal = await redis.llen("RoomReady")
    }
    return true
}
const FindContainer = async () => {
    let check  = await CheckRoomReady()
    if(check) {
        return redis.lindex("RoomReady",0).then(val => {
            console.log(val);
            return val
        })
    } else {
        return {err : "error"}
    }
}

const RoomData = async (_roomID) => {
    let result =  await redis.get(_roomID,(err,res) => {
        return res
    })
    return JSON.parse(result)
}

const updateRoomData  = async (_roomID, _value) => {
    return await redis.set(_roomID, JSON.stringify(_value), (err, res) => {
        return res
    })
}

const SetPublic = async(Room) => {
    RedisInput("RoomPublic", Room.roomID )
    DeleteInput("RoomReady", Room.roomID)
    updateRoomData(Room.roomID, Room)
}

const SetPrivate = async(Room) => {
    RedisInput("RoomPrivate", Room.roomID )
    DeleteInput("RoomReady", Room.roomID)
    updateRoomData(Room.roomID, Room)
}

const DeleteInput = async(_key ,_value) => {
    return await redis.lrem(_key,0,_value, (err,res) => {
        // log.bg_success(res)
    })
}

const StartContainer = async (_isPublic) => {
    _isPublic == null ? _isPublic = true : _isPublic
    let roomID = await FindContainer()
    let Room = await RoomData(roomID)
    console.log(Room);

    if(_isPublic) {
        Room.isPublic = true
        Room.state = "Start"
        SetPublic(Room)
    } else {
        Room.isPublic = false
        Room.state = "Start"
        SetPrivate(Room)
    }
    redis.lpush("RoomLobby", roomID)
    await DockerStartContainer(roomID)
    return Room
}

// StartContainer()
module.exports = {
    StartContainer,
    RoomData
}