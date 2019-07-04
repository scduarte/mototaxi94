require('dotenv').config();
const app = require('./config/express')();
const http = require('http').Server(app);

const io = require('socket.io')(http);

app.use((req,res,next)=>{
    req.io = io;
    return next();
});

http.listen(process.env.SERVER_PORT, function() {
    console.log("Servidor Ativo!");
});

app.get('/', (req, res) => {
    console.log('RESPONDENDO AO ROUTER');
    
    res.format({
        html: function() {
            res.render('template/index');
        }
    });
});