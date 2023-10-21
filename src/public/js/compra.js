async function eliminarProducto(liId) {
        try {
            // Obtiene el botón de carrito y el ID del carrito
            const cartButton = document.querySelector(".cart");
            const cartId = cartButton.getAttribute("data-cart-id");
            
            // Realiza una solicitud DELETE para eliminar el producto del carrito
            const response = await fetch(`/api/carts/${cartId}/product/${liId}`, {
                method: 'DELETE', // Método de la solicitud
                headers: {
                    'Content-Type': 'application/json' // Encabezados de la solicitud
                },
            });
        } catch (error) {
            // Manejo de errores: Si ocurre algún error durante la eliminación, no se maneja explícitamente en esta función, 
            // por lo que cualquier error simplemente se captura, pero no se realiza ninguna acción adicional..
        }
    }
    