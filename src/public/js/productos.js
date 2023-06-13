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
  