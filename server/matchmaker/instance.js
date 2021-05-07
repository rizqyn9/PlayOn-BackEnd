const Redis = require('ioredis');  
const redis = new Redis()
const {log} = require('../utils/logger');
const {generateRandomString} = require('../utils/util')
const {DockerCreateContainer} = require('../docker-controller/docker')
// const redis_store = require('./redis-store')


const portGenerate=  async(_port) => {
    _port == null ? _port = 4000 : _port
    return await redis.lrange("port" , 0 , -1).then(val => {
        while(val.includes(`${_port}`)){
            _port++
        }
        // log.success(_port)
        RedisInput("port",_port)
        return _port
    })
}

const roomIDGenerate=  async (_roomID ) => {
    _roomID == null ? _roomID = generateRandomString() : _roomID
    return await redis.lrange("roomList" , 0 , -1).then(val => {
        while(val.includes(`${_roomID}`)){
            _roomID = generateRandomString()
        }
        // log.success(_roomID)
        RedisInput("roomList",_roomID)
        return _roomID
    })
}

const RedisInput=  async(_key,_value,_isRight) => {
    if(_isRight){
        return await redis.rpush(_key, _value)
    }
    return await redis.lpush(_key, _value)
}

const CreateContainer=  async () => {
    const data = await{
        roomID : await roomIDGenerate(),
        port : await portGenerate(),
        state : "Instance"
    }
    // RedisInput('port', data.port)
    // RedisInput('roomList', data.roomID)
    log.success(JSON.stringify(data))
    let containerRes = await DockerCreateContainer(data.port, data.roomID)
    console.log(containerRes);
    RedisInput('RoomReady', data.roomID)
    redis.set(`${data.roomID}` , JSON.stringify(data))
    return data
}

const GetAllRoom  = async() => {
    const result =  await redis.lrange("roomList" , 0 , -1).then(val => {
        return val
    })
    return result
}

const RoomReady = async () => {
    return await redis.lrange('RoomReady', 0, -1).then(val => {
        return val
    })
}


module.exports = {
    CreateContainer,
    GetAllRoom,
    RoomReady,
    RedisInput
}
// (async () => {
//     const data = await GetAllRoom()
//     console.log(data);

// })()
