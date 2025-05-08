function createCart() {
    // Create a more modern cart HTML structure with better styling
    const cartHTML = `
        <section id="cart-section" class="cart-section">
            <div class="cart-overlay"></div>
            <div class="cart-container">
                <div class="cart-header">
                    <h2>Your Cart</h2>
                    <button id="close-cart" class="close-cart">×</button>
                </div>
                <div class="cart-content">
                    <div id="cart-items" class="cart-items"></div>
                    <div id="cart-empty" class="cart-empty">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="8" cy="21" r="1"></circle>
                            <circle cx="19" cy="21" r="1"></circle>
                            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                        </svg>
                        <p>Your cart is empty</p>
                        <button id="start-shopping" class="start-shopping-btn">Start Shopping</button>
                    </div>
                </div>
                <div class="cart-footer">
                    <div class="total-price">
                        <span>Total</span>
                        <strong>$<span id="cart-total">0.00</span></strong>
                    </div>
                    <button id="checkout-btn" class="checkout-btn">
                        <span>Checkout</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7"></path>
                        </svg>
                    </button>
                    <button id="clear-cart-btn" class="clear-cart-btn">Clear Cart</button>
                </div>
            </div>
        </section>
    `;

    // Add CSS styles for the modern cart
    const cartStyles = `
       
    `;

    // Add the styles to the document
    const styleElement = document.createElement('style');
    styleElement.textContent = cartStyles;
    document.head.appendChild(styleElement);

    // Add the cart HTML to the document
    document.body.insertAdjacentHTML("beforeend", cartHTML);

    // Load cart data from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Function to update the cart display
    function updateCartDisplay() {
        const cartItemsDiv = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const cartEmptyDiv = document.getElementById('cart-empty');

        cartItemsDiv.innerHTML = ""; // Clear existing items

        let total = 0;

        // Show/hide empty cart message
        if (cart.length === 0) {
            cartEmptyDiv.style.display = 'flex';
            cartItemsDiv.style.display = 'none';
        } else {
            cartEmptyDiv.style.display = 'none';
            cartItemsDiv.style.display = 'block'; // Changed from flex to block

            cart.forEach((item, index) => {
                total += item.price * item.quantity;

                const itemDiv = document.createElement('div');
                itemDiv.classList.add('cart-item');
                itemDiv.dataset.index = index;

                // Use a placeholder image if the item doesn't have one
                const imageSrc = item.image || '/placeholder.svg?height=70&width=70';

                // For mobile, we'll adjust the layout
                const isMobile = window.innerWidth <= 480;

                if (isMobile) {
                    itemDiv.innerHTML = `
                        <img src="${imageSrc}" alt="${item.name}" class="cart-item-image" />
                        <div class="cart-item-details">
                            <h3 class="cart-item-name">${item.name}</h3>
                            <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                            <div class="cart-item-controls">
                                <button class="quantity-btn decrease-quantity" data-index="${index}">-</button>
                                <span class="cart-item-quantity">${item.quantity}</span>
                                <button class="quantity-btn increase-quantity" data-index="${index}">+</button>
                                <button class="remove-item" data-index="${index}">Remove</button>
                            </div>
                        </div>
                        <div class="cart-item-total">
                            $${(item.price * item.quantity).toFixed(2)}
                        </div>
                    `;
                } else {
                    itemDiv.innerHTML = `
                        <img src="${imageSrc}" alt="${item.name}" class="cart-item-image" />
                        <div class="cart-item-details">
                            <h3 class="cart-item-name">${item.name}</h3>
                            <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                            <div class="cart-item-controls">
                                <button class="quantity-btn decrease-quantity" data-index="${index}">-</button>
                                <span class="cart-item-quantity">${item.quantity}</span>
                                <button class="quantity-btn increase-quantity" data-index="${index}">+</button>
                                <button class="remove-item" data-index="${index}">Remove</button>
                            </div>
                        </div>
                        <div class="cart-item-total">
                            $${(item.price * item.quantity).toFixed(2)}
                        </div>
                    `;
                }

                // Add with animation
                itemDiv.style.opacity = '0';
                itemDiv.style.transform = 'translateY(10px)';
                cartItemsDiv.appendChild(itemDiv);

                // Trigger animation
                setTimeout(() => {
                    itemDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    itemDiv.style.opacity = '1';
                    itemDiv.style.transform = 'translateY(0)';
                }, 50 * index); // Stagger the animations
            });
        }

        if (cartTotal) {
            // Animate the total if it changes
            const currentTotal = parseFloat(cartTotal.textContent);
            if (currentTotal !== total) {
                cartTotal.style.transition = 'color 0.3s ease';
                cartTotal.style.color = '#4a6cf7';
                cartTotal.textContent = total.toFixed(2);

                setTimeout(() => {
                    cartTotal.style.color = '';
                }, 500);
            } else {
                cartTotal.textContent = total.toFixed(2);
            }
        }
    }

    // Function to update the cart count in the icon
    window.updateCartCount = function () {
        const cartCount = document.getElementById('cart-count');
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cartCount) {
            const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalQuantity;

            // Add a little animation to the cart count when updated
            cartCount.classList.add('cart-count-update');
            setTimeout(() => {
                cartCount.classList.remove('cart-count-update');
            }, 300);
        }
    }
    // Add an item to the cart
    window.addToCart = function (itemName, itemPrice, itemImage) {
        let itemIndex = cart.findIndex(item => item.name === itemName);

        if (itemIndex === -1) {
            cart.push({
                name: itemName,
                price: itemPrice,
                image: itemImage,
                quantity: 1
            });

            // Show a toast notification
            showToast(`${itemName} added to cart`);
        } else {
            cart[itemIndex].quantity += 1;
            showToast(`${itemName} quantity updated`);
        }

        // These are already called in addToCart, no need to call them again.
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        updateCartCount();
    }

    // Add a small delay
    // setTimeout(() => {
    //     updateCartDisplay();
    //     updateCartCount(); // This should update the count!
    // }, 0);

    // Add a custom pizza to the cart
    window.addCustomPizzaToCart = function (basePrice) {
        const crustSelect = document.getElementById('crust');
        const toppingsSelect = document.getElementById('toppings');

        const selectedCrust = crustSelect.options[crustSelect.selectedIndex].text;
        const selectedToppings = Array.from(toppingsSelect.selectedOptions)
            .map(option => option.text);

        const itemName = `Custom Pizza (${selectedCrust}, ${selectedToppings.join(', ')})`;

        // Remove any existing custom pizza and add new one
        let itemIndex = cart.findIndex(item => item.name.startsWith("Custom Pizza"));
        if (itemIndex !== -1) {
            cart.splice(itemIndex, 1);
        }

        cart.push({
            name: itemName,
            price: basePrice,
            quantity: 1
        });

        showToast('Custom pizza added to cart');
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        updateCartCount();
    }

    // Function to show toast notification
    function showToast(message) {
        // Check if a toast container already exists
        let toastContainer = document.querySelector('.toast-container');

        // If not, create one
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);

            // Add styles for the toast
            const toastStyles = `
             
            `;

            const style = document.createElement('style');
            style.textContent = toastStyles;
            document.head.appendChild(style);
        }

        // Create the toast
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;

        // Add to container
        toastContainer.appendChild(toast);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('hide');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // Handle window resize for responsive layout
    window.addEventListener('resize', function () {
        updateCartDisplay();
    });

    // Event delegation for cart item controls
    document.addEventListener('click', function (e) {
        // Increase quantity
        if (e.target.classList.contains('increase-quantity')) {
            const index = parseInt(e.target.dataset.index);
            cart[index].quantity += 1;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
            updateCartCount();
        }

        // Decrease quantity
        if (e.target.classList.contains('decrease-quantity')) {
            const index = parseInt(e.target.dataset.index);
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            } else {
                // Remove item if quantity would be 0
                cart.splice(index, 1);
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
            updateCartCount();
        }

        // Remove item
        if (e.target.classList.contains('remove-item')) {
            const index = parseInt(e.target.dataset.index);
            const itemDiv = e.target.closest('.cart-item');

            // Animate removal
            itemDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            itemDiv.style.opacity = '0';
            itemDiv.style.transform = 'translateY(10px)';

            setTimeout(() => {
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartDisplay();
                updateCartCount();
            }, 300);
        }

        // Close cart button
        if (e.target.id === 'close-cart') {
            const cartSection = document.getElementById('cart-section');
            cartSection.classList.remove('active');
        }

        // Cart overlay click to close
        if (e.target.classList.contains('cart-overlay')) {
            const cartSection = document.getElementById('cart-section');
            cartSection.classList.remove('active');
        }

        // Start shopping button
        if (e.target.id === 'start-shopping') {
            const cartSection = document.getElementById('cart-section');
            cartSection.classList.remove('active');
        }

        // Checkout button
        if (e.target.id === 'checkout-btn' || e.target.closest('#checkout-btn')) {
            if (cart.length > 0) {
                alert('Proceeding to checkout...');
                // Here you would redirect to checkout page or show checkout form
            } else {
                showToast('Your cart is empty');
            }
        }

        // Clear cart button
        if (e.target.id === 'clear-cart-btn') {
            localStorage.removeItem('cart');
            cart = []; // Clear the local cart variable
            updateCartDisplay();
            updateCartCount();
            showToast('Cart cleared!');
        }
    });

    // Add event listener for the cart icon click to toggle cart visibility
    const cartIcon = document.getElementById('cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            const cartSection = document.getElementById('cart-section');
            if (cartSection) {
                cartSection.classList.toggle('active');
            }
        });
    }

    // Add animation styles for cart count
    const countStyles = `
        #cart-count {
            transition: transform 0.2s ease;
        }
        .cart-count-update {
            transform: scale(1.3);
            color: #4a6cf7;
        }
    `;
    const countStyleElement = document.createElement('style');
    countStyleElement.textContent = countStyles;
    document.head.appendChild(countStyleElement);
    // Initial display and count update
    updateCartDisplay();
    updateCartCount();
}

document.addEventListener("DOMContentLoaded", createCart);