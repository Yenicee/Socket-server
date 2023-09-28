import express from 'express';
import fs from 'fs';
import { io } from '../app.js';
import ProductManager from '../dao/managers/productManager.js';

const productRouter = express.Router(); //instancia del enrutador de Express

// Agrega una instancia de ProductManager
const productManager = new ProductManager('src/product.json');

// Carga de productos desde el archivo
function loadProductsFromFile() {
    if (fs.existsSync('src/product.json')) {
      const data = fs.readFileSync('src/product.json', 'utf8');
      return JSON.parse(data);
    }
    return [];
  }
  

//Ruta para la vista de home.handlebars y realTimesProducts.handlebars
productRouter.get('/home', (req, res) => {
    const products = productManager.getProducts();
    res.render('home', { products });
});

productRouter.get('/realTimesProducts', (req, res) => {
    const products = productManager.getProducts();
    res.render('realTimesProducts', { products });
});

// Ruta raíz GET /api/products
productRouter.get('/', (req, res) => {
    const limit = parseInt(req.query.limit);
    const products = productManager.getProducts();
    if (!isNaN(limit) && limit > 0) {
        res.json(products.slice(0, limit));
    } else {
        res.json(products);
    }
});

// Ruta GET /api/products/:id
productRouter.get('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const products = loadProductsFromFile();
    const product = products.find(product => product.id === productId);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

// Ruta POST /api/products
productRouter.post('/', (req, res) => {
    const { title, description, price, code, stock, category } = req.body;
    // Agrego el campo thumbnail como un array vacío si no está definido.
    const thumbnail = req.body.thumbnail || [];
    // Añadir el campo status con el valor predeterminado true.
    const status = true;

    try {
        // Obtener el resultado de la función addProduct.
        const newProduct = productManager.addProduct(
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            category,
            status
        );
        // Verificar si la operación fue exitosa y devolver un 200 o 400 en consecuencia.
        if (newProduct) {
            res.status(200).json({ message: 'Producto creado con éxito' });
        } else {
            res.status(400).json({ error: 'Error al crear el producto' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el producto' });
    }
});

// Ruta PUT /api/products/:id
productRouter.put('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const newData = req.body;
    try {
        const updatedProduct = productManager.updateProduct(productId, newData);
        if (updatedProduct) {
            // Emitir evento de producto actualizado al websocket
            const products = loadProductsFromFile(); // Cargar productos actualizados
            io.emit('productos', products); // Emitir productos actualizados
            res.json({ message: 'Producto actualizado con éxito' });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

// Ruta DELETE /api/products/:id
productRouter.delete('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    try {
        if (productManager.deleteProduct(productId)) {
            // Emitir evento de producto eliminado al websocket
            const products = loadProductsFromFile(); // Cargar productos actualizados
            io.emit('productos', products); // Emitir productos actualizados
            res.json({ message: 'Producto eliminado con éxito' });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

export default productRouter;