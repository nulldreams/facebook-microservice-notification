const request 	  = require('request')
const Notificacao = require('./models/notificacao')
const User		  = require('./models/user')
const schedule    = require('node-schedule');
const ObjectId    = require('mongodb').ObjectId

/*
{  
   object:'page',
   entry:[  
      {  
         id:'618248161706129',
         time:1493901316537,
         messaging:[  
            Object
         ]
      }
   ]
},
{  
   sender:{  
      id:'1440266809365751'
   },
   recipient:{  
      id:'618248161706129'
   },
   timestamp:1493901316143,
   message:{  
      mid:'mid.$cAAJouArA4xZiBLpYL1b03UPdjtKL',
      seq:486246,
      text:'ola'
   }
}
*/


exports.LerMensagem = (event) => {
  let usuario = event.sender.id
  let mensagem = event.message.text

  AtivaNotificacao(mensagem, usuario)
}

var AtivaNotificacao = (token, usuario_fb) => {
	console.log('Token', token)
	console.log('Usuario', usuario_fb)
	User.findOne({ 'notificacoes.token': token }, (err, usuario) => {
		if (err) console.error(err)

		console.log('Usuario encontrado', usuario)
		if (usuario !== null) {
			usuario.notificacoes.messenger = true
			usuario.notificacoes.usuario_fb = usuario_fb
			usuario.local.usuario_fb = usuario_fb
			usuario.notificacoes.token = ''

			usuario.save((err, doc) => {
				if (err) console.error(err)

				console.log('User salvo', doc)
				sendMessage(usuario_fb, 'Au Au! Agora você irá receber as notificações por aqui! :)')
			})
		}
	})

}

exports.VerificaFilaNotificacao = () => {

	let rule = new schedule.RecurrenceRule();
	rule.second = [0, 10, 20, 30, 40, 50]

	let j = schedule.scheduleJob(rule, function() {
		GetNotificacoes()
	});
}

var GetNotificacoes = (callback) => {
	Notificacao.find({ 'enviada': false }, (err, notificacoes) => {
		if (err) return console.error(err)
			if (notificacoes.length > 0) {
				EnviarNotificacoes(notificacoes, (resposta) => {
					console.log(resposta)
					sendMessage('1440266809365751', 'Notificações enviadas.')
				})
			}
	})
}

var GetUsuarios = (notificacoes, callback) => {
		User.findOne({ 'local.email': notificacoes.usuario }, (err, usuario) => {
			for (var j = 0; j < usuario.local.subscribers.length; j++) {
				let aux = JSON.stringify(usuario.local.subscribers[j])

				sendMessage(JSON.parse(aux).usuario_fb, notificacoes.mensagem)
				notificacoes.enviada = true

				notificacoes.save((err, data) => {
					if (err) console.error(err)

					console.log('Alterada')
				})
			}

			callback('Mensagens enviadas')
		})
}

var EnviarNotificacoes = (notificacoes, callback) => {
	let _notificacoes = notificacoes
	for (var i = 0; i < _notificacoes.length; i++) {
		GetUsuarios(_notificacoes[i], (retorno) => {
			console.log(retorno)

		})
	}
}

/*var EnviarNotificacoes = (notificacoes, callback) => {
	User.find({ 'notificacoes.messenger': true }, (err, usuarios) => {
		if (err) console.error(err)

		for (var i = 0; i < notificacoes.length; i++) {
			for (var j = 0; j < usuarios.length; j++) {
				sendMessage(usuarios[i].notificacoes.usuario_fb, notificacoes[i].mensagem)

				Notificacao.findById(notificacoes[i].id, (err, notificacao) => {
					if (err) return console.error(err)

					return notificacao
				})

			}
		}

		callback('Mensagens enviadas...')
	})
}*/


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