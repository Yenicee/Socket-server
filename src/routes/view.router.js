import express from 'express';
import ProductManager from '../managers/productManager.js';

const router = express.Router();
const productManager = new ProductManager('product.json');

router.get('/', (req, res) => {
  try {
    const products = productManager.getProducts();
    res.render('home', { products });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error interno del servidor');
  }
});

router.get('/realTimesProducts', (req, res) => {
  try {
    const products = productManager.getProducts();
    res.render('realTimesProducts', { products });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error interno del servidor');
  }
});

export default router;