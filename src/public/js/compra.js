async function realizarCompra(cartId) {
        window.location.href = (`/products/carts/${cartId}/purchase`)
}
async function eliminarProducto(liId) {
        try {
                const cartButton = document.querySelector(".cart");
                const cartId = cartButton.getAttribute("data-cart-id");
                const response = await fetch(`/api/carts/${cartId}/product/${liId}`, {
                        method: 'DELETE',
                        headers: {
                                'Content-Type': 'application/json'
                        },

                });
        } catch (error) {
        }
}