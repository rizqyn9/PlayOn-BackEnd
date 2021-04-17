module.exports = {
    GeneratedRoomID: () => {
        let array = ["1","2","3","4"]
        return array[Math.floor(Math.random() * array.length)]
    }
}