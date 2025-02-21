const cartSliderHTML = `
    <div class="cart-slider">
        <div class="cart-slider-content">
            <button class="close-cart-button" aria-label="Close shopping cart">
                <i class="fa fa-times"></i>
            </button>
            <h3>Your Cart</h3>
            <ul class="cart-items">

            </ul>
            <div class="cart-subtotal">
                Subtotal: $0
            </div>
            <div class="cart-actions">
                <button class="button checkout">Checkout</button>
            </div>
        </div>
    </div>
`;

const cartSliderCSS = `
    /* Cart Slider Styles */
    .cart-slider {
        position: fixed;
        top: 0;
        right: 0;
        width: 300px;
        height: 100%;
        background-color: #f8f8f8; /* Lighter background for slider */
        box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
        transform: translateX(100%);
        transition: transform 0.5s ease-in-out;
        z-index: 105; /* Above navbar and overlay */
        overflow-y: auto; /* Enable scroll if content is long */
        padding: 1rem; /* Add padding to the slider itself */
    }

    .cart-slider.open {
        transform: translateX(0);
    }

    .cart-slider-content {
        display: flex;
        flex-direction: column;
        height: 100%; /* Ensure content takes full height of slider */
        padding: 1rem; /* Reduce padding inside content */
    }

    .close-cart-button {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: #777;
        cursor: pointer;
        align-self: flex-end; /* Position close button to the right */
        margin-bottom: 0.5rem; /* Reduce margin */
    }

    .cart-items {
        list-style: none;
        padding: 0;
        margin-bottom: 1.5rem; /* Increase margin before subtotal */
    }

    .cart-items li {
        padding: 0.75rem 0; /* Reduce padding in list items */
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between; /* Align item text and remove button */
        align-items: center; /* Vertically align items */
    }

    .cart-items li .cart-item-info {
        display: flex;
        flex-direction: column;
    }

    .cart-items li .item-name {
        font-weight: bold;
    }

    .cart-items li .item-price {
        color: #777;
        font-size: 0.9rem;
    }


    .cart-items li .cart-item-quantity {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .cart-items li .cart-item-quantity .quantity-button {
        background: none;
        border: 1px solid #ccc;
        border-radius: 50%;
        width: 25px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 1rem;
        color: #555;
        transition: background-color 0.3s ease, border-color 0.3s ease;
    }

    .cart-items li .cart-item-quantity .quantity-button:hover {
        background-color: #eee;
        border-color: #bbb;
    }

    .cart-items li .cart-item-quantity .quantity {
        font-size: 1rem;
        width: 20px; /* Adjust width as needed */
        text-align: center;
    }


    .cart-items li button.remove-item-button {
        background: none;
        border: none;
        color: #d4af37;
        cursor: pointer;
        font-size: 0.8rem; /* Smaller font for remove button */
        opacity: 0.7;
        transition: opacity 0.3s ease;
    }

    .cart-items li button.remove-item-button:hover {
        opacity: 1;
    }


    .cart-subtotal {
        font-weight: bold;
        margin-bottom: 1.5rem; /* Increase margin before actions */
        text-align: right;
        padding-right: 1rem; /* Align subtotal text to the right */
    }

    .cart-actions {
        display: flex;
        flex-direction: column; /* Stack buttons vertically */
    }

    .cart-actions .button {
        padding: 0.75rem 1.5rem;
        font-size: 0.9rem;
        text-align: center; /* Ensure text is centered in buttons */
        width: 100%; /* Make buttons full width */
        margin-bottom: 0.5rem; /* Add spacing between stacked buttons */
    }

    .cart-actions .button.checkout {
         margin-bottom: 0; /* Remove bottom margin from last button */
    }
`;

let cart = [];

function updateCartDisplay(cartItemsList, cartBadge, cartSubtotalElement) {
    if (!cartItemsList || !cartBadge || !cartSubtotalElement) {
        console.error('cartItemsList, cartBadge, or cartSubtotalElement is not defined in updateCartDisplay');
        return;
    }
    cartItemsList.innerHTML = ''; // Clear current items
    let subtotal = 0;

    cart.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <div class="cart-item-info">
                <span class="item-name">${item.name}</span>
                <span class="item-price">$${item.price}</span>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-button decrement" data-index="${index}">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-button increment" data-index="${index}">+</button>
            </div>
            <button class="remove-item-button" data-index="${index}">Remove</button>
        `;
        cartItemsList.appendChild(listItem);
        subtotal += item.price * item.quantity;
    });

    cartBadge.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    cartSubtotalElement.textContent = `Subtotal: $${subtotal.toFixed(2)}`; // Fixed to 2 decimal places

    // Add event listeners to quantity buttons and remove buttons after they are added to DOM
    cartItemsList.querySelectorAll('.quantity-button').forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation(); // Stop propagation here
            const indexToModify = parseInt(button.dataset.index);
            if (button.classList.contains('increment')) {
                incrementQuantity(indexToModify, cartBadge, cartSubtotalElement, cartItemsList);
            } else if (button.classList.contains('decrement')) {
                decrementQuantity(indexToModify, cartBadge, cartSubtotalElement, cartItemsList);
            }
        });
    });


    const removeButtons = cartItemsList.querySelectorAll('.remove-item-button');
    removeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation(); // Stop propagation here
            const indexToRemove = parseInt(button.dataset.index);
            removeFromCart(indexToRemove, cartBadge, cartSubtotalElement, cartItemsList);
        });
    });
}


function addToCart(name, price, cartItemsList, cartBadge, cartSlider, cartSubtotalElement) {
    const existingItemIndex = cart.findIndex(item => item.name === name);

    if (existingItemIndex > -1) {
        // If item exists, increase quantity
        cart[existingItemIndex].quantity += 1;
    } else {
        // If new item, add to cart
        cart.push({ name: name, price: price, quantity: 1 });
    }
    updateCartDisplay(cartItemsList, cartBadge, cartSubtotalElement);
    cartSlider.classList.add("open"); // Open cart slider when item is added
}

function removeFromCart(indexToRemove, cartBadge, cartSubtotalElement, cartItemsList) {
    cart.splice(indexToRemove, 1);
    updateCartDisplay(cartItemsList, cartBadge, cartSubtotalElement);
}

function incrementQuantity(index, cartBadge, cartSubtotalElement, cartItemsList) {
    cart[index].quantity += 1;
    updateCartDisplay(cartItemsList, cartBadge, cartSubtotalElement);
}

function decrementQuantity(index, cartBadge, cartSubtotalElement, cartItemsList) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        updateCartDisplay(cartItemsList, cartBadge, cartSubtotalElement);
    } else {
        removeFromCart(index, cartBadge, cartSubtotalElement, cartItemsList); // Remove from cart if quantity becomes 0 after decrementing from 1
    }
}


function initializeCart(cartButton) {
    document.body.insertAdjacentHTML("beforeend", cartSliderHTML);

    const styleElement = document.createElement("link");
    styleElement.rel = "stylesheet";
    styleElement.href = "components/cart/cart.css";
    document.head.appendChild(styleElement);

    const cartSlider = document.querySelector(".cart-slider");
    const closeCartButton = cartSlider.querySelector(".close-cart-button");
    const cartItemsList = cartSlider.querySelector(".cart-items");
    const cartBadge = cartButton.querySelector(".cart-badge");
    const cartSubtotalElement = cartSlider.querySelector(".cart-subtotal");
    const cartSliderContent = cartSlider.querySelector(".cart-slider-content");


    cartButton.addEventListener("click", (event) => {
        event.stopPropagation();
        cartSlider.classList.add("open");
        document.body.classList.add("cart-slider-open");
        updateCartDisplay(cartItemsList, cartBadge, cartSubtotalElement); // Update cart display when opening slider
    });

    closeCartButton.addEventListener("click", () => {
        cartSlider.classList.remove("open");
        document.body.classList.remove("cart-slider-open");
    });

    document.addEventListener("click", (event) => {
        // Check if the clicked element is NOT inside the cart slider content AND not the cart button
        if (!cartSliderContent.contains(event.target) && event.target !== cartButton.querySelector('.cart-button') && cartSlider.classList.contains("open")) {
            cartSlider.classList.remove("open");
            document.body.classList.remove("cart-slider-open");
        }
    });

    return {
        addToCart: (name, price) => addToCart(name, price, cartItemsList, cartBadge, cartSlider, cartSubtotalElement),
        removeFromCart: (index) => removeFromCart(index, cartBadge, cartSubtotalElement, cartItemsList),
        incrementQuantity: (index) => incrementQuantity(index, cartBadge, cartSubtotalElement, cartItemsList),
        decrementQuantity: (index) => decrementQuantity(index, cartBadge, cartSubtotalElement, cartItemsList)
    };
}


export { initializeCart };