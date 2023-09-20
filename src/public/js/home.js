const socket = io();
socket.emit('message', "hola me estoy comunicando desde el mas alla");

socket.on ('actualizar-mensajes', (mensajes) => {
    const mensajesDiv = document.getElementById('mensajes');

    mensajesDiv.innerHTML = "";
    if(mensajes && mensajes.length > 0) {
        mensajes.forEach((mensajeObj) => {
            const mensaje = mensajeObj.mensaje;
            const socketId = mensajeObj.socketId;
            const pElement = document.createElement('p');

            pElement.textContent = `~${socketId}: ${mensaje}`;
            mensajesDiv.appendChild(pElement);
        });
    }
})