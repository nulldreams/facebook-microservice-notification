const bot      = require('./facebook-bot.js')

module.exports = (app) => {
    /* For Facebook Validation */
    app.get('/webhook', (req, res) => {
        if (req.query['hub.mode'] && req.query['hub.verify_token'] === 'tuxedo_cat') {
            res.status(200).send(req.query['hub.challenge']);
        } else {
            res.status(403).end();
        }
    });

    /* Handling all messenges */
    app.post('/webhook', (req, res) => {
        console.log(req.body);
        if (req.body.object === 'page') {
            req.body.entry.forEach((entry) => {
                entry.messaging.forEach((event) => {
                    if (event.message && event.message.text) {
                        bot.LerMensagem(event)
                        //sendMessage(event);
                    }
                });
            });
            res.status(200).end();
        }
    });
}

