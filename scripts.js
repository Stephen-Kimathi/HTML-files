document.addEventListener('DOMContentLoaded', function () {
    const subscribeButton = document.getElementById('subscribe-button');
    if (subscribeButton) {
        subscribeButton.addEventListener('click', function () {
            alert('Thank you for subscribing.');
        });
    }

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const clearCartButton = document.getElementById('clear-cart');
    const processOrderButton = document.getElementById('process-order');
    let cartItems = 0;
    const cartCountDisplay = document.getElementById('cart-count');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            cartItems++;
            cartCountDisplay.textContent = `Cart (${cartItems})`;
            alert('Item added to the cart');
        });
    });

    if (clearCartButton) {
        clearCartButton.addEventListener('click', function () {
            if (cartItems > 0) {
                cartItems = 0;
                cartCountDisplay.textContent = `Cart (0)`;
                alert('Cart cleared');
            } else {
                alert('No items to clear.');
            }
        });
    }

    if (processOrderButton) {
        processOrderButton.addEventListener('click', function () {
            if (cartItems > 0) {
                alert('Thank you for your order');
            } else {
                alert('Cart is empty.');
            }
        });
    }

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();
            alert('Thank you for your message');
            contactForm.reset();
        });
    }
});
