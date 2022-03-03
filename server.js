const express = require('express');
const app = express();
const port = 8081;

var cors = require('cors');
app.use(cors());

var hbs = require('hbs');
app.set('view engine', 'html');
app.engine('html', hbs.__express);

app.use(express.static('public'));


const server = app.listen(port, function () {

	var host = server.address().address
	var port = server.address().port
	console.log("Server listening at http://%s:%s", host, port)
})


app.get('/3DPhoto', function (req, res) {
	res.render( 'index.html' );
})


