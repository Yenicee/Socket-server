import express from 'express';
import fs from 'fs';
import ProductManager from '../dao/managers/productManager.js';
//import { socketServer } from '../app.js';

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
productRouter.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort === 'desc' ? -1 : 1;
        const query = req.query.query || ''; 
        const category = req.query.category || ''; 
        const available = req.query.available || ''; 

        // Filtrar y ordenar los productos según los parámetros recibidos
        const filter = {};
        if (query) {
            filter.nombre = { $regex: query, $options: 'i' }; // Búsqueda por nombre (ignora mayúsculas/minúsculas)
        }
        if (category) {
            filter.categoria = category; // Filtrar por categoría
        }
        if (available) {
            filter.disponibilidad = available; // Filtrar por disponibilidad
        }

        const options = {
            limit,
            page,
            sort: { precio: 500 }, 
        };

        const products = await productManager.getProducts(filter, options);

        // Construir la respuesta con el formato requerido
        const response = {
            status: 'success',
            payload: products.docs, // Los documentos de la página actual
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?page=${products.prevPage}&limit=${limit}&sort=${req.query.sort}&query=${query}&category=${category}&available=${available}` : null,
            nextLink: products.hasNextPage ? `/api/products?page=${products.nextPage}&limit=${limit}&sort=${req.query.sort}&query=${query}&category=${category}&available=${available}` : null,
        };

        res.json(response);
    } catch (error) {
        console.error('Error al obtener los productos', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// Ruta GET /api/products/:id
productRouter.get('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const products = productManager.getProducts();
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
        const updatedProduct = productManager.updateProduct(parseInt(productId), newData);

        if (updatedProduct) {
            // Emitir evento 'updateProducts' al websocket
            const products = productManager.getProducts(); // Cargar productos actualizados
            socketServer.emit('updateProducts', products); // Emitir productos actualizados con el nuevo nombre 'updateProducts'
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
            // Emitir evento 'updateProducts' al websocket
            const products = productManager.getProducts(); // Cargar productos actualizados
            socketServer.emit('updateProducts', products); // Emitir productos actualizados con el nuevo nombre 'updateProducts'
            res.json({ message: 'Producto eliminado con éxito' });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

export default productRouter;