// Esperar hasta que el documento HTML se haya cargado completamente
document.addEventListener("DOMContentLoaded", function () {
    // Obtener todos los botones con la clase "premium-button"
    const premiumButtons = document.querySelectorAll(".premium-button");

    // Agregar un event listener a cada botón "premium-button"
    premiumButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            // Obtener la dirección de correo electrónico del atributo "data-email" del botón
            const userEmail = button.getAttribute("data-email");
            try {
                // Realizar una solicitud PUT para actualizar el rol del usuario a "premium"
                const response = await fetch(`/api/users/premium/${userEmail}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
            } catch (error) {
                // Manejar errores en caso de que la solicitud falle
                console.error('Error al actualizar el rol del usuario a premium', error);
            }
        });
    });
});

// Función asincrónica para eliminar usuarios antiguos
async function DeleteOldUsers(cart) {
    try {
        // Realizar una solicitud DELETE para eliminar usuarios antiguos
        const response = await fetch('/api/users', {
            method: 'DELETE',
        });
    } catch (error) {
        // Manejar errores en caso de que la solicitud falle
    }
}
