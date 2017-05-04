const decisions   = require('./decisions/decisions')
const bot         = require('./app/facebook-bot.js')
const Notificacao = require('./app/models/notificacao')

const json_api = [{
    usuario: '1440266809365751',
    mensagem: 'A api funcionou.'
}]


module.exports = (app) => {

    require('./app/webhooks')(app)

    app.get('/teste', (req, res) => {
      let novaNotificacao = new Notificacao()

        novaNotificacao.usuario = '1440266809365751'
        novaNotificacao.mensagem = 'A api funcionou.'

        novaNotificacao.save((err, documento) => {
          if (err) console.error(err)

          res.json({ message: 'ok' })
        })
    })

  bot.VerificaFilaNotificacao()





}