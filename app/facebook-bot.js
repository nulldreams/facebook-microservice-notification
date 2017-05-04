const request 	  = require('request')
const Notificacao = require('./models/notificacao')
const schedule    = require('node-schedule');

exports.LerMensagem = (mensagem) => {
	console.log(mensagem)
}

exports.VerificaFilaNotificacao = () => {

	let rule = new schedule.RecurrenceRule();
	rule.second = [0, 10, 20, 30, 40, 50]

	let j = schedule.scheduleJob(rule, function() {
		console.log('verificando...')
		GetNotificacoes()
		console.log('encontrou...')
	});
}

var GetNotificacoes = () => {
	Notificacao.find({}, (err, notificacoes) => {
		if (err) return console.error(err)

		if (typeof notificacoes[0] !== 'undefined') {
			for (var i = 0; i < notificacoes.length; i++) {
				sendMessage(notificacoes[i].usuario, notificacoes[i].mensagem)
			}
		}
	})
}

var sendMessage = (usuario, mensagem) => {

	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {
			access_token: 'EAADL9MCog9oBANIKtZB2wVrqZAHHslcNw7LesNFButs4nvjVkQfy2coZAGeev4iWRpIa8RAVCjOGpJngqzZAHRAC4Q5jEac7w1LhXr3lvq97ArkEjSBKZBs7lZBoHO3VLiAxRWr3YKldDEtsMyBq0SfSvdIsDQcwsB9I5sANiKewZDZD'
		},
		method: 'POST',
		json: {
			recipient: {
				id: usuario
			},
			message: {
				text: mensagem
			}
		}
	}, function(error, response) {
		if (error) {
			console.log('Error sending message: ', error);
		} else if (response.body.error) {
			console.log('Error: ', response.body.error);
		}
	});
}