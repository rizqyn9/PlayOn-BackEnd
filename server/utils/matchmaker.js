const {init,log,test} = require('../utils/logger')
const {generateRandomString} = require('../utils/util')
const execa = require('execa');
const redis_store = require('./redis-store')

// ! Redis PORT
// redis_store.port("PORT")

//! Redis ROOM ID
// redis_store.roomID("ROOM", "5080IC")
// redis_store.roomID()

//! Set Room Data Specific
// redis_store.SetRoomData("room1" , {data: "hahah"})

// ! Get Room Data Specific
// redis_store.GetRoomData("room1").then(el => {
//     console.log(el.data);
// })

//! Set Players in conection
// redis_store.RoomPlayers('room1', "player1")


var RoomList =[]

/**
 * Docker run custom
 * Port && Container Nama 
 * docker create 
 */

/**
 * Container Port
 * Room ID
 * State
 * Boolean (Public)
 */
class  RoomState {
    constructor (){
    }

    /**
     *  ? Paused
     * For instance docker state : paused
     */
    async instance() {
        RoomList.push(this)
        this.State = "Ready"
        this.Port =  await this.port()
        this.RoomID = await this.roomID() 
        this.RoomData()
        // this.Container = await CreateContainer(this.Port, this.RoomID)
        this.log() 
    }

    async port (){
        const result = await redis_store.port("port").then(el => {return el})
        this.Port = result
        return result
    }
    async roomID (){
        const result = await redis_store.roomID("room").then(el => {return el})
        this.RoomID = result
        return result
    }

    async RoomData () {
        const result = await redis_store.SetRoomData(this.RoomID, this)
        return result
    }


    /**
     * ? Start => Lobby
     * @param {Boolean} _isPublic 
     */
    async start(_isPublic){
        this.State = "Started"
        // this.Container = await StartContainer(this.Port, this.RoomID)
        this.isPublic = await this.checkPublic()
        this.log()
    }

    async checkPublic () {

    }

    log(){
        console.log(this);
    }
}


// Instance 7 server
// new RoomState(4000,false).instance()
// new RoomState(4001,false).instance()
// new RoomState(false).instance()





const CreateContainer = async(_port, _roomID) => {
    try {
        const res = await execa('docker', ['create', '-p', `${_port}:8080`, '-t', '--name', `${_roomID}`, 'web-test'])
        if(res){
            return res.stdout
        }
    } catch (error) {
        console.log(error);
    }
}

const StartContainer = async(_port, _roomID) => {
    try {
        const res = await execa('docker', ['start',`${_roomID}`])
        if(res){
            return res.stdout
        }
    } catch (error) {
        console.log('Err====================================');
        console.log(error);
    }
}

module.exports ={ RoomState}