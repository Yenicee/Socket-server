import express from 'express';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import viewRouter from './routes/view.router.js';
import { Server } from 'socket.io';


const app = express();

const httpServer = app.listen(8080, () => console.log("escuchando el puerto 8080"));
const socketServer = new Server(httpServer);

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use('/', viewRouter);

//Server Socket
socketServer.on('connection', socket => {
    console.log('Nuevo cliente conectado');

    socket.on('message', data=> {
        console.log(data);
    })
})


