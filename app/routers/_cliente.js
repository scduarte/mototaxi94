const getJSON = require('get-json');

module.exports = function(app) {
    app.get('/api/cliente2/', function(req, res) {
		const url = 'http://191.252.184.112:8000/public/atendimento/5cd04d24c565626fe9bc9513';
		getJSON(url, function(error, response){
 			//console.log(error);
			res.format({
				html: function() {
					res.render('index', {nomeFantasia: response.dados.empresa.nomeFantasia, posicaoFila: response.dados.posicaoFila, quantidadePessoas: response.dados.quantidadePessoas, cliente: response.dados.cliente.nome});
				}
			});

		});

    });
    
    
}