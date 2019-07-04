const request = require('request');

module.exports = async function(app) {
    app.post('/viagem',(req, res)=>{
        req.io.emit('new_trip',req.body);
    });
}