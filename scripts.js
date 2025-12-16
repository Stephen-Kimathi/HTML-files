document.addEventListener('DOMContentLoaded', function () {
    
    const subscribeButton = document.getElementById('subscribe-button');
    const subscribeEmail = document.getElementById('subscribe-email');
    
    if (subscribeButton) {
        subscribeButton.addEventListener('click', function (event) {
            event.preventDefault();
            
            if (!subscribeEmail || subscribeEmail.value.trim() === '') {
                alert('Please enter your email address');
                return;
            }
            
            if (!subscribeEmail.value.includes('@')) {
                alert('Please enter a valid email address');
                return;
            }
            
            alert('Thank you for subscribing.');
            subscribeEmail.value = '';
        });
    }
    
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const clearCartButton = document.getElementById('clear-cart');
    const processOrderButton = document.getElementById('process-order');
    const viewCartButton = document.getElementById('view-cart');
    const cartModal = document.getElementById('cart-modal');
    const closeCartButton = document.getElementById('close-cart');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartCountDisplay = document.getElementById('cart-count');
    
    let cart = [];
    
    function updateCartCount() {
        if (cartCountDisplay) {
            cartCountDisplay.textContent = cart.length;
        }
    }
    
    function updateCartDisplay() {
        if (cartItemsList) {
            cartItemsList.innerHTML = '';
            
            if (cart.length === 0) {
                cartItemsList.innerHTML = '<p>Your cart is empty</p>';
            } else {
                cart.forEach((item, index) => {
                    const itemElement = document.createElement('div');
                    itemElement.className = 'cart-item';
                    itemElement.innerHTML = `
                        <p>${index + 1}. ${item.name} - $${item.price}</p>
                    `;
                    cartItemsList.appendChild(itemElement);
                });
                
                const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
                const totalElement = document.createElement('div');
                totalElement.className = 'cart-total';
                totalElement.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
                cartItemsList.appendChild(totalElement);
            }
        }
    }
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const itemName = this.getAttribute('data-item-name') || 'Product';
            const itemPrice = this.getAttribute('data-item-price') || '0.00';
            
            cart.push({
                name: itemName,
                price: itemPrice
            });
            
            updateCartCount();
            alert('Item added to the cart');
        });
    });
    
    if (viewCartButton && cartModal) {
        viewCartButton.addEventListener('click', function () {
            updateCartDisplay();
            cartModal.style.display = 'block';
        });
    }
    
    if (closeCartButton && cartModal) {
        closeCartButton.addEventListener('click', function () {
            cartModal.style.display = 'none';
        });
        
        window.addEventListener('click', function (event) {
            if (event.target === cartModal) {
                cartModal.style.display = 'none';
            }
        });
    }
    
    if (clearCartButton) {
        clearCartButton.addEventListener('click', function () {
            if (cart.length > 0) {
                cart = [];
                updateCartCount();
                updateCartDisplay();
                alert('Cart cleared');
            } else {
                alert('No items to clear.');
            }
        });
    }
    
    if (processOrderButton) {
        processOrderButton.addEventListener('click', function () {
            if (cart.length > 0) {
                alert('Thank you for your order');
                cart = [];
                updateCartCount();
                updateCartDisplay();
            } else {
                alert('Cart is empty.');
            }
        });
    }
    
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();
            
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            
            if (!name || name.value.trim() === '') {
                alert('Please enter your name');
                return;
            }
            
            if (!email || email.value.trim() === '') {
                alert('Please enter your email address');
                return;
            }
            
            if (!email.value.includes('@')) {
                alert('Please enter a valid email address');
                return;
            }
            
            if (!message || message.value.trim() === '') {
                alert('Please enter your message');
                return;
            }
            
            alert('Thank you for your message');
            contactForm.reset();
        });
    }
    
    updateCartCount();
    console.log('JavaScript loaded successfully');
});
