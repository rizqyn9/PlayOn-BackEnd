const Redis = require('ioredis');  
const redis = new Redis()
const {log} = require('../utils/logger');
const {generateRandomString} = require('../utils/util')
const {RoomData} = require('./start')
const {StartContainer} = require('../matchmaker/start')


/**
 * Join Room
 * Players in Room
 * Start Room
 */
const CheckRoom = async (_roomID) => {
    let avaible = await redis.lrange('RoomLobby', 0 , -1).then(val => {
        return val.includes(_roomID)
    })
    return avaible
}

const FindRoom = async () => {
    return await redis.lrange('RoomLobby', 0 , -1).then(val => {
        if(val.length == 0 ){
            return "not found"
        }
        return val[0]
    }).then(val => {
        // console.log("-->",val);
        if(val == "not found"){
            return StartContainer(true).then(val => {
                console.log(val);
                log.bg_success(`Created roomid : ${val}`)
                return {
                    data: "Public room created",
                    RoomID : val.roomID,
                    Port : val.port,
                    IsPublic : val.isPublic
                }
            })
        }
        return redis.get(val).then(res => {
            let val = JSON.parse(res)
            return {
                data: "Public room created",
                RoomID : val.roomID,
                Port : val.port,
                IsPublic : val.isPublic
            }
        }) 
    })
}

const PlayerJoin = async (_roomID, _playerID) => {
    redis.rpush(`room:${_roomID}`, _playerID)
    return await RoomData(_roomID)
    //  Can use for max players in room
}


module.exports = {
    CheckRoom,
    PlayerJoin,
    FindRoom
}
// CheckRoom("F9815J").then(avaible => {
//     console.log(avaible);
// })
