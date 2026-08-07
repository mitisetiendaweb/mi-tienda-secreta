document.addEventListener('DOMContentLoaded', () => {

    // 1. CARGA DINÁMICA DE PRODUCTOS DESDE CATALOG.JSON
    const productsContainer = document.getElementById('products-container');

    fetch('catalog.json')
        .then(response => {
            if (!response.ok) throw new Error("Error al cargar catalog.json");
            return response.json();
        })
        .then(products => {
            renderProducts(products);
        })
        .catch(error => {
            console.error('Error:', error);
            productsContainer.innerHTML = '<p style="text-align:center; color: var(--gold-light);">Cargando catálogo...</p>';
        });

    function renderProducts(products) {
        productsContainer.innerHTML = '';
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-img-box">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x300/1a1a1a/D4AF37?text=Perfume'">
                </div>
                <div class="product-details">
                    <div>
                        <p class="product-brand">${product.brand}</p>
                        <h3 class="product-name">${product.name}</h3>
                    </div>
                    <div>
                        <p class="product-price">$${product.price.toFixed(2)} USD</p>
                        <button class="btn-add-cart" onclick="addToCart('${product.name}', ${product.price})">Añadir al Carrito</button>
                    </div>
                </div>
            `;
            productsContainer.appendChild(card);
        });
    }

    // 2. LÓGICA DEL BANNER SLIDER
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) slide.classList.add('active');
        });
    }

    function moveSlide(direction) {
        currentSlide += direction;
        if (currentSlide >= slides.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        showSlide(currentSlide);
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => moveSlide(-1));
        nextBtn.addEventListener('click', () => moveSlide(1));
    }

    // Auto-play del slider cada 5 segundos
    setInterval(() => {
        moveSlide(1);
    }, 5000);

});

// 3. LÓGICA DEL CARRITO DE COMPRAS (Global)
let itemCount = 0;
let totalPrice = 0;

function addToCart(name, price) {
    itemCount++;
    totalPrice += price;
    
    document.getElementById('cart-count').innerText = itemCount;
    document.getElementById('cart-price').innerText = `$${totalPrice.toFixed(2)}`;
    
    // Alerta estilizada
    console.log(`Producto añadido: ${name} ($${price})`);
}
