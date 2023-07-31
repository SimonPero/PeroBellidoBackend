// Get all category and sort links
const categoryLinks = document.querySelectorAll(".category-link");
const sortLinks = document.querySelectorAll(".sort-link");

// Add event listeners to category links
categoryLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const category = link.getAttribute("data-category");
      updateURLParams({ category });
  });
});
// Add event listeners to sort linkss
sortLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const sort = link.getAttribute("data-sort");
    updateURLParams({ sort });
  });
});

// Function to update URL parameters and navigate to the new URL
function updateURLParams(params) {
  const url = new URL(window.location.href);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  window.location.href = url.toString();
}
var cartId = '{{cart}}'
async function handleAgregarButtonClick(liId) {
  try {
    
    const cartButton = document.querySelector(".btn-cart");
    const cartId = cartButton.getAttribute("data-cart-id");
    const response = await fetch(`api/carts/${cartId}/product/${liId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    const data = await response.json();
  } catch (error) {
    console.log(error);
  }
}



async function handleVerDetallesClick(productId) {
    try {
      window.location.href = `/products/${productId}`;
    } catch (error) {
      console.log(`Error al obtener detalles del producto (${productId}):`, error.message);
    }
  }
  
async function handleVerCartClick(cart) {
  try {
    window.location.href = `products/carts/${cart} `
  } catch (error) {
    console.log(`Error al obtener detalles del producto (${cart}):`, error.message);
  }
}