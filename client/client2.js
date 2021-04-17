const ws = require('ws')

const client = new ws("ws://localhost:3000")

client.on("open" , () => {

    client.send("Hello")
    client.addEventListener("test", () => {
        console.log('====================================');
        console.log("tes");
        console.log('====================================');
    })
    client.emit("data" )
    client.addListener("data",data => {
        console.log(data);
    })
})

// client.on("data", () => {
//     console.log("data");
//     client.send("Data")
// })

client.on("ping", ()=> {
    console.log("PING!!");
})

client.on("close", () => {
    console.log("Shutdown");
})

client.on("test", () => {
    client.send("Haiii test")
})

client.on('message', (data) => {
    console.log(data);
})

client.addEventListener("test" , test => {
    console.log(test);
})

client.on("test" , (data) => {
    console.log(data);
})