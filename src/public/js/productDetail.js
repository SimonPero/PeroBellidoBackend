// Función asincrónica para manejar el clic en el botón "Agregar al carrito"
async function handleAgregarButtonClick(liId) {
  try {
    // Obtener el botón del carrito
    const cartButton = document.querySelector(".cart");
    // Obtener el ID del carrito del atributo "data-cart-id" del botón
    const cartId = cartButton.getAttribute("data-cart-id");
    // Realizar una solicitud POST para agregar un producto al carrito
    const response = await fetch(`/api/carts/${cartId}/product/${liId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    // La solicitud se completa con éxito y se agrega el producto al carrito.
    // No se devuelve ninguna información específica.
  } catch (error) {
    // Manejar errores en caso de que la solicitud falle
  }
}
