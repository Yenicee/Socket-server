//import {socketServer} from '../../app.js';
//const socket = io();

// socket.on ('actualizar-mensajes', (mensajes) => {
//     const mensajesDiv = document.getElementById('mensajes'); //mensajes

//     mensajesDiv.innerHTML = "";
//     if(mensajes && mensajes.length > 0) {
//         mensajes.forEach((mensajeObj) => {
//             const mensaje = mensajeObj.mensaje;
//             const socketId = mensajeObj.socketId;
//             const pElement = document.createElement('p');

//             pElement.textContent = `~${socketId}: ${mensaje}`;
//             mensajesDiv.appendChild(pElement);
//         });
//     }
// });
const form = document.getElementById('loginForm');

form.addEventListener('submit', e => {
    e.preventDefault();

    const data = new FormData(form);

    const obj = {};

    data.forEach((value, key) => obj[key] = value);

  
    fetch('/api/login', {

        method: 'POST',

        body: JSON.stringify(obj),

        headers: {

            'Content-Type': 'application/json'

        }

    }).then(result => {

        if (result.status === 200) {

            window.location.replace('/');

        }

    })

})

