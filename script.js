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
            if(productsContainer) {
                productsContainer.innerHTML = '<p style="text-align:center; color: var(--gold-light);">Cargando catálogo...</p>';
            }
        });

    function renderProducts(products) {
        if(!productsContainer) return;
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

    // 2. LÓGICA DEL BANNER SLIDER INTELIGENTE
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    let slideTimer = null;

    function showSlide(index) {
        if (slideTimer) clearTimeout(slideTimer);

        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            const vid = slide.querySelector('video');
            if (vid) vid.pause();

            if (i === index) {
                slide.classList.add('active');
                
                const currentVideo = slide.querySelector('video');
                if (currentVideo) {
                    currentVideo.currentTime = 0;
                    
                    const playPromise = currentVideo.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(err => {
                            console.log("Autoplay omitido o restringido:", err);
                            slideTimer = setTimeout(() => moveSlide(1), 8000);
                        });
                    }

                    currentVideo.onended = () => {
                        moveSlide(1);
                    };
                } else {
                    slideTimer = setTimeout(() => moveSlide(1), 6000);
                }
            }
        });
    }

    function moveSlide(direction) {
        if (slides.length === 0) return;
        currentSlide += direction;
        if (currentSlide >= slides.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        showSlide(currentSlide);
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => moveSlide(-1));
        nextBtn.addEventListener('click', () => moveSlide(1));
    }

    showSlide(0);

    // 3. LÓGICA DE APERTURA Y CIERRE DE MODALES (SOBRE NOSOTROS & CONTACTO)
    const storyModal = document.getElementById('story-modal');
    const contactModal = document.getElementById('contact-modal');
    
    const navAbout = document.getElementById('nav-about');
    const navContact = document.getElementById('nav-contact');
    const btnReadStory = document.getElementById('btn-read-story');
    
    const closeStoryModal = document.getElementById('close-story-modal');
    const closeContactModal = document.getElementById('close-contact-modal');
    
    const allNavLinks = document.querySelectorAll('.nav-link');

    function openModal(modal) {
        closeAllModals();
        if(modal) modal.classList.add('active');
    }

    function closeAllModals() {
        if(storyModal) storyModal.classList.remove('active');
        if(contactModal) contactModal.classList.remove('active');
    }

    // Eventos para abrir el modal de Sobre Nosotros
    if(navAbout) {
        navAbout.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(storyModal);
        });
    }

    if(btnReadStory) {
        btnReadStory.addEventListener('click', () => openModal(storyModal));
    }

    // Eventos para abrir el modal de Contacto
    if(navContact) {
        navContact.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(contactModal);
        });
    }

    // Eventos de Cierre
    if(closeStoryModal) closeStoryModal.addEventListener('click', closeAllModals);
    if(closeContactModal) closeContactModal.addEventListener('click', closeAllModals);

    // Cerrar al hacer clic fuera del cuadro
    window.addEventListener('click', (e) => {
        if(e.target === storyModal || e.target === contactModal) {
            closeAllModals();
        }
    });

    // Cerrar al presionar la tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllModals();
    });

    // Cerrar modales si hace clic en CUALQUIER otro enlace del menú (ej. Perfumería)
    allNavLinks.forEach(link => {
        if(link !== navAbout && link !== navContact) {
            link.addEventListener('click', closeAllModals);
        }
    });

});

// 4. LÓGICA DEL CARRITO DE COMPRAS
let itemCount = 0;
let totalPrice = 0;

function addToCart(name, price) {
    itemCount++;
    totalPrice += price;
    
    document.getElementById('cart-count').innerText = itemCount;
    document.getElementById('cart-price').innerText = `$${totalPrice.toFixed(2)}`;
    
    console.log(`Producto añadido: ${name} ($${price})`);
}
