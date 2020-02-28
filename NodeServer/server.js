//https://hackernoon.com/set-up-ssl-in-nodejs-and-express-using-openssl-f2529eab5bb
//https://nodejs.org/en/knowledge/HTTP/servers/how-to-create-a-HTTPS-server/
//https://medium.com/@rubenvermeulen/running-angular-cli-over-https-with-a-trusted-certificate-4a0d5f92747a
//https://www.freecodecamp.org/news/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec/

//import libraries
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')
const expressSanitizer = require('express-sanitizer');




const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt')
};
// create express app
const app = express();

app.use(cors())
app.use(expressSanitizer());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// Configuring the database

const mongoose = require('mongoose');

var port = process.env.port
//console.log(process.env.mongoURL)
// Connecting to the database
mongoose.connect(process.env.mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Ending the Process', err);
    process.exit();
});


// create the router object
var router = express.Router();

// middleware to use for all requests
router.use(function (req, res, next) {
    // do logging
    console.log("This route was requested: " + req.url);
    sanitizeRequest(req); 
    next()// make sure we go to the next routes and don't stop here
});



function sanitizeRequest(req) {
    var body = req.body
    const entries = Object.keys(body)
    const inserts = {}
    for (let i = 0; i < entries.length; i++) {
        req.body[entries[i]] = req.sanitize(Object.values(body)[i])
    }
}

// define a default route
router.get('/', (req, res) => {
    //console.log('default works')
    res.send({ success: "true" })
});

// all our APIs will have default name '/api' in route
app.use('/api', router);

// import other routes from 'app' folder.
require('./app/routes/open.route.js')(router);
require('./app/routes/admin.route.js')(router);
require('./app/routes/user.route.js')(router);
// listen for requests


https.createServer(options,app).listen(port, () => {
    console.log("Server is listening on port " + port);
});

// app.listen(port, () => {
//     console.log("Server is listening on port " + port);
// });