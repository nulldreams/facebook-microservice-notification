const express 	 	  = require('express')
const bodyParser 	  = require('body-parser')
const port		 	  = process.env.PORT || 3000
const app 		 	  = express()
const database        = require('./config/database');
const mongoose    	  = require('mongoose');

mongoose.connect(database.mongolab.url);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./routes')(app)

app.listen(port, (err) => {
	if (err) return console.error(err)

	console.log('Servidor on ' + port)	
})

