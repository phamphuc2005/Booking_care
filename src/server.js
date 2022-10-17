require('dotenv').config();
const express = require ('express');
const viewEngine = require ('./config/viewEngine');
const initWebRoutes = require ('./route/web');
const bodyParser = require ('body-parser');
const connectDB = require ('./config/connectDB');
// const cors = require ('cors');
// const initAPIRoutes = require ('./route/api');
// const cookieParser = require ('cookie-parser');

let app = express();
// app.use(cors({origin: true}));

// app.use(cookieParser('secret'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

viewEngine(app);

initWebRoutes(app);
// initAPIRoutes(app);

connectDB();

let port = process.env.PORT;
app.listen(port || 8000, () => console.log(`Doctor Appointment Booking System app is listening on port ${port}!`));