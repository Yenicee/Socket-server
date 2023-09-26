import express from 'express';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import viewRouter from './routes/view.router.js';
import { Server } from 'socket.io';


//Array de los productos 
let products = [];

//funcion para agregar el producto
function addProduct(title, description, price) {
    const product = { title, description, price };
    products.push(product);
    io.emit('productos', products); // Emitir la lista de productos a todos los clientes
  }

const app = express();

const httpServer = app.listen(8080, () => console.log("escuchando el puerto 8080"));
const socketServer = new Server(httpServer);


app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use('/', viewRouter);

//Definir un arreglo para mensajes
const mensajes = [];

// Server Socket
socketServer.on('connection', socket => {
    console.log('Nuevo cliente conectado');

    // Emitir mensajes actuales al nuevo cliente
    socket.emit('actualizar-mensajes', mensajes);

    //Emitir productos al cliente
    socket.emit('productos', products);

    // Manejar eventos personalizados, como agregar productos
  socket.on('addProduct', ({ title, description, price }) => {
    addProduct(title, description, price);
  });

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

