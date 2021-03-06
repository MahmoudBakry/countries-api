
import express from "express";
import http from 'http';
import path from "path";
import bodyparser from "body-parser";
import cors from "cors";
import expressValidator from "express-validator";
import helmet from "helmet";
import mongoose from "mongoose";
import swaggerSpec from "./services/swagger";
import config from "./config";
import router from "./routes";
import EventHandler from './handlers/index'
import SocketIO from 'socket.io'
import autoIncrement from 'mongoose-auto-increment';

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUrl);
// mongoose.set('debug', true);


mongoose.connection.on('connected', () => {
    console.log('\x1b[32m%s\x1b[0m', '[DB] Connected...');
});
mongoose.connection.on('error', err => console.log('\x1b[31m%s\x1b[0m', '[DB] Error : ' + err));
mongoose.connection.on('disconnected', () => console.log('\x1b[31m%s\x1b[0m', '[DB] DisConnected...'));


const app = express();
const server = http.Server(app);
const io = new SocketIO(server);
new EventHandler(io);
app.set('io', io);

app.use(cors());
app.use(helmet());

app.use((req, res, next) => {
    config.apiAppUrl = req.protocol + '://' + req.get('host');
    next();
})


app.get('/swagger.json', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});


app.use('/docs', express.static(path.join(__dirname, 'docs')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Ensure Content Type
app.use('/', (req, res, next) => {
    let contype = req.headers['content-type'];
    if (contype && !((contype.includes('application/json') || contype.includes('multipart/form-data'))))
        return res.status(415).send({ error: "Unsupported Media Type (" + contype + ")" });
    next();
});

app.use(bodyparser.json({ limit: '50mb' }));
app.use(bodyparser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

app.use(expressValidator());
//Routes
app.use('/api/v1', router);


//Not Found Handler
app.use((req, res, next) => {
    const error = new Error("Not Found..!");
    error.status = 404
    next(error);
});


//ERROR Handler
app.use((err, req, res, next) => {
    // if (err instanceof mongoose.CastError) {
    // err.status = 404;
    // err.message = `${err.model.modelName} Not Found`;
    // }

    const status = err.status ? err.status : 500;
    res.status(status).json({
        success: false,
        error: err.message
    });
    console.log(err);
});



export default server;

