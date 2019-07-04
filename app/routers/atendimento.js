require('dotenv').config();
const request = require('request');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const rota = require('path').basename(__filename, '.js');
let lista = [];


module.exports = async function(app) {
    app.use(cookieParser());
    app.use(session({ secret: "2C44-4D44-WppQ38S" }));

    app.get('/app/principal/', function(req, res) {

        if (!req.session.token) {
            res.redirect('/app/login');
        } else {
            res.format({
                html: function() {
                    res.render('template/index');
                }
            });
        }
    });

    // Rota para exibiçõa da View para listar Área
    app.get('/app/' + rota + '/list', function(req, res) {
        if (!req.session.token) {
            res.redirect('/app/login');
        } else {
 
            request({
                url: "http://191.252.184.112:8000/api/mesa",
                method: "GET",
                json: true,
                headers: {
                    "content-type": "application/json",
                    "Authorization": req.session.token
                },
            }, function(error, response, body) {
                mesas = [];
                for (var i = 0; i < Object.keys(body.dados).length; i++) {
                    const finalmesas = {
                        id: body.dados[i].id,
                        numero: body.dados[i].numero,
                        quantidadePessoas: body.dados[i].quantidadePessoas,
                        status: body.dados[i].status
                    };
                    mesas.push(finalmesas);
                }
            });
 
            request({
                url: process.env.API_HOST + rota,
                method: "GET",
                json: true,
                headers: {
                    "content-type": "application/json",
                    "Authorization": req.session.token
                },
            }, function(error, response, body) {
                lista = [];
                for (var i = 0; i < Object.keys(body.dados).length; i++) {
                    const finallista = {
                        id: body.dados[i].id,
                        clienteNome: body.dados[i].clienteNome,
                        clienteCelular: body.dados[i].clienteCelular,
                        quantidadePessoas: body.dados[i].quantidadePessoas,
                        cadeirante: body.dados[i].cadeirante,
                        status: body.dados[i].status,
                        tipoFila: body.dados[i].tipoFila
                    };
                    lista.push(finallista);
                }
                res.format({
                    html: function() {
                        res.render(rota + '/List', { atendimento: lista, listaMesas: mesas });
                    }
                });

            });
        }

    });


    // Rota para exibiçõa da View para criar Área
    app.get('/app/atendimento/create', function(req, res) {
        if (!req.session.token) {
            res.redirect('/app/login');
        } else {

            res.format({
                html: function() {
                    res.render('atendimento/Create');
                }
            });
        }
    });


    app.post('/app/atendimento/create/submit', function(req, res) {
        request({
            url: process.env.API_HOST + rota,
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
                "Authorization": req.session.token
            },
            json: {
                "cadeirante": req.body.cadeirante,
                "clienteCelular": "+55"+req.body.clienteCelular,
                "clienteNome": req.body.clienteNome,
                "quantidadePessoas": req.body.quantidadePessoas,
                "status": req.body.status,
                "tipoFila": req.body.tipoFila
            },
        }, function(error, response, body) {
            res.redirect('/app/atendimento/list');
            return true;
            //res.json({ body });
            //console.log(response);
        });

    });

    app.post('/app/' + rota + '/add/cliente/submit', function(req, res) {
        request({
            url: process.env.API_HOST + rota,
            method: "PUT",
            json: true,
            headers: {
                "content-type": "application/json",
                "Authorization": req.session.token
            },
            json: {
                "mesas": [{ "id": req.body.idMesa }],
                "status": "ATENDIMENTO",
                "id": req.body.idAtendimento
            },
        }, function(error, response, body) {
            res.redirect('/app/' + rota + '/list');
            return true;
            //res.json({ body });
        });

    });


}