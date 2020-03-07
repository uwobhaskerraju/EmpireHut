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
const CryptoJS = require('crypto-js')
const runMiddleware = require('run-middleware');



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
function encruptObject(body, entries, i) {
    console.log("inside encrypt object")
    for (var entry of body[entries[i]]) {
        var res = entry
       // console.log(res)
        var keys = Object.keys(res)
       // console.log(keys)
        for (let j = 0; j < keys.length; j++) {
            if (typeof (entry[j]) == "object") {
                if (entry[j].length > 0) {
                    encruptObject(entry, keys, j);
                }
                //we are ignoring if length is zero
            }
            // console.log(j)
            // console.log(keys[j])
            // console.log(res[keys[j]])//value
            //console.log(entry)
            if (typeof (res[keys[j]]) != "string") {
                res[keys[j]] = String(res[keys[j]])
            }
            res[keys[j]] = CryptoJS.AES.encrypt(res[keys[j]], process.env.key).toString()
        }
    }

}


function logResponse(obj) {
    try {
        console.log("inside logresponse")
        //console.log(obj)
        var body = JSON.parse(obj);
        const entries = Object.keys(body)
        //console.log(entries)
        for (let i = 0; i < entries.length; i++) {
            if (entries[i].toString().toLowerCase() != 'statuscode') {
                if (typeof (body[entries[i]]) == "object") {
                    //console.log(Object.keys(body[entries[i]]))

                    if (body[entries[i]].length > 0) {
                        encruptObject(body, entries, i);
                    }
                    //we are ignoring if length is zero
                    if (body[entries[i]].length == 0) {

                    }
                    if (body[entries[i]].length === undefined) {
                       // console.log(body[entries[i]])
                        var temp=[];
                        temp.push(body[entries[i]])
                        //encruptObject(body, entries, i)
                        body[entries[i]]=temp
                       // console.log(body[entries[i]].length)
                        encruptObject(body, entries, i)
                    }
                }
                else {
                    // console.log(Object.values(body)[i])
                    body[entries[i]] = CryptoJS.AES.encrypt(Object.values(body)[i], process.env.key).toString()
                }
            }
        }
        // console.log(JSON.stringify(body))
        return JSON.stringify(body);
    }
    catch (r) {
        console.log(r)
    }

}

app.use(function (req, res, next) {
    // console.log("INTERCEPT-REQUEST");
    const orig_send = res.send;
    res.send = function (arg) {
        var a = logResponse(arg);
        console.log(a)
        orig_send.call(res, a);
    };
    next();
});

function sanitizeRequest(req) {
    var body = req.body
    if (body != null || body != undefined) {
        const entries = Object.keys(body)
        const inserts = {}
        for (let i = 0; i < entries.length; i++) {
            req.body[entries[i]] = req.sanitize(CryptoJS.AES.decrypt(Object.values(body)[i], process.env.key).toString(CryptoJS.enc.Utf8))
            //req.body[entries[i]] = req.sanitize(Object.values(body)[i])
        }
    }

}

// define a default route
router.get('/', (req, res) => {
    //console.log('default works')
    res.json({ success: "true" })
});

// all our APIs will have default name '/api' in route
app.use('/api', router);

runMiddleware(app);
// import other routes from 'app' folder.
require('./app/routes/open.route.js')(router);
require('./app/routes/admin.route.js')(router);
require('./app/routes/user.route.js')(router);
// listen for requests

function showTime() {
    app.runMiddleware(
        "/api/admin/expire",
        function (code, data, headers) {
            //console.log(data); // it will be show 'this-is-the-cookie'
        }
    );
}

//setInterval(showTime, 1000 * 60 * 60 * 24); //1000 * 60 = 1min
setInterval(showTime, 1000 * 60 * 60);

https.createServer(options, app).listen(port, () => {
    console.log("Server is listening on port " + port);
});

// app.listen(port, () => {
//     console.log("Server is listening on port " + port);
// });
