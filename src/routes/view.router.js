import express from 'express';
//import ProductManager from '../managers/productManager';

const router = express.Router();

//const productManager = new ProductManager('product.json');

router.get('/', (req, res) => {
  res.render('home', {});
});

router.get('/realTimesProducts', (req, res) => {
  try {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Muestra de lista de productos en tiempo real</title>
      </head>
      <body>
      <h1>Lista de Productos en Tiempo Real</h1>
        <ul id="product-list">
          <li>
            <h2>Producto 1</h2>
            <p>Descripción del Producto 1</p>
            <p>Precio: $10.00</p>
            <p>Stock: 20</p>
            <img src="imagen1.jpg" alt="Producto 1">
          </li>
          <li>
            <h2>Producto 2</h2>
            <p>Descripción del Producto 2</p>
            <p>Precio: $15.00</p>
            <p>Stock: 15</p>
            <img src="imagen2.jpg" alt="Producto 2">
          </li>
          <!-- Puedes agregar más productos aquí -->
        </ul>
      
      </body>
       <script src="/socket.io/socket.io.js"></script>
       <script src="/js/home.js"></script>
      </html>
    `);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error interno del servidor');
  }
// router.get('/realTimesProducts', async (req, res) => {
//   try {
//     const products = await productManager.getProducts(); 
//     res.render('realTimesProducts', { products }); 
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).send('Error interno del servidor');
//   }
});

export default router;