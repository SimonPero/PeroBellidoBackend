document.addEventListener("DOMContentLoaded", function () {
    const premiumButtons = document.querySelectorAll(".premium-button");

    premiumButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            const userEmail = button.getAttribute("data-email");
            try {
                const response = await fetch(`/api/users/premium/${userEmail}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
            } catch (error) {
                console.error('Error updating user role to premium', error);
            }
        });
    });
});

async function DeleteOldUsers(cart) {
    const responde = await fetch('/api/users', {
        method: 'DELETE',
    })
}