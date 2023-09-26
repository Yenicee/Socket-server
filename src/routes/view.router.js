import express from 'express';
import ProductManager from '../managers/productManager.js';

const router = express.Router();

const productManager = new ProductManager('product.json');

router.get('/', (req, res) => {
  res.render('home', {});
});

router.get('/realTimesProducts', (req, res) => {
  try {
    const products = productManager.getProducts(); // Obtener la lista de todos los productos
    // Renderizar la vista de realTimesProducts con los datos de los productos
    res.render('realTimesProducts', { products });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error interno del servidor');
  }
});

export default router;