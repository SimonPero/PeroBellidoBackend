//FRONT
const socket = io();
const user = document.querySelector(".user-name");
const UserName = user.getAttribute("data-name-id");
let correoDelUsuario = UserName;


//FRONT EMITE

const chatBox = document.getElementById('chat-box');

chatBox.addEventListener('keyup', ({ key }) => {
  if (key == 'Enter') {
    socket.emit('msg_front_to_back', {
      user: correoDelUsuario,
      message: chatBox.value,
    });
    chatBox.value = '';
  }
});

//FRONT RECIBE
socket.on('msg_back_to_front', (msgs) => {
  let msgsFormateados = '';
  msgs.forEach((msg) => {
    msgsFormateados += "<div style='border: 1px solid red;'>";
    msgsFormateados += '<p>' + msg.user + '</p>';
    msgsFormateados += '<p>' + msg.message + '</p>';
    msgsFormateados += '</div>';
  });
  const divMsgs = document.getElementById('div-msgs');
  divMsgs.innerHTML = msgsFormateados;
});
