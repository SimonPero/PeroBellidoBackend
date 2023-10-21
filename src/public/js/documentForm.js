const submitButton = document.getElementById("submit-button"); // Obtiene el botón de envío del formulario
const user = document.querySelector(".user"); // Obtiene el elemento del usuario
const id = user.getAttribute("user-id"); // Obtiene el ID del usuario desde un atributo

submitButton.addEventListener("click", async (e) => { // Agrega un evento de clic al botón de envío
  e.preventDefault(); // Previene la acción predeterminada del formulario

  // Crea un nuevo objeto FormData para recopilar datos del formulario
  const formData = new FormData();

  // Obtiene los elementos de entrada de archivos del formulario
  const identificacionInput = document.getElementById("identificacion");
  const domicilioInput = document.getElementById("domicilio");
  const statusInput = document.getElementById("status");

  // Agrega los archivos seleccionados al objeto FormData
  formData.append("identificacion", identificacionInput.files[0]);
  formData.append("domicilio", domicilioInput.files[0]);
  formData.append("status", statusInput.files[0]);

  // Realiza una solicitud POST para cargar los documentos al servidor
  const response = await fetch(`/api/users/${id}/documents`, {
    method: 'POST', // Método de la solicitud
    body: formData, // Datos a enviar (los documentos)
  });

  // Aquí puedes agregar lógica adicional para manejar la respuesta del servidor en caso de éxito o error.
  // Por ejemplo, verificar el estado de la respuesta y mostrar mensajes al usuario.
});
