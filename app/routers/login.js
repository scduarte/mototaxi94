require('dotenv').config();
const request = require('request');
const cookieParser = require('cookie-parser');
const session = require('express-session');

module.exports = async function(app) {
    app.use(cookieParser());
    app.use(session({ secret: "2C44-4D44-WppQ38S" }));

    app.get('/app/login/', function(req, res) {
        res.format({
            html: function() {
                res.render('login');
            }
        });
    });

    app.post('/app/authentication/', function(req, res) {

        request({
            url: "http://191.252.184.112:8001/public/signin",
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
                "idApp": "e23eeq223rwe5343wrwer7"
            },
            json: {
                "password": req.body.password,
                "username": req.body.email,
            },
        }, function(error, response, body) {
             req.session.token = body.accessToken;
             res.redirect('/app/principal');
            // res.json({ body.accessToken });
            console.log(body.accessToken);
            return true;
        });

    });

    app.get('/app/sair', function(req, res) {
        req.session.destroy();
        res.redirect('/app/login');
    });

}