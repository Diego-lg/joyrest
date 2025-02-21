import { initializeCart } from "../cart/cart.js";

class Navbar {
  constructor() {
    this.navbarTemplate = `
      <header class="navbar" role="banner">
        <nav role="navigation" aria-label="Main navigation">
          <a href="/" class="logo" aria-label="Joy - Home">Joy</a>
          <button 
            class="menu-toggle" 
            aria-label="Toggle menu" 
            aria-expanded="false"
            aria-controls="nav-links"
          >
            <span class="menu-bar"></span>
            <span class="menu-bar"></span>
            <span class="menu-bar"></span>
          </button>
          <ul class="nav-links" id="nav-links">
            <li><a href="/" aria-current="page">Home</a></li>
            <li><a href="menu.html">Menu</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#location">Location</a></li>
          </ul>
        </nav>
      </header>
    `;

    this.cartTemplate = `
      <div class="cart-icon-container" aria-live="polite">
        <button 
          class="cart-button" 
          aria-label="View shopping cart"
          aria-haspopup="true"
        >
          <i class="fa fa-shopping-cart" aria-hidden="true"></i>
          <span class="cart-badge" role="status">0</span>
        </button>
      </div>
    `;
  }

  init() {
    try {
      this.renderNavbar();
      this.renderCart();
      this.initializeEventListeners();
    } catch (error) {
      console.error("Failed to initialize navbar:", error);
    }
  }

  renderNavbar() {
    document.body.insertAdjacentHTML("afterbegin", this.navbarTemplate);
  }

  renderCart() {
    document.body.insertAdjacentHTML("beforeend", this.cartTemplate);
  }

  initializeEventListeners() {
    this.menuToggle = document.querySelector(".menu-toggle");
    this.navLinks = document.querySelector(".nav-links");
    this.cartButton = document.querySelector(".cart-icon-container");

    if (!this.menuToggle || !this.navLinks || !this.cartButton) {
      throw new Error("Required DOM elements not found");
    }

    // Initialize cart
    const cart = initializeCart(this.cartButton);
    this.initializeCartButtons(cart.addToCart);
    this.initializeMenuToggle();
  }

  initializeCartButtons(addToCartFn) {
    const addToCartButtons = document.querySelectorAll(
      ".menu-item .add-to-cart"
    );

    addToCartButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();

        try {
          const menuItem = button.closest(".menu-item");
          if (!menuItem) return;

          const itemName = menuItem.querySelector("h2")?.textContent;
          const priceElement = menuItem.querySelector(".price")?.textContent;

          if (!itemName || !priceElement) {
            throw new Error("Invalid menu item structure");
          }

          const itemPrice = parseFloat(priceElement.replace("$", ""));

          if (isNaN(itemPrice)) {
            throw new Error("Invalid price format");
          }

          addToCartFn(itemName, itemPrice);
        } catch (error) {
          console.error("Failed to add item to cart:", error);
        }
      });
    });
  }

  initializeMenuToggle() {
    this.menuToggle.addEventListener("click", () => {
      const isExpanded = this.navLinks.classList.contains("active");

      this.navLinks.classList.toggle("active");
      this.menuToggle.classList.toggle("active");

      // Update ARIA attributes
      this.menuToggle.setAttribute("aria-expanded", !isExpanded);
    });
  }
}

// Initialize navbar when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const navbar = new Navbar();
  navbar.init();
});
