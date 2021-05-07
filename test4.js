const {generateRandomString} = require('./server/utils/util')
const execa = require('execa');
const Redis = require('ioredis')
const figlet = require('figlet')
const gradient = require('gradient-string');
const { red } = require('chalk');
console.log(
    gradient.instagram(
        figlet.textSync("RIZQY\nSTUDIO", {
            font: "Epic",
            horizontalLayout: "default",
        })
    )
);
        
/** 
 * ! Set Up redis
 */

// ! Example Redis
const example = {
    data1: 1,
    data2: 2,
    data3: ["arr1","arr2","arr3"],
}
const redis = new Redis()
redis.set("foo", JSON.stringify(example));
redis.get("foo").then(el => {
    const res = JSON.parse(el)
    console.log(res.data3[0]);
})


var PORT = []
var RoomID = []
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
class RoomState {
    constructor(_port, _isPublic){
        this.Port = _port,
        this.isPublic = _isPublic,
        this.RoomID = generateRandomString()
    }

    async instance() {
        RoomList.push(this)
        PORT.push(this.Port)
        this.State = "Ready"
        // this.Container = await CreateContainer(this.Port, this.RoomID)
        this.log()
    }
    
    start(){
        this.State = "Started"
        // this.Container = await StartContainer(this.Port, this.RoomID)
        this.log()
    }

    log(){
        console.log(this);
    }
}


const instanceNewRoom = (_port )=> {
    while(PORT.includes(_port)){
        _port++
    }
    console.log(_port);
    new RoomState(_port, true).instance()
}

RoomList.map((room,i) => {
    console.log(room.RoomID);
})



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

// Instance 7 server
new RoomState(4000,false).instance()
new RoomState(4001,false).instance()
