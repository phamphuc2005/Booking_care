require('dotenv').config();
const express = require ('express');
const viewEngine = require ('./config/viewEngine');
const initWebRoutes = require ('./route/web');
const bodyParser = require ('body-parser');
const connectDB = require ('./config/connectDB');
// const initAPIRoutes = require ('./route/api');
// const cookieParser = require ('cookie-parser');

let app = express();

// app.use(cookieParser('secret'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

viewEngine(app);

initWebRoutes(app);
// initAPIRoutes(app);

connectDB();

let port = process.env.PORT;
app.listen(port || 8000, () => console.log(`Doctor Appointment Booking System app is listening on port ${port}!`));