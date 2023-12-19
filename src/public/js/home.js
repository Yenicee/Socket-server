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
const register = document.getElementById('registerForm');

register.addEventListener('submit', async (event) => {
    event.preventDefault(); 
    
    // Aquí puedes realizar cualquier lógica adicional antes de enviar el formulario, si es necesario
    
    const formData = new FormData(register); 
    
    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Object.fromEntries(formData)),
        });

        const result = await response.json();

        if (result.status === 'success') {
            alert(result.message);
          
        } else {
            alert(result.message);
        }

    } catch (error) {
        console.error('Error al enviar el formulario:', error);
      
    }
});

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

