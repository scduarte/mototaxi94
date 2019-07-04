require('dotenv').config();
const request = require('request');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const rota = require('path').basename(__filename, '.js');
let lista = [];
let finallista = {};
let json = {};
let teste;
//const Array = require('array');
//export const list2 = "teste";

module.exports = async function(app) {

    app.use(cookieParser());
    app.use(session({ secret: "2C44-4D44-WppQ38S" }));

    // Rota para exibição da View Listar
    app.get('/app/' + rota + '/list', function(req, res) {

        if (!req.session.token) {
            res.redirect('/app/login');
        } else {


            teste = request({
                url: process.env.API_HOST + rota,
                method: "GET",
                json: true,
                headers: {
                    "content-type": "application/json",
                    "Authorization": req.session.token
                },
            }, function(error, response, body) {
                lista = [];

                if (body.dados != null) {
                    for (var i = 0; i < Object.keys(body.dados).length; i++) {
                        const finallista = {
                            id: body.dados[i].id,
                            placa: body.dados[i].placa,
                            motoqueiro: body.dados[i].motoqueiro.nome,
                            status: body.dados[i].motoqueiro.enable
                        };
                        lista.push(finallista);
                    }
                }
                res.format({
                    html: function() {
                        res.render(rota + '/List', { itens: lista, page: rota });

                    }
                });
                return lista;
            });
        }
    });

    // Rota para exibição da View Criar
    app.get('/app/' + rota + '/create', function(req, res) {
        if (!req.session.token) {
            res.redirect('/app/login');
        } else {

            request({
                url: "http://191.252.184.112:8001/api/usuario",
                method: "GET",
                json: true,
                headers: {
                    "content-type": "application/json",
                    "Authorization": req.session.token
                },
            }, async function(error, response, body) {
                mototaxistas = [];
                for (var i = 0; i < Object.keys(body.dados).length; i++) {
                    const finalarea = {
                        id: body.dados[i].id,
                        nome: body.dados[i].nome,
                        nivel: body.dados[i].nivel,
                        enabled: body.dados[i].enabled
                    };
                    mototaxistas.push(finalarea);
                }
                res.format({
                    html: function() {
                        res.render(rota + '/Create', { itensMototaxista: mototaxistas, page: rota });
                    }
                });
            });

        }
    });

    // Rota para receber parametros via post criar item
    app.post('/app/' + rota + '/create/submit', function(req, res) {
        // json = req.body;
        request({
            url: process.env.API_HOST + rota,
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
                "Authorization": req.session.token
            },
            json: {
                "marca": req.body.marca,
                "modelo": req.body.modelo,
                "motoqueiro": { "id": req.body.motoqueiro },
                "placa": req.body.placa
            },
        }, function(error, response, body) {
            res.redirect('/app/' + rota + '/list');
            return true;
        });

    });

    // Rota para exibição da View Editar
    app.get('/app/' + rota + '/edit/:id', function(req, res) {
        if (!req.session.token) {
            res.redirect('/app/login');
        } else {

            request({
                url: "http://191.252.184.112:8001/api/usuario",
                method: "GET",
                json: true,
                headers: {
                    "content-type": "application/json",
                    "Authorization": req.session.token
                },
            }, async function(error, response, body) {
                mototaxistas = [];
                for (var i = 0; i < Object.keys(body.dados).length; i++) {
                    const finalareaMoto = {
                        id: body.dados[i].id,
                        nome: body.dados[i].nome,
                        nivel: body.dados[i].nivel,
                        enabled: body.dados[i].enabled
                    };
                    mototaxistas.push(finalareaMoto);

                }

                request({

                    url: process.env.API_HOST + rota + "/" + req.params.id,
                    method: "GET",
                    json: true,
                    headers: {
                        "content-type": "application/json",
                        "Authorization": req.session.token
                    },
                }, function(error, response, body) {
                    res.format({
                        html: function() {
                            res.render(rota + '/Edit', {
                                id: body.dados.id,
                                placa: body.dados.placa,
                                modelo: body.dados.modelo,
                                marca: body.dados.marca,
                                mototaxista: body.dados.motoqueiro.id,
                                itensMototaxista: mototaxistas,
                                page: rota
                            });
                        }
                    });
                });

            });

        }
    });

    // Rota para receber parametros via post editar item
    app.post('/app/' + rota + '/edit/submit', function(req, res) {
        json = req.body;
        request({
            url: process.env.API_HOST + rota,
            method: "PUT",
            json: true,
            headers: {
                "content-type": "application/json",
                "Authorization": req.session.token
            },
            json,
        }, function(error, response, body) {
            res.redirect('/app/' + rota + '/list');
            return true;
        });

    });

    // Rota para exclusão de um item
    app.post('/app/' + rota + '/delete/', function(req, res) {
        if (!req.session.token) {
            res.redirect('/app/login');
        } else {
            request({
                url: process.env.API_HOST + rota + "/" + req.body.id,
                method: "DELETE",
                json: true,
                headers: {
                    "content-type": "application/json",
                    "Authorization": req.session.token
                },
            }, function(error, response, body) {
                res.redirect('/app/' + rota + '/list');
                return true;
            });

        }
    });

}