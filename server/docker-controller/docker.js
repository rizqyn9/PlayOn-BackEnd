const execa = require('execa');
const {log} = require('../utils/logger')
const {GetAllRoom} = require('../matchmaker/instance');

const DockerCreateContainer = (_port, _roomID) => {
    return execa('docker', ['create', '-p', `${_port}:7777/udp`, '-t', '--name', `${_roomID}`, 'unityserver1'])
    .then( res => {
        if(res.stderr){
            // console.log("stderr", res.stderr);
            log.err(`Instance new container roomID : ${_roomID} port : ${_port} `)
            return {error : res.stderr}
        }
        else{
            // console.log(res.stdout);
            log.success(`Instance new container roomID : ${_roomID} port : ${_port} `)
            return res.stdout
        }
    })
    .catch(err => {
        log.err(`Instance new container roomID : ${_roomID} port : ${_port} `)
        return {error : err}
    })
}

const DockerStartContainer = (_roomID) => {
    return execa('docker', ['start', `${_roomID}` ])
    .then(res => {
        if(res.stderr){
            // console.log("stderr", res.stderr);
            log.err(`Fail => Start container roomID : ${_roomID}  `)
            return {error : res.stderr}
        } else {
            // console.log(res.stdout);
            log.success(`Success => Start container roomID : ${_roomID} `)
            return res.stdout
        }
    })
    .catch(err => {
        log.err(`Fail =>  Start container roomID : ${_roomID} `)
        return {error : err}
    })
}

/**
 * For Clearance all dedicated game server
 */
const RestartDockerGame = async() => {
    console.log("ok");
    console.log(GetAllRoom());
    // return GetAllRoom().then(async val => {
    //     console.log('====================================');
    //     console.log("--> ",val);
    //     console.log('====================================');
        
    //     const promises = await val.map(room => {
    //         return execa('docker', ['rm', '-f', `${room}` ])
    //         .then(res => {
    //             if(res.stderr){
    //                 // console.log("stderr", res.stderr);
    //                 throw new Error()
    //             } else {
    //                 // console.log(res.stdout);
    //                 return res.stdout
    //             }
    //         })
    //         .catch(err => {
    //             // log.err(`Fail =>  Start container roomID : ${_roomID} `)
    //             return err
    //         })
    //     })
    //     return Promise.all(promises).then(val => {
    //         val.map(el => {
    //             console.log(el);
    //         })
    //     })
    // })
}


// (async() => {
//     const res = await RestartDockerGame()
//     console.log(res);
// })()


module.exports ={
        DockerCreateContainer,
        DockerStartContainer,
        RestartDockerGame
}