const socket = io();
socket.emit('message', "hola me estoy comunicando desde el mas alla");

socket.on('products', function(products) {
    // Actualizar la lista de productos en tiempo real
    let productList = document.getElementById('product-list');
    productList.innerHTML = '';

    products.forEach(function(product) {
      let listItem = document.createElement('li');
      listItem.innerHTML = `
        <h2>${product.title}</h2>
        <p>${product.description}</p>
        <p>Precio: $${product.price}</p>
        <p>Stock: ${product.stock}</p>
        <img src="${product.thumbnail}" alt="${product.title}">
      `;
      productList.appendChild(listItem);
    });
  });