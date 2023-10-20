
async function handleAgregarButtonClick(liId) {
  try {
    const cartButton = document.querySelector(".cart");
    const cartId = cartButton.getAttribute("data-cart-id");
    const response = await fetch(`/api/carts/${cartId}/product/${liId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      
    });
  } catch (error) { 
  }
}