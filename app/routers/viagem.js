require('dotenv').config();
const request = require('request');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const rota = require('path').basename(__filename, '.js');
const S = require('string');
let lista = [];
let mototaxistas = [];
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
                        cliente: body.dados[i].cliente.nome,
                        fone: body.dados[i].cliente.username,
                        status: body.dados[i].status,
                        dataSolicitacao: data(body.dados[i].dataSolicitacao)
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

        }
    });

    function data(data) {
        let dataTratada = S(data).strip('T', 'Z').s;
        let dataTratada2 = S(dataTratada).left(10).s;
        let dataTratada3 = S(dataTratada2).splitLeft('-');
        let dataTratada4 = dataTratada3[2] + "/" + dataTratada3[1] + "/" + dataTratada3[0];
        let horaTradada = S(dataTratada).right(12).s;
        horaTradada = S(horaTradada).left(8).s;
        return dataTratada4 + " " + horaTradada
    };

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

    // Rota para exibição da View Editar
    app.get('/app/' + rota + '/response/:id', function(req, res) {
        if (!req.session.token) {
            res.redirect('/app/login');
        } else {

            request({
                url: "http://191.252.184.112:8001/api/moto",
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
                        modelo: body.dados[i].modelo,
                        placa: body.dados[i].placa,
                        motoqueiro: body.dados[i].motoqueiro.nome
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
                }, async function(error, response, body) {

                    res.format({
                        html: function() {
                            res.render(rota + '/Response', {
                                id: body.dados.id,
                                cliente: body.dados.cliente.nome,
                                fone: body.dados.cliente.username,
                                status: body.dados.status,
                                orilat: body.dados.origem.latitude,
                                orilong: body.dados.origem.longitude,
                                deslat: body.dados.destino.latitude,
                                deslong: body.dados.destino.longitude,
                                motos: mototaxistas,
                                page: rota
                            });
                        }
                    });
                });

            });
        }
    });

    // Rota para receber parametros via post editar item
    app.post('/app/' + rota + '/response/submit', function(req, res) {
        //json = req.body;
        let valorLimpo = S(req.body.valor).strip(' ', 'R$').s;
        valorLimpo = S(valorLimpo).replaceAll(',', '.').s;
        request({
            url: process.env.API_HOST + rota,
            method: "PUT",
            json: true,
            headers: {
                "content-type": "application/json",
                "Authorization": req.session.token
            },
            json: {
                "id": req.body.id,
                "valor": valorLimpo,
                "moto": { "id": req.body.motoqueiro },
                "status": "ATENDIDO"
            },
        }, function(error, response, body) {
            res.redirect('/app/' + rota + '/list');
            return true;
        });

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