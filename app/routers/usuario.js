require('dotenv').config();
const request = require('request');
const base64Img = require('base64-img');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const rota = require('path').basename(__filename, '.js');
const fs = require('fs');
var multer = require('multer');
var upload = multer();

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
                        username: body.dados[i].username,
                        nivel: body.dados[i].nivel,
                        enabled: body.dados[i].enabled
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
    app.post('/app/' + rota + '/create/submit', upload.single('photo'), function(req, res) {
        const file = req.file;
        let foto;
        if (file) {
            const buf = Buffer.from(req.file.buffer);
            foto = buf.toString('base64');
        } else {
            foto = process.env.PROFILE_IMG
        }
        request({
            url: process.env.API_HOST + rota,
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
                "Authorization": req.session.token
            },
            json: {
                "nome": req.body.nome,
                "username": req.body.username,
                "password": req.body.password,
                "nivel": req.body.nivel,
                "foto": foto
            },
        }, function(error, response, body) {
            res.redirect('/app/' + rota + '/list');
            return true;
            // res.json({ body });
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
                            username: body.dados.username,
                            password: body.dados.password,
                            nivel: body.dados.nivel,
                            enabled: body.dados.enabled,
                            foto: body.dados.foto,
                            page: rota
                        });
                    }
                });
            });
        }
    });

    // Rota para receber parametros via post editar item
    app.post('/app/' + rota + '/edit/submit', upload.single('photo'), function(req, res) {
        const file = req.file;
        let foto;
        if (file) {
            const buf = Buffer.from(req.file.buffer);
            foto = buf.toString('base64');
        }
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
                "nome": req.body.nome,
                "username": req.body.username,
                "password": req.body.password,
                "nivel": req.body.nivel,
                "foto": foto
            },
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