const Redis = require('ioredis');  
const redis = new Redis()
const {generateRandomString} = require('./util')
const {log} = require('./logger')

module.exports = {
    /**
     * for instance unique port
     * @param {String} _key 
     * @param {String} _value 
     */
    port : async (_key, _value ) => {
        _value == null ? _value = 4000 : _value
        const result = await redis.get(_key).then(res => {
            res == null ? res = [] : res = JSON.parse(res)
            console.log(res);
            while(res.includes(_value)){
                _value++
            }
            res.push(_value)
            redis.set(_key, JSON.stringify(res)).then(res => {
                log.success(res)
                // log.success(_value)
                return _value
            })
            return _value
        })
        return result
    },
    /**
     * for instance unique roomID
     * @param {String} _key @default ROOMID
     * @param {String} _value 
     */
     roomID :async (_key, _value ) => {
         _key == null ? _key = "ROOM" : _key
        _value == null ? _value = generateRandomString() : _value
        const result = await redis.get(_key).then(res => {
            res == null ? res = [] : res = JSON.parse(res)
            console.log(res);
            while(res.includes(_value)){
                _value = generateRandomString()
            }
            res.push(_value)
            redis.set(_key, JSON.stringify(res)).then(res => {
                console.log(res);
            })
            return _value
        })
        return result
    },
    /**
     * Show details room information
     * @param {String} _roomID 
     * @param {Object} _data
     */
    SetRoomData : (_roomID, _data) => {
        redis.set(_roomID, JSON.stringify(_data)).then(el => {
            log.success(el)
        })
    },
    /**
     * Show details room information
     * @param {String} _roomID 
     * @param {Object} _data
     */
    GetRoomData : async (_roomID) => {
        const res =  await redis.get(_roomID).then(val => {
            log.success(val)
            val = JSON.parse(val)
            return val
        })
        return res
    },
    RoomPlayers: (_roomID,_playerID) => {
        redis.rpush(`room:${_roomID}`,[_playerID]).then(val => {
            console.log(val);
        })
    },
    PublicRoom : async (_roomID) => {
        return await redis.rpush("public" , _roomID).then((val) => {
            console.log(val);
            return val
        })
    },

    PrivateRoom: async (_roomID) => {
        return await redis.rpush("private" , _roomID).then((val) => {
            console.log(val);
            return val
        })
    },
    
    RoomList: async (_isPublic) => {
        _isPublic ? "public" : "private"
        return await redis.lrange(_isPublic, 0,-1).then(val => {
            console.log(val);
            return val
        })
    },
    /**
     * Show All rooms / Container
     * @param {Redis_Key} _key 
     */
    ShowAllRooms : async (_key) => {
        _key == null ? _key = "ROOM" : _key
        const result = await redis.get(_key, (err, res) => {
            if(err) return err
            console.log(res);
            return res
        })
        return result
    },
    
    clearInstance : (...arg) => {
        
    }
}