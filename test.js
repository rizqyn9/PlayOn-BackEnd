const {exec} = require('child_process')

exec('docker image inspect redis:alpine',(err, stdout, stderr) => {
    if(err) return console.log(err);
    console.log(stdout);
    console.log('====================================');
    console.log(stderr);
    console.log('====================================');
})