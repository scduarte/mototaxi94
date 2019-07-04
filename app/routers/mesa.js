require('dotenv').config();
const request = require('request');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const rota = require('path').basename(__filename, '.js');
const area2 = require('./area')
let lista = [];
let area = require('./area');

module.exports = async function(app) {

    app.use(cookieParser());
    app.use(session({ secret: "2C44-4D44-WppQ38S" }));

    // Rota para exibiçõa da View para listar Área
    app.get('/app/' + rota + '/list', function(req, res) {
        if (!req.session.token) {
            res.redirect('/app/login');
        } else {
            console.log(area.teste);

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
                        numero: body.dados[i].numero,
                        quantidadePessoas: body.dados[i].quantidadePessoas,
                        status: body.dados[i].status,
                        area: body.dados[i].area.nome
                    };
                    lista.push(finallista);
                }
                res.format({
                    html: function() {
                        res.render(rota + '/List', { mesa: lista });
                    }
                });
            });
            
        }
    });

    // Rota para exibiçõa da View para criar Área
    app.get('/app/' + rota + '/create', function(req, res) {
        if (!req.session.token) {
            res.redirect('/app/login');
        } else {
            //console.log(area2.lista4);

            request({
                url: "http://191.252.184.112:8000/api/area",
                method: "GET",
                json: true,
                headers: {
                    "content-type": "application/json",
                    "Authorization": req.session.token
                },
            }, async function(error, response, body) {
                area = [];
                for (var i = 0; i < Object.keys(body.dados).length; i++) {
                    const finalarea = {
                        id: body.dados[i].id,
                        nome: body.dados[i].nome,
                        descricao: body.dados[i].descricao,
                        acessivel: body.dados[i].acessivel,
                    };
                    area.push(finalarea);
                }
                res.format({
                    html: function() {
                        res.render(rota + '/Create', { itensArea: area });
                    }
                });
            });
        }
    });

    app.post('/app/' + rota + '/create/submit', function(req, res) {
        request({
            url: process.env.API_HOST + rota,
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
                "Authorization": req.session.token
            },
            json: {
                "numero": req.body.numero,
                "quantidadePessoas": req.body.quantidadePessoas,
                "area": { "id": req.body.area },
                "status": req.body.status
            },
        }, function(error, response, body) {
            res.redirect('/app/' + rota + '/list');
            return true;
        });

    });

    // Rota para exibiçõa da View para listar Área
    app.get('/app/' + rota + '/edit/:id', function(req, res) {
        if (!req.session.token) {
            res.redirect('/app/login');
        } else {

            request({
                url: "http://191.252.184.112:8000/api/area",
                method: "GET",
                json: true,
                headers: {
                    "content-type": "application/json",
                    "Authorization": req.session.token
                },
            }, function(error, response, body) {
                area = [];
                for (var i = 0; i < Object.keys(body.dados).length; i++) {
                    const finalarea = {
                        id: body.dados[i].id,
                        nome: body.dados[i].nome,
                        descricao: body.dados[i].descricao,
                        acessivel: body.dados[i].acessivel,
                    };
                    area.push(finalarea);
                }
            });

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
                            numero: body.dados.numero,
                            status: body.dados.status,
                            quantidadePessoas: body.dados.quantidadePessoas,
                            areaId: body.dados.area.id,
                            itensArea: area
                        });
                    }
                });
            });

        }
    });

    app.post('/app/' + rota + '/edit/submit', function(req, res) {

        request({
            url: process.env.API_HOST + rota,
            method: "PUT",
            json: true,
            headers: {
                "content-type": "application/json",
                "Authorization": req.session.token
            },
            json: {
                "numero": req.body.numero,
                "quantidadePessoas": req.body.quantidadePessoas,
                "area": { "id": req.body.area },
                "status": req.body.status,
                "id": req.body.id
            },
        }, function(error, response, body) {
            res.redirect('/app/' + rota + '/list');
            return true;
        });

    });

    // Rota para exclucao de um item da Área
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
            });
        }
    });

    app.post('/app/' + rota + '/libera/', function(req, res) {
        if (!req.session.token) {
            res.redirect('/app/login');
        } else {
            request({
                url: process.env.API_HOST + rota + "/libera/" + req.body.idMesa,
                method: "PUT",
                json: true,
                headers: {
                    "content-type": "application/json",
                    "Authorization": req.session.token
                },
            }, function(error, response, body) {
                res.redirect('/app/atendimento/list');
            });
        }
    });

}