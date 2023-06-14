// Get all category and sort links
const categoryLinks = document.querySelectorAll(".category-link");
const sortLinks = document.querySelectorAll(".sort-link");

// Add event listeners to category links
categoryLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const category = link.getAttribute("data-category");
    if (category === "todos") {
      window.location.href = "http://localhost:8080/products";
    } else {
      updateURLParams({ category });
    }
  });
});
// Add event listeners to sort links
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

async function handleAgregarButtonClick(liId,) {
    try {
        const response = await fetch(`api/carts/89692/product/${liId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const data = await response.json();
        console.log(data);
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
  
async function handleVerCartClick(cartId) {
  try {
    window.location.href = `products/carts/${cartId} `
  } catch (error) {
    console.log(`Error al obtener detalles del producto (${cartId}):`, error.message);
  }
}