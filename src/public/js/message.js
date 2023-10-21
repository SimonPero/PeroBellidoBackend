// Crear una instancia de Socket.io para la comunicación en tiempo real
const socket = io();

// Obtener el nombre de usuario de un elemento HTML con la clase "user-name"
const user = document.querySelector(".user-name");
const UserName = user.getAttribute("data-name-id");
let correoDelUsuario = UserName;

// Agregar un evento para detectar cuando se presiona la tecla "Enter" en un cuadro de chat
const chatBox = document.getElementById('chat-box');
chatBox.addEventListener('keyup', ({ key }) => {
  if (key == 'Enter') {
    // Emitir un mensaje al servidor (parte "front to back") con el nombre de usuario y el mensaje
    socket.emit('msg_front_to_back', {
      user: correoDelUsuario,
      message: chatBox.value,
    });
    chatBox.value = ''; // Borrar el contenido del cuadro de chat después de enviar el mensaje
  }
});

// Configurar un evento para recibir mensajes del servidor (parte "back to front")
socket.on('msg_back_to_front', (msgs) => {
  let msgsFormateados = '';
  msgs.forEach((msg) => {
    // Formatear cada mensaje recibido y agregarlo a un div para mostrarlos en el cliente
    msgsFormateados += "<div style='border: 1px solid red;'>";
    msgsFormateados += '<p>' + msg.user + '</p>';
    msgsFormateados += '<p>' + msg.message + '</p>';
    msgsFormateados += '</div>';
  });
  // Obtener el elemento HTML donde se mostrarán los mensajes
  const divMsgs = document.getElementById('div-msgs');
  divMsgs.innerHTML = msgsFormateados; // Actualizar el contenido con los mensajes formateados
});