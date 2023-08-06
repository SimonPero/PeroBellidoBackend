async function realizarCompra(cartId) {
    try {
        window.location.href = (`/products/carts/${cartId}/purchase`)
        // Aquí puedes manejar la respuesta del servidor si es necesario.
    } catch (error) {
        console.log(error);
    }
}