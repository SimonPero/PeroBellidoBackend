// Get all category and sort links
const categoryLinks = document.querySelectorAll(".category-link");
const sortLinks = document.querySelectorAll(".sort-link");

// Agregar escuchadores de eventos a los enlaces de categoría
categoryLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    // Obtener la categoría del atributo "data-category" del enlace
    const category = link.getAttribute("data-category");
    // Llamar a la función para actualizar los parámetros de la URL
    updateURLParams({ category });
  });
});
// Agregar escuchadores de eventos a los enlaces de clasificación
sortLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    // Obtener la clasificación del atributo "data-sort" del enlace
    const sort = link.getAttribute("data-sort");
    // Llamar a la función para actualizar los parámetros de la URL
    updateURLParams({ sort });
  });
});

// Función para actualizar los parámetros de la URL y navegar a la nueva URL
function updateURLParams(params) {
  // Crear una instancia de URL a partir de la URL actual
  const url = new URL(window.location.href);
  // Actualizar los parámetros de la URL con los valores proporcionados en el objeto "params"
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  // Redirigir a la nueva URL
  window.location.href = url.toString();
}

// Función asincrónica para manejar el clic en el botón "Agregar al carrito"
async function handleAgregarButtonClick(liId) {
  try {
    // Obtener el botón del carrito y el ID del carrito
    const cartButton = document.querySelector(".btn-cart");
    const cartId = cartButton.getAttribute("data-cart-id");
    // Realizar una solicitud POST para agregar el producto al carrito
    const response = await fetch(`api/carts/${cartId}/product/${liId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    // Analizar la respuesta JSON
    const data = await response.json();
  } catch (error) {
    // Manejar errores en caso de que la solicitud falle
  }
}

// Función asincrónica para manejar el clic en "Ver detalles" de un producto
async function handleVerDetallesClick(productId) {
  // Redirigir a la página de detalles del producto con el ID proporcionado
  window.location.href = `/products/${productId}`;
}

// Función asincrónica para manejar el clic en "Ver carrito" de un usuario
async function handleVerCartClick(cart) {
  // Redirigir a la página del carrito del usuario
  window.location.href = `products/carts/${cart} `;
}
