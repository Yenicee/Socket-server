import express from 'express';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import viewRouter from './routes/view.router.js';
import productRouter from './routes/product.js';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import productModel from './dao/models/products.model.js';

//Array de los productos 
let products = [];

//funcion para agregar el producto
function addProduct(io, title, description, price) {
  const product = { title, description, price };
  products.push(product);
  socketServer.emit('productos', products); // Emitir la lista de productos a todos los clientes
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const httpServer = app.listen(8080, () => console.log("escuchando el puerto 8080"));
export const socketServer = new Server(httpServer);


app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use('/', viewRouter);
//enrutador de productos
app.use('/api/products', productRouter);

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
  socketServer.on('addProduct', ({ title, description, price }) => {
    addProduct(socketServer, title, description, price);
  });

  // Manejar eventos personalizados, como eliminar productos
  socketServer.on('eliminarProducto', (productId) => {
    const productIndex = products.findIndex(product => product.id === productId);
    if (productIndex !== -1) {
      products.splice(productIndex, 1);
      // Emitir el evento 'updateProducts' con los productos actualizados
      socketServer.emit('updateProducts', products);
    }
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

//conexion a la base de BDD
const environment = async () => {
  try {
    await mongoose.connect('mongodb+srv://perezyenice:xVrnoKCVRND4yJTu@cluster47300ap.gehcely.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp');
    let products = await productModel.paginate({id:1})
    console.log(products);
  } catch (error) {
    console.log(error.message);
  }
};

environment();