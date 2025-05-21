// Modern JavaScript with ES6+ Features
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the app
    initApp();
});

const initApp = () => {
    // Remove loading screen
    setTimeout(() => {
        document.querySelector('.loading-screen').classList.add('hidden');
    }, 1500);

    // Initialize components
    initMobileMenu();
    initCart();
    initProductGrid();
    initAnimations();
    initTestimonialSlider();
    initModal();
    initFilters();
    initScrollEffects();
};

// Mobile Menu Functionality
const initMobileMenu = () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const closeMenuBtn = document.querySelector('.close-mobile-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
    });
    
    closeMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    });
    
    // Close menu when clicking on links
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
};

// Shopping Cart Functionality
const initCart = () => {
    const cartBtn = document.getElementById('cart-btn');
    const closeCartBtn = document.querySelector('.close-cart');
    const cartOverlay = document.querySelector('.cart-overlay');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const continueShoppingBtn = document.querySelector('.continue-shopping');
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Toggle cart visibility
    const toggleCart = () => {
        cartOverlay.classList.toggle('active');
        cartSidebar.classList.toggle('open');
        document.body.style.overflow = cartSidebar.classList.contains('open') ? 'hidden' : '';
    };
    
    cartBtn.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);
    continueShoppingBtn.addEventListener('click', toggleCart);
    
    // Update cart count
    const updateCartCount = () => {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelector('.cart-count').textContent = count;
    };
    
    // Render cart items
    const renderCart = () => {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartSubtotal = document.querySelector('.cart-subtotal');
        const cartTotal = document.querySelector('.cart-total');
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
            cartSubtotal.textContent = '$0.00';
            cartTotal.textContent = '$0.00';
            return;
        }
        
        let itemsHTML = '';
        let subtotal = 0;
        
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
            itemsHTML += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image" style="background-image: url('${item.image}')"></div>
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.title}</h4>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus" data-id="${item.id}">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn plus" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        });
        
        cartItemsContainer.innerHTML = itemsHTML;
        cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        cartTotal.textContent = `$${subtotal.toFixed(2)}`;
        
        // Add event listeners to quantity buttons
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', handleQuantityChange);
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', removeFromCart);
        });
    };
    
    // Handle quantity changes
    const handleQuantityChange = (e) => {
        const id = e.target.dataset.id;
        const isPlus = e.target.classList.contains('plus');
        
        cart = cart.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    quantity: isPlus ? item.quantity + 1 : Math.max(1, item.quantity - 1)
                };
            }
            return item;
        });
        
        saveCart();
    };
    
    // Remove item from cart
    const removeFromCart = (e) => {
        const id = e.target.closest('button').dataset.id;
        cart = cart.filter(item => item.id !== id);
        saveCart();
    };
    
    // Save cart to localStorage
    const saveCart = () => {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCart();
    };
    
    // Add to cart function
    window.addToCart = (product) => {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            cart = cart.map(item => 
                item.id === product.id 
                    ? {...item, quantity: item.quantity + 1} 
                    : item
            );
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        saveCart();
        
        // Show feedback
        const feedback = document.createElement('div');
        feedback.className = 'cart-feedback';
        feedback.textContent = `${product.title} added to cart`;
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            feedback.classList.remove('show');
            setTimeout(() => feedback.remove(), 300);
        }, 2000);
    };
    
    // Initialize cart
    updateCartCount();
    renderCart();
};

// Product Grid Functionality
const initProductGrid = () => {
    const products = [
        // Sample product data
        {
            id: '1',
            title: 'Organic Cotton T-Shirt',
            price: 29.99,
            image: 'assets/products/product1.jpg',
            type: 'new',
            category: 'tops',
            description: 'Made from 100% organic cotton with ethical production practices.'
        },
        // More products...
    ];
    
    const productGrid = document.getElementById('products-grid');
    
    const renderProducts = (filter = 'all') => {
        const filteredProducts = filter === 'all' 
            ? products 
            : products.filter(p => p.type === filter);
        
        productGrid.innerHTML = filteredProducts.map(product => `
            <div class="product-card" data-id="${product.id}" data-type="${product.type}">
                <div class="product-image" style="background-image: url('${product.image}')">
                    ${product.type === 'new' ? '<span class="product-badge">New</span>' : ''}
                    ${product.type === 'used' ? '<span class="product-badge">Pre-Loved</span>' : ''}
                    ${product.type === 'rental' ? '<span class="product-badge">Rent</span>' : ''}
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">
                        $${product.price.toFixed(2)}
                        ${product.originalPrice ? `<span class="original