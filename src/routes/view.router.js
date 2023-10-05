import express from 'express';
import ProductManager from '../dao/managers/productManager.js';
import messagesModel from '../dao/models/messages.model.js';

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


// Ruta para cargar los mensajes y renderizar la vista chat.handlebars
router.get('/chat', async (req, res) => {
  try {
    // Obtener los mensajes de MongoDB
    const messages = await messagesModel.find().maxTimeMS(20000); 

    res.render('chat', { messages });
  } catch (error) {
    console.error('Error al cargar los mensajes', error);
    res.status(500).json({ error: 'Error al cargar los mensajes' });
  }

});



export default router;