module.exports = {
    generateRandomString :() => {
        return Math.random().toString(20).toUpperCase().substr(4, 6)
    }
}
