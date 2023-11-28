import express from 'express';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
 import viewRouter from './routes/view.router.js';
import productRouter from './routes/product.js';
 import session from 'express-session';
 import MongoStore from 'connect-mongo';
 import mongoose from 'mongoose';
import cartsRouter from './routes/carts.route.js';

const app = express();

try {
  await mongoose.connect('mongodb+srv://perezyenice:xVrnoKCVRND4yJTu@cluster47300ap.gehcely.mongodb.net/loginBaseDato?retryWrites=true&w=majority&appName=AtlasApp')
  console.log('BD connected');
} catch (error) {
  console.log(error.message);
}

//MECANISMO DE ARCHIVOS DE SESIONES
app.use(session({
  store: MongoStore.create({
    client: mongoose.connection.getClient(),
    ttl: 30 //esto son segundos
  }),
  secret: 'login9944',
  resave: true,
  saveUninitialized: true,
}));

app.listen(8080, () => console.log("escuchando el puerto 8080"));

 app.engine('handlebars', handlebars.engine());
 app.set('views', __dirname + '/views');
 app.set('view engine', 'handlebars');
 app.use(express.static(`${__dirname}/public`));
 app.use('/', viewRouter);
 //enrutador de productos
 app.use('/api/products', productRouter);
app.use('/api/carts', cartsRouter);

