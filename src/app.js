import express from 'express';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import viewRouter from './routes/view.router.js';
import { Server } from 'socket.io';
import ProductManager from './managers/productManager.js';


const productRouter = require('./routes/product');
const cartsRouter = require('./routes/carts');

let products = [];

const app = express();

const httpServer = app.listen(8080, () => console.log("escuchando el puerto 8080"));
const socketServer = new Server(httpServer);



app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

//app.use(express.static(__dirname + '/public'));
app.use('/', viewRouter);

//rutas y cosas de pruebas


//Definir un arreglo para mensajes
const mensajes = [];

// Server Socket
socketServer.on('connection', socket => {
    console.log('Nuevo cliente conectado');

    // Emitir mensajes actuales al nuevo cliente
    socket.emit('actualizar-mensajes', mensajes);

    // Escuchar mensajes enviados por el cliente
    socket.on('message', texto => {
        const socketId = socket.id;
        const mensaje = { mensaje: texto, socketId: socketId };
        
        // mensaje al arreglo de mensajes
        mensajes.push(mensaje);

        // Emitir el mensaje a todos los clientes conectados
        socketServer.emit('actualizar-mensajes', mensajes);
    });
});

