require('dotenv').config();
const request = require('request');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const rota = require('path').basename(__filename, '.js');
const model = require('../models/' + rota);
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
                for (var i = 0; i < Object.keys(body.dados).length; i++) {
                    const finallista = {
                        id: body.dados[i].id,
                        nome: body.dados[i].nome,
                        descricao: body.dados[i].descricao,
                        acessivel: body.dados[i].acessivel
                    };
                    lista.push(finallista);
                }
                res.format({
                    html: function() {
                        res.render(rota + '/List', { itens: lista, page: rota });

                    }
                });
                return lista;
            });
            console.log(teste);
        }
    });

    // Rota para exibição da View Criar
    app.get('/app/' + rota + '/create', function(req, res) {
        if (!req.session.token) {
            res.redirect('/app/login');
        } else {
            res.format({
                html: function() {
                    res.render(rota + '/Create', { page: rota });
                }
            });
        }
    });

    // Rota para receber parametros via post criar item
    app.post('/app/' + rota + '/create/submit', function(req, res) {
        json = req.body;
        request({
            url: process.env.API_HOST + rota,
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
                "Authorization": req.session.token
            },
            json,
        }, function(error, response, body) {
            console.log(error);
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
                url: process.env.API_HOST + rota + "/" + req.params.id,
                method: "GET",
                json: true,
                headers: {
                    "content-type": "application/json",
                    "Authorization": req.session.token
                },
            }, function(error, response, body) {
                console.log()
                res.format({
                    html: function() {
                        res.render(rota + '/Edit', {
                            id: body.dados.id,
                            nome: body.dados.nome,
                            descricao: body.dados.descricao,
                            acessivel: body.dados.acessivel,
                            page: rota
                        });
                    }
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