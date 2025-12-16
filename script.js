document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    initializeEventListeners();
    
    function initializeEventListeners() {
        const subscribeButton = document.getElementById('subscribe-button');
        if (subscribeButton) {
            subscribeButton.addEventListener('click', handleNewsletterSubscription);
        }
        
        const addToCartButtons = document.querySelectorAll('.add-to-cart, button[data-product-name]');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', addToCart);
        });
        
        const viewCartButton = document.getElementById('view-cart');
        if (viewCartButton) {
            viewCartButton.addEventListener('click', displayCart);
        }
        
        const viewCartMainButton = document.getElementById('view-cart-main');
        if (viewCartMainButton) {
            viewCartMainButton.addEventListener('click', displayCart);
        }
        
        const clearCartButton = document.getElementById('clear-cart');
        if (clearCartButton) {
            clearCartButton.addEventListener('click', function() {
                const cart = getCart();
                if (cart.length === 0) {
                    showNotification('Cart is already empty', 'info');
                    return;
                }
                clearCart();
            });
        }
        
        const processOrderButton = document.getElementById('process-order');
        if (processOrderButton) {
            processOrderButton.addEventListener('click', function() {
                const cart = getCart();
                if (cart.length === 0) {
                    showNotification('Cart is empty. Add items before processing order.', 'warning');
                    return;
                }
                processOrder();
            });
        }
        
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', saveContactForm);
        }
        
        const orderForm = document.getElementById('order-form');
        if (orderForm) {
            orderForm.addEventListener('submit', saveCustomOrder);
        }
    }
    
    function addToCart(event) {
        event.preventDefault();
        
        const button = event.target;
        const productName = button.getAttribute('data-item-name') || 
                           button.getAttribute('data-product-name') || 
                           button.closest('article, tr')?.querySelector('h3, td:nth-child(2)')?.textContent || 
                           'Product';
        
        const productPrice = button.getAttribute('data-item-price') || 
                            button.getAttribute('data-product-price') || 
                            button.closest('article, tr')?.querySelector('strong, td:nth-child(4)')?.textContent || 
                            '$0.00';
        
        const productCategory = button.getAttribute('data-product-category') || 
                               button.closest('tr')?.querySelector('td:nth-child(3)')?.textContent || 
                               'General';
        
        const product = {
            id: Date.now(),
            name: productName.trim(),
            price: productPrice.trim(),
            category: productCategory.trim(),
            quantity: 1,
            addedAt: new Date().toISOString()
        };
        
        let cart = getCart();
        const existingProductIndex = cart.findIndex(item => item.name === product.name);
        
        if (existingProductIndex !== -1) {
            cart[existingProductIndex].quantity += 1;
        } else {
            cart.push(product);
        }
        
        sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
        
        updateCartCount();
        showNotification(`${product.name} added to cart!`, 'success');
        
        button.textContent = '✓ Added!';
        button.style.backgroundColor = '#8BC34A';
        setTimeout(() => {
            button.textContent = 'Add to Cart';
            button.style.backgroundColor = '';
        }, 2000);
    }
    
    function getCart() {
        try {
            const cartData = sessionStorage.getItem('shoppingCart');
            return cartData ? JSON.parse(cartData) : [];
        } catch (error) {
            console.error('Error reading cart from sessionStorage:', error);
            return [];
        }
    }
    
    function updateCartCount() {
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        const cartCountDisplay = document.getElementById('cart-count');
        if (cartCountDisplay) {
            cartCountDisplay.textContent = `Cart (${totalItems})`;
        }
        
        const cartLinks = document.querySelectorAll('a[href="#cart"]');
        cartLinks.forEach(link => {
            const span = link.querySelector('span');
            if (span) {
                span.textContent = `Cart (${totalItems})`;
            } else {
                link.textContent = `Cart (${totalItems})`;
            }
        });
    }
    
    function displayCart() {
        const cart = getCart();
        const modal = createCartModal(cart);
        document.body.appendChild(modal);
        
        document.getElementById('close-modal').addEventListener('click', closeModal);
        
        const clearCartBtn = document.getElementById('clear-cart-btn');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', clearCartFromModal);
        }
        
        const processOrderBtn = document.getElementById('process-order-btn');
        if (processOrderBtn) {
            processOrderBtn.addEventListener('click', processOrderFromModal);
        }
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    function createCartModal(cartItems) {
        const modal = document.createElement('div');
        modal.id = 'cart-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
        `;
        
        let cartHTML = '';
        let total = 0;
        
        if (cartItems.length === 0) {
            cartHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Your cart is empty</p>';
        } else {
            cartHTML = '<table style="width: 100%; border-collapse: collapse;">';
            cartHTML += '<thead><tr style="background-color: #2E7D32; color: white;">';
            cartHTML += '<th style="padding: 0.75rem; text-align: left;">Product</th>';
            cartHTML += '<th style="padding: 0.75rem; text-align: center;">Quantity</th>';
            cartHTML += '<th style="padding: 0.75rem; text-align: right;">Price</th>';
            cartHTML += '<th style="padding: 0.75rem; text-align: right;">Subtotal</th>';
            cartHTML += '</tr></thead><tbody>';
            
            cartItems.forEach(item => {
                const price = parseFloat(item.price.replace('$', ''));
                const subtotal = price * item.quantity;
                total += subtotal;
                
                cartHTML += `<tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 0.75rem;">${item.name}</td>
                    <td style="padding: 0.75rem; text-align: center;">${item.quantity}</td>
                    <td style="padding: 0.75rem; text-align: right;">${item.price}</td>
                    <td style="padding: 0.75rem; text-align: right; font-weight: bold;">$${subtotal.toFixed(2)}</td>
                </tr>`;
            });
            
            cartHTML += '</tbody></table>';
            cartHTML += `<div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 2px solid #2E7D32; text-align: right;">
                <h3 style="color: #2E7D32; margin: 0;">Total: $${total.toFixed(2)}</h3>
            </div>`;
        }
        
        modal.innerHTML = `
            <div style="background: white; border-radius: 8px; padding: 2rem; max-width: 800px; width: 90%; max-height: 80vh; overflow-y: auto; position: relative;">
                <button id="close-modal" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #666;">&times;</button>
                <h2 style="color: #2E7D32; margin-top: 0; margin-bottom: 1.5rem; font-family: 'Montserrat', sans-serif;">Shopping Cart</h2>
                ${cartHTML}
                ${cartItems.length > 0 ? `
                    <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                        <button id="clear-cart-btn" style="flex: 1; padding: 0.75rem 1.5rem; background-color: #795548; color: white; border: none; border-radius: 4px; cursor: pointer; font-family: 'Montserrat', sans-serif; font-weight: 600;">Clear Cart</button>
                        <button id="process-order-btn" style="flex: 2; padding: 0.75rem 1.5rem; background-color: #2E7D32; color: white; border: none; border-radius: 4px; cursor: pointer; font-family: 'Montserrat', sans-serif; font-weight: 600;">Process Order</button>
                    </div>
                ` : ''}
            </div>
        `;
        
        return modal;
    }
    
    function closeModal() {
        const modal = document.getElementById('cart-modal');
        if (modal) {
            modal.remove();
        }
    }
    
    function clearCart() {
        if (confirm('Are you sure you want to clear your cart?')) {
            sessionStorage.removeItem('shoppingCart');
            updateCartCount();
            showNotification('Cart cleared successfully', 'info');
        }
    }
    
    function clearCartFromModal() {
        if (confirm('Are you sure you want to clear your cart?')) {
            sessionStorage.removeItem('shoppingCart');
            updateCartCount();
            closeModal();
            showNotification('Cart cleared successfully', 'info');
        }
    }
    
    function processOrder() {
        const cart = getCart();
        const total = cart.reduce((sum, item) => {
            const price = parseFloat(item.price.replace('$', ''));
            return sum + (price * item.quantity);
        }, 0);
        
        showNotification(`Processing order for $${total.toFixed(2)}...`, 'info');
        
        setTimeout(() => {
            sessionStorage.removeItem('shoppingCart');
            updateCartCount();
            showNotification('Order processed successfully! Thank you for your purchase.', 'success');
        }, 1500);
    }
    
    function processOrderFromModal() {
        const cart = getCart();
        const total = cart.reduce((sum, item) => {
            const price = parseFloat(item.price.replace('$', ''));
            return sum + (price * item.quantity);
        }, 0);
        
        showNotification(`Processing order for $${total.toFixed(2)}...`, 'info');
        
        setTimeout(() => {
            sessionStorage.removeItem('shoppingCart');
            updateCartCount();
            closeModal();
            showNotification('Order processed successfully! Thank you for your purchase.', 'success');
        }, 1500);
    }
    
    function saveContactForm(event) {
        event.preventDefault();
        
        const form = event.target;
        const name = form.querySelector('#name');
        const email = form.querySelector('#email');
        const message = form.querySelector('#message');
        
        if (!name || name.value.trim() === '') {
            showNotification('Please enter your name', 'warning');
            return;
        }
        
        if (!email || email.value.trim() === '') {
            showNotification('Please enter your email address', 'warning');
            return;
        }
        
        if (!isValidEmail(email.value)) {
            showNotification('Please enter a valid email address', 'warning');
            return;
        }
        
        if (!message || message.value.trim() === '') {
            showNotification('Please enter your message', 'warning');
            return;
        }
        
        const formData = {
            name: name.value.trim(),
            email: email.value.trim(),
            message: message.value.trim(),
            submittedAt: new Date().toISOString(),
            type: 'contact'
        };
        
        try {
            let submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
            submissions.push(formData);
            localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
            localStorage.setItem('lastContactSubmission', JSON.stringify(formData));
            
            showNotification('Thank you for your message! We will contact you soon.', 'success');
            form.reset();
        } catch (error) {
            console.error('Error saving contact form:', error);
            showNotification('Error saving form. Please try again.', 'error');
        }
    }
    
    function saveCustomOrder(event) {
        event.preventDefault();
        
        const form = event.target;
        const orderId = `ORD-${Date.now()}`;
        
        const orderData = {
            orderId: orderId,
            name: form.querySelector('#order-name')?.value || '',
            email: form.querySelector('#order-email')?.value || '',
            phone: form.querySelector('#order-phone')?.value || '',
            consultationDate: form.querySelector('#consultation-date')?.value || '',
            serviceType: form.querySelector('#service-type')?.value || '',
            budget: form.querySelector('#budget-range')?.value || '',
            propertySize: form.querySelector('#property-size')?.value || '',
            projectDetails: form.querySelector('#project-details')?.value || '',
            submittedAt: new Date().toISOString(),
            type: 'custom-order',
            status: 'pending'
        };
        
        try {
            let orders = JSON.parse(localStorage.getItem('customOrders') || '[]');
            orders.push(orderData);
            localStorage.setItem('customOrders', JSON.stringify(orders));
            localStorage.setItem('lastCustomOrder', JSON.stringify(orderData));
            
            showNotification(`Order ${orderId} submitted successfully! We'll contact you within 24 hours.`, 'success');
            form.reset();
        } catch (error) {
            console.error('Error saving custom order:', error);
            showNotification('Error submitting order. Please try again.', 'error');
        }
    }
    
    function handleNewsletterSubscription(event) {
        event.preventDefault();
        
        const emailInput = document.querySelector('#subscribe-email, #newsletter-email');
        const email = emailInput?.value || '';
        
        if (!email || !isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'warning');
            return;
        }
        
        try {
            let subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
            
            if (subscribers.includes(email)) {
                showNotification('You are already subscribed!', 'info');
                return;
            }
            
            subscribers.push(email);
            localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
            
            showNotification('Successfully subscribed to our newsletter!', 'success');
            
            if (emailInput) {
                emailInput.value = '';
            }
        } catch (error) {
            console.error('Error subscribing to newsletter:', error);
            showNotification('Error subscribing. Please try again.', 'error');
        }
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 4px;
            color: white;
            font-family: 'Lato', Arial, sans-serif;
            font-weight: 600;
            z-index: 3000;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            animation: slideIn 0.3s ease;
            max-width: 400px;
        `;
        
        const colors = {
            success: '#2E7D32',
            error: '#D32F2F',
            warning: '#F57C00',
            info: '#1976D2'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    console.log('Bloom Valley Nursery - JavaScript initialized successfully');
    console.log('Shopping cart using sessionStorage');
    console.log('Forms using localStorage');
});
