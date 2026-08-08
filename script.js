document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 0. ESTADO INICIAL Y ALMACENAMIENTO (localStorage)
    // ==========================================
    const DEFAULT_DATA = {
        tickerText: "⚜️ LUXURY FRAGRANCE ⚜️,💎 PERFUMERÍA 100% ORIGINAL Y DE LUJO 💎,👑 LUXURY FRAGRANCE 👑",
        logoPath: "IMG/LOGO FN.png",
        banners: [
            {
                type: "video",
                media: "VID/3BHARARA.mp4",
                tag: "Colección Exclusiva 2026",
                title: "Fragancias que Dejan Huella",
                desc: "Descubre notas olfativas de oro, maderas nobles y esencias orientales diseñadas para destacar."
            },
            {
                type: "image",
                media: "IMG/OFERTON.png",
                tag: "Edición Especial",
                title: "Lujo & Distinción Olfativa",
                desc: "Aprovecha precios exclusivos en líneas seleccionadas de la mejor perfumería."
            }
        ],
        subsections: ["Recomendados"],
        products: [
            { id: 1, brand: "Lattafa Exclusif", name: "Atheeri Gold Edition", price: 85.00, image: "IMG/LOGO_ENTERO.png", subsection: "Recomendados" },
            { id: 2, brand: "Haute Parfumerie", name: "Élixir de Nuit", price: 120.00, image: "IMG/LOGO_ENTERO.png", subsection: "Recomendados" },
            { id: 3, brand: "Royal Collection", name: "Velours Imperial", price: 95.00, image: "IMG/LOGO_ENTERO.png", subsection: "Recomendados" },
            { id: 4, brand: "Oriental Oud", name: "Oud Royal Gold", price: 140.00, image: "IMG/LOGO_ENTERO.png", subsection: "Recomendados" }
        ],
        about: {
            subtitle: "Pasión por el Aroma Real",
            title: "La Selección Perfecta Detrás de Cada Gota",
            desc: "Curamos y distribuimos las mejores inspiraciones olfativas del mundo, seleccionadas meticulosamente por su fidelidad y formuladas a base de aceites concentrados. Disfruta de una fijación extraordinaria y máxima duración en tu piel sin pagar sobreprecios.",
            modalStory: `<p>A mediados de 2011 en Puerto Rico, Mitise es bautizada bajo el concepto revelador de <strong>Mi Tienda Secreta</strong>. nació tras identificar una gran verdad del mercado: la mayoría de las personas paga sumas exorbitantes no por la esencia en sí, sino por la marca, el frasco de diseño y la publicidad, recibiendo a cambio fórmulas diluidas en alcohol que se evaporaban al cabo de unas horas.</p>\n\n<p>Frente a esta realidad, la propuesta no fue crear fragancias desde cero, sino democratizar el acceso al lujo mediante la curaduría y distribución de las mejores equivalencias olfativas. Mitise se enfocó en rastrear y seleccionar meticulosamente las mejores inspiraciones de los perfumes más codiciados del mundo, garantizando la más alta fidelidad y, sobre todo, una formulación superior a base de aceites.</p>\n\n<p>El secreto del éxito radicó en la fijación. Al prescindir del alcohol y apostar por concentrados de óleo de alta pureza, las fragancias distribuidas por Mitise no se evaporan rápidamente; penetran en la piel e interactúan con el calor corporal para ofrecer una durabilidad extraordinaria durante todo el día. El cliente descubrió que podía llevar la misma presencia, elegancia y rastro distintivo de una marca de alta gama, pero a un precio justo y accesible.</p>\n\n<p>Hoy, esa misma filosofía cruza el Atlántico para desembarcar en el mercado español. Mitise se presenta en España como el puente directo hacia las mejores inspiraciones en aceite del mundo: un espacio donde la altísima fijación, el rendimiento real y la honestidad en el precio se unen para redefinir la forma en que las personas disfrutan de su perfume diario.</p>`
        },
        contactLinks: {
            instagram: "https://www.instagram.com/mitisefragrance/",
            tiktok: "https://www.tiktok.com/@mitisefragance",
            facebook: "",
            telegram: "https://t.me/+584242032510",
            gmail: "mitisefragance@gmail.com",
            whatsapp: "https://wa.me/+584242032510"
        }
    };

    let siteData = JSON.parse(localStorage.getItem('mitise_site_data')) || DEFAULT_DATA;
    let favoritesList = JSON.parse(localStorage.getItem('mitise_favorites')) || [];
    let cartList = JSON.parse(localStorage.getItem('mitise_cart_items')) || [];

    // Estado temporal para el checkout y la selección de cantidad
    let currentSelectedProduct = null;
    let checkoutData = {
        fullname: '',
        countryCode: '+58',
        phone: '',
        paymentMethod: 'Efectivo',
        deliveryMethod: 'Delivery',
        courierCompany: ''
    };

    function saveSiteData() {
        localStorage.setItem('mitise_site_data', JSON.stringify(siteData));
        renderAllContent();
    }

    function saveFavorites() {
        localStorage.setItem('mitise_favorites', JSON.stringify(favoritesList));
        updateFavBadge();
        renderCatalog();
        renderFavoritesModal();
    }

    function saveCart() {
        localStorage.setItem('mitise_cart_items', JSON.stringify(cartList));
        updateCartBadge();
        renderCartModal();
    }

    function toggleFavorite(productId) {
        const index = favoritesList.indexOf(productId);
        if (index === -1) {
            favoritesList.push(productId);
        } else {
            favoritesList.splice(index, 1);
        }
        saveFavorites();
    }

    function updateFavBadge() {
        const favCountBadge = document.getElementById('fav-count');
        if (favCountBadge) favCountBadge.innerText = favoritesList.length;
    }

    function updateCartBadge() {
        const cartCountBadge = document.getElementById('cart-count');
        const totalQty = cartList.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountBadge) cartCountBadge.innerText = totalQty;
    }

    window.toggleFavorite = toggleFavorite;

    // ==========================================
    // 1. MENÚ HAMBURGUESA MÓVIL
    // ==========================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuBtn.innerText = navMenu.classList.contains('active') ? '✕' : '☰';
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuBtn.innerText = '☰';
            });
        });
    }

    // ==========================================
    // 2. RENDERIZADO DINÁMICO
    // ==========================================
    function renderAllContent() {
        // Ticker
        const tickerContainer = document.getElementById('ticker-track-container');
        if(tickerContainer) {
            const items = siteData.tickerText.split(',').map(item => `<span class="ticker-item">${item.trim()}</span>`).join('');
            tickerContainer.innerHTML = items + items;
        }

        // Logo
        const logoImg = document.getElementById('main-logo-img');
        if(logoImg && siteData.logoPath) logoImg.src = siteData.logoPath;

        // Banners
        renderBanners();

        // Productos
        renderCatalog();

        // Sobre Nosotros
        document.getElementById('about-subtitle-display').innerText = siteData.about.subtitle;
        document.getElementById('about-title-display').innerText = siteData.about.title;
        document.getElementById('about-desc-display').innerText = siteData.about.desc;
        
        const storyBody = document.getElementById('story-modal-body-display');
        if(storyBody) {
            let storyHtml = siteData.about.modalStory;
            if(!storyHtml.includes('<p>')) {
                storyHtml = storyHtml.split(/\n\s*\n/).map(para => `<p>${para.trim()}</p>`).join('');
            }
            storyBody.innerHTML = storyHtml;
        }

        // Redes
        renderContactGrid();

        // Badges
        updateFavBadge();
        updateCartBadge();
        renderFavoritesModal();
        renderCartModal();
    }

    function renderBanners() {
        const slidesWrapper = document.getElementById('slides-wrapper');
        if(!slidesWrapper) return;
        slidesWrapper.innerHTML = '';

        siteData.banners.forEach((banner, index) => {
            const slideDiv = document.createElement('div');
            slideDiv.className = `slide slide-${index + 1} ${index === 0 ? 'active' : ''}`;
            
            let bgMedia = banner.media.endsWith('.mp4') 
                ? `<video autoplay muted playsinline class="hero-bg-video"><source src="${banner.media}" type="video/mp4"></video>`
                : `<img src="${banner.media}" alt="Banner ${index+1}" class="hero-bg-img">`;

            slideDiv.innerHTML = `
                ${bgMedia}
                <div class="slide-overlay"></div>
                <div class="slide-content">
                    <p class="slide-tag">${banner.tag}</p>
                    <h1 class="slide-title">${banner.title}</h1>
                    <p class="slide-desc">${banner.desc}</p>
                    <a href="#catalogo" class="btn-gold">Explorar Catálogo</a>
                </div>
            `;
            slidesWrapper.appendChild(slideDiv);
        });

        initSliderLogic();
    }

    function renderCatalog() {
        const container = document.getElementById('products-container');
        if(!container) return;
        container.innerHTML = '';

        siteData.products.forEach(product => {
            const isFav = favoritesList.includes(product.id);
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-img-box">
                    <button class="btn-fav-card ${isFav ? 'active' : ''}" onclick="toggleFavorite(${product.id})" title="Guardar en Favoritos">
                        ${isFav ? '❤️' : '🖤'}
                    </button>
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='IMG/LOGO_ENTERO.png'">
                </div>
                <div class="product-details">
                    <div>
                        <p class="product-brand">${product.brand}</p>
                        <h3 class="product-name">${product.name}</h3>
                    </div>
                    <div>
                        <p class="product-price">$${Number(product.price).toFixed(2)} USD</p>
                        <button class="btn-add-cart" onclick="triggerQuantityModal(${product.id})">Añadir al Carrito</button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    function renderFavoritesModal() {
        const favBody = document.getElementById('favorites-modal-body');
        if(!favBody) return;

        const favProducts = siteData.products.filter(p => favoritesList.includes(p.id));

        if(favProducts.length === 0) {
            favBody.innerHTML = `
                <div class="empty-fav-msg">
                    <p>Aún no has guardado esencias en tu lista de deseos.</p>
                    <br>
                    <a href="#catalogo" onclick="closeAllModals(true)" class="btn-gold">Explorar Colección</a>
                </div>
            `;
            return;
        }

        favBody.innerHTML = `
            <div class="fav-items-container">
                ${favProducts.map(p => `
                    <div class="fav-item-row">
                        <div class="fav-item-left">
                            <img src="${p.image}" alt="${p.name}" class="fav-item-thumb" onerror="this.src='IMG/LOGO_ENTERO.png'">
                            <div>
                                <h4 class="fav-item-title">${p.name}</h4>
                                <p class="fav-item-price">$${Number(p.price).toFixed(2)} USD</p>
                            </div>
                        </div>
                        <div class="fav-item-actions">
                            <button class="btn-fav-move-cart" onclick="triggerQuantityModal(${p.id}); toggleFavorite(${p.id});">
                                🛒 Añadir
                            </button>
                            <button class="btn-fav-remove" onclick="toggleFavorite(${p.id})" title="Quitar">
                                🗑️
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function renderContactGrid() {
        const grid = document.getElementById('contact-links-grid');
        if(!grid) return;

        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const links = siteData.contactLinks;
        const config = [
            { key: 'instagram', label: '@mitisefragrance', icon: 'IMG/INSTAGRAM.png', defaultUrl: 'https://www.instagram.com/mitisefragrance/' },
            { key: 'tiktok', label: 'TikTok', icon: 'IMG/TIKTOK.png', defaultUrl: 'https://www.tiktok.com/@mitisefragance' },
            { key: 'facebook', label: 'Facebook', icon: 'IMG/FACEBOOK.png', defaultUrl: '#' },
            { key: 'telegram', label: 'Telegram', icon: 'IMG/TELEGREAM.png', defaultUrl: 'https://t.me/+584242032510' },
            { key: 'gmail', label: 'Gmail', icon: 'IMG/GMAIL.png', defaultUrl: 'mitisefragance@gmail.com' },
            { key: 'whatsapp', label: 'WhatsApp', icon: 'IMG/WHATSAPP.png', defaultUrl: 'https://wa.me/+584242032510' }
        ];

        grid.innerHTML = config.map(item => {
            let url = links[item.key] && links[item.key].trim() !== '' ? links[item.key].trim() : item.defaultUrl;

            if (item.key === 'gmail') {
                const cleanEmail = url.replace('mailto:', '').replace('https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=', '').trim();
                url = isMobile ? `mailto:${cleanEmail}` : `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${cleanEmail}`;
            }

            if (url !== '#' && !url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('mailto:')) {
                url = `https://${url}`;
            }

            const isApp = ['tiktok', 'instagram', 'telegram', 'whatsapp'].includes(item.key);
            const useTargetBlank = url !== '#' && !url.startsWith('mailto:') && (!isMobile || !isApp);

            return `
                <a href="${url}" ${useTargetBlank ? 'target="_blank" rel="noopener noreferrer"' : ''} class="btn-social-gold">
                    <img src="${item.icon}" alt="${item.label}" class="btn-social-icon" onerror="this.style.display='none'">
                    <span>${item.label}</span>
                </a>
            `;
        }).join('');
    }

    // ==========================================
    // 3. PASO 1 - PASO 4: CARRITO Y CHECKOUT
    // ==========================================

    // PASO 1: ABRIR MODAL SELECCIÓN DE CANTIDAD
    window.triggerQuantityModal = function(productId) {
        const prod = siteData.products.find(p => p.id === productId);
        if(!prod) return;

        currentSelectedProduct = prod;
        document.getElementById('qty-modal-brand').innerText = prod.brand;
        document.getElementById('qty-modal-title').innerText = prod.name;
        document.getElementById('qty-modal-unit-price').innerText = Number(prod.price).toFixed(2);
        
        const img = document.getElementById('qty-modal-img');
        img.src = prod.image;
        img.onerror = () => { img.src = 'IMG/LOGO_ENTERO.png'; };

        const qtyInput = document.getElementById('qty-modal-input');
        qtyInput.value = 1;

        updateQtySubtotalDisplay();
        openModal(document.getElementById('quantity-modal'));
    };

    function updateQtySubtotalDisplay() {
        if(!currentSelectedProduct) return;
        const qty = parseInt(document.getElementById('qty-modal-input').value) || 1;
        const subtotal = currentSelectedProduct.price * qty;
        document.getElementById('qty-modal-subtotal').innerText = `$${subtotal.toFixed(2)}`;
    }

    // Botones + y - de cantidad
    document.getElementById('qty-btn-minus').addEventListener('click', () => {
        const input = document.getElementById('qty-modal-input');
        let val = parseInt(input.value) || 1;
        if(val > 1) {
            input.value = val - 1;
            updateQtySubtotalDisplay();
        }
    });

    document.getElementById('qty-btn-plus').addEventListener('click', () => {
        const input = document.getElementById('qty-modal-input');
        let val = parseInt(input.value) || 1;
        input.value = val + 1;
        updateQtySubtotalDisplay();
    });

    document.getElementById('qty-modal-input').addEventListener('input', updateQtySubtotalDisplay);

    // Botón Aceptar Paso 1 -> Agrega al Carrito
    document.getElementById('btn-qty-accept').addEventListener('click', () => {
        if(!currentSelectedProduct) return;
        const qty = parseInt(document.getElementById('qty-modal-input').value) || 1;

        // Comprobar si ya existe en el carrito
        const existingIndex = cartList.findIndex(item => item.id === currentSelectedProduct.id);
        if(existingIndex > -1) {
            cartList[existingIndex].quantity += qty;
        } else {
            cartList.push({
                id: currentSelectedProduct.id,
                brand: currentSelectedProduct.brand,
                name: currentSelectedProduct.name,
                price: currentSelectedProduct.price,
                image: currentSelectedProduct.image,
                quantity: qty
            });
        }

        saveCart();
        closeAllModals(true);
    });

    document.getElementById('btn-qty-cancel').addEventListener('click', () => closeAllModals(true));

    // PASO 2: MOSTRAR Y RENDERIZAR MODAL DEL CARRITO
    function renderCartModal() {
        const listContainer = document.getElementById('cart-items-list-container');
        const grandTotalElem = document.getElementById('cart-grand-total-amount');
        if(!listContainer || !grandTotalElem) return;

        if(cartList.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-fav-msg">
                    <p>Tu carrito de compras está vacío.</p>
                </div>
            `;
            grandTotalElem.innerText = '$0.00 USD';
            return;
        }

        let total = 0;
        listContainer.innerHTML = cartList.map((item, index) => {
            const subtotal = item.price * item.quantity;
            total += subtotal;
            return `
                <div class="cart-item-row">
                    <div class="cart-item-info">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-thumb" onerror="this.src='IMG/LOGO_ENTERO.png'">
                        <div>
                            <h4 class="fav-item-title">${item.name}</h4>
                            <p class="fav-item-price">$${Number(item.price).toFixed(2)} x ${item.quantity} = <strong>$${subtotal.toFixed(2)}</strong></p>
                        </div>
                    </div>
                    <button class="btn-fav-remove" onclick="removeCartItem(${index})" title="Quitar">🗑️</button>
                </div>
            `;
        }).join('');

        grandTotalElem.innerText = `$${total.toFixed(2)} USD`;
    }

    window.removeCartItem = function(index) {
        cartList.splice(index, 1);
        saveCart();
    };

    // Botón Aceptar y Comprar (Paso 2 -> Paso 3)
    document.getElementById('btn-cart-checkout-start').addEventListener('click', () => {
        if(cartList.length === 0) {
            alert('Agrega al menos un producto al carrito para comprar.');
            return;
        }
        openModal(document.getElementById('checkout-info-modal'));
    });

    document.getElementById('btn-cart-cancel').addEventListener('click', () => closeAllModals(true));

    // PASO 3: FORMULARIO CLIENTE Y PAQUETERÍA CONDICIONAL
    const deliverySelect = document.getElementById('cust-delivery-method');
    const courierGroup = document.getElementById('courier-field-group');

    deliverySelect.addEventListener('change', () => {
        const val = deliverySelect.value;
        if(val === 'Envíos nacionales' || val === 'Envíos internacionales') {
            courierGroup.style.display = 'flex';
            document.getElementById('cust-courier-company').required = true;
        } else {
            courierGroup.style.display = 'none';
            document.getElementById('cust-courier-company').required = false;
        }
    });

    // Envío del Formulario Paso 3 -> Ir a Paso 4 (Resumen)
    document.getElementById('checkout-info-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        checkoutData.fullname = document.getElementById('cust-fullname').value.trim();
        checkoutData.countryCode = document.getElementById('cust-country-code').value;
        checkoutData.phone = document.getElementById('cust-phone').value.trim();
        checkoutData.paymentMethod = document.getElementById('cust-payment-method').value;
        checkoutData.deliveryMethod = document.getElementById('cust-delivery-method').value;
        checkoutData.courierCompany = document.getElementById('cust-courier-company').value.trim();

        renderSummaryModal();
        openModal(document.getElementById('checkout-summary-modal'));
    });

    document.getElementById('btn-info-back').addEventListener('click', () => {
        openModal(document.getElementById('cart-modal'));
    });

    // PASO 4: RENDIMIENTO DEL RESUMEN Y REDIRECCIÓN WHATSAPP
    function renderSummaryModal() {
        const dataCard = document.getElementById('summary-data-card');
        const itemsList = document.getElementById('summary-items-list');
        const grandTotalElem = document.getElementById('summary-grand-total-amount');

        let courierText = (checkoutData.deliveryMethod !== 'Delivery' && checkoutData.courierCompany) 
            ? `<br><strong>Empresa de Paquetería:</strong> ${checkoutData.courierCompany}` 
            : '';

        dataCard.innerHTML = `
            <strong>Cliente:</strong> ${checkoutData.fullname}<br>
            <strong>Teléfono:</strong> ${checkoutData.countryCode} ${checkoutData.phone}<br>
            <strong>Método de Pago:</strong> ${checkoutData.paymentMethod}<br>
            <strong>Entrega:</strong> ${checkoutData.deliveryMethod} ${courierText}
        `;

        let total = 0;
        itemsList.innerHTML = cartList.map(item => {
            const subtotal = item.price * item.quantity;
            total += subtotal;
            return `
                <div class="cart-item-row">
                    <div class="cart-item-info">
                        <div>
                            <h4 class="fav-item-title">${item.quantity}x ${item.name}</h4>
                            <p class="fav-item-price">PU: $${Number(item.price).toFixed(2)} USD</p>
                        </div>
                    </div>
                    <strong>$${subtotal.toFixed(2)}</strong>
                </div>
            `;
        }).join('');

        grandTotalElem.innerText = `$${total.toFixed(2)} USD`;
    }

    document.getElementById('btn-summary-back').addEventListener('click', () => {
        openModal(document.getElementById('checkout-info-modal'));
    });

    // Botón Aceptar Final -> Redireccionar a WhatsApp
    document.getElementById('btn-summary-accept').addEventListener('click', () => {
        let total = cartList.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        let courierLine = (checkoutData.deliveryMethod !== 'Delivery' && checkoutData.courierCompany)
            ? `\n📦 *Empresa Paquetería:* ${checkoutData.courierCompany}`
            : '';

        let itemsText = cartList.map(i => `• ${i.quantity}x ${i.name} ($${Number(i.price).toFixed(2)}) = $${(i.price * i.quantity).toFixed(2)}`).join('\n');

        let message = `👑 *NUEVO PEDIDO - MITISE* 👑\n\n` +
            `👤 *Cliente:* ${checkoutData.fullname}\n` +
            `📞 *Teléfono:* ${checkoutData.countryCode} ${checkoutData.phone}\n` +
            `💳 *Método de Pago:* ${checkoutData.paymentMethod}\n` +
            `🚚 *Método de Entrega:* ${checkoutData.deliveryMethod}${courierLine}\n\n` +
            `🛍️ *DETALLE DEL PEDIDO:*\n${itemsText}\n\n` +
            `💰 *TOTAL A PAGAR:* $${total.toFixed(2)} USD\n\n` +
            `_¡Hola! Deseo confirmar mi pedido realizado en la tienda web._`;

        // URL de destino configurada en el panel o por defecto
        let targetPhone = siteData.contactLinks.whatsapp || 'https://wa.me/+584242032510';
        let waNumber = targetPhone.replace(/[^0-9]/g, '');
        if(!waNumber) waNumber = '584242032510';

        let finalWaUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

        // Limpiar carrito tras pedido exitoso
        cartList = [];
        saveCart();
        closeAllModals(false);

        // Abrir WhatsApp
        window.open(finalWaUrl, '_blank');
    });

    // ==========================================
    // 4. SLIDER Y EDITOR DE ADMINISTRACIÓN
    // ==========================================
    let currentSlide = 0;
    let slideTimer = null;

    function initSliderLogic() {
        const slides = document.querySelectorAll('.slide');
        const prevBtn = document.getElementById('prevSlide');
        const nextBtn = document.getElementById('nextSlide');

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
                            playPromise.catch(() => {
                                slideTimer = setTimeout(() => moveSlide(1), 8000);
                            });
                        }
                        currentVideo.onended = () => moveSlide(1);
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
            prevBtn.onclick = () => moveSlide(-1);
            nextBtn.onclick = () => moveSlide(1);
        }

        showSlide(currentSlide);
    }

    const loginModal = document.getElementById('login-modal');
    const editorPanel = document.getElementById('editor-panel');
    const btnLoginTrigger = document.getElementById('btn-login-trigger');
    const closeLoginModal = document.getElementById('close-login-modal');
    const loginForm = document.getElementById('login-form');
    const loginErrorMsg = document.getElementById('login-error-msg');

    const USERS = {
        "RUBEN": "RUBEN4321",
        "LUIS": "LUIS4321"
    };

    if(btnLoginTrigger) {
        btnLoginTrigger.addEventListener('click', () => {
            const activeUser = sessionStorage.getItem('mitise_active_editor');
            if(activeUser) {
                openEditorDashboard(activeUser);
            } else {
                openModal(loginModal);
            }
        });
    }

    if(closeLoginModal) {
        closeLoginModal.addEventListener('click', () => closeAllModals(true));
    }

    if(loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('login-username').value.trim().toUpperCase();
            const pass = document.getElementById('login-password').value.trim();

            if(USERS[user] && USERS[user] === pass) {
                loginErrorMsg.innerText = "";
                sessionStorage.setItem('mitise_active_editor', user);
                closeAllModals(false);
                loginForm.reset();
                openEditorDashboard(user);
            } else {
                loginErrorMsg.innerText = "Usuario o contraseña incorrectos.";
            }
        });
    }

    function openEditorDashboard(username) {
        document.getElementById('active-editor-name').innerText = username;
        fillEditorInputs();
        openModal(editorPanel);
    }

    function fillEditorInputs() {
        document.getElementById('edit-ticker-text').value = siteData.tickerText;
        document.getElementById('edit-logo-path').value = siteData.logoPath;
        document.getElementById('edit-banner1-bg').value = siteData.banners[0] ? siteData.banners[0].media : '';
        document.getElementById('edit-banner2-bg').value = siteData.banners[1] ? siteData.banners[1].media : '';
        
        document.getElementById('edit-about-subtitle').value = siteData.about.subtitle;
        document.getElementById('edit-about-title').value = siteData.about.title;
        document.getElementById('edit-about-desc').value = siteData.about.desc;
        document.getElementById('edit-story-modal-text').value = siteData.about.modalStory;

        document.getElementById('link-instagram').value = siteData.contactLinks.instagram || '';
        document.getElementById('link-tiktok').value = siteData.contactLinks.tiktok || '';
        document.getElementById('link-facebook').value = siteData.contactLinks.facebook || '';
        document.getElementById('link-telegram').value = siteData.contactLinks.telegram || '';
        document.getElementById('link-gmail').value = siteData.contactLinks.gmail || '';
        document.getElementById('link-whatsapp').value = siteData.contactLinks.whatsapp || '';
    }

    const tabBtns = document.querySelectorAll('.editor-tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    document.getElementById('btn-save-all').addEventListener('click', () => {
        siteData.tickerText = document.getElementById('edit-ticker-text').value;
        siteData.logoPath = document.getElementById('edit-logo-path').value;
        
        if(siteData.banners[0]) siteData.banners[0].media = document.getElementById('edit-banner1-bg').value;
        if(siteData.banners[1]) siteData.banners[1].media = document.getElementById('edit-banner2-bg').value;

        siteData.about.subtitle = document.getElementById('edit-about-subtitle').value;
        siteData.about.title = document.getElementById('edit-about-title').value;
        siteData.about.desc = document.getElementById('edit-about-desc').value;
        siteData.about.modalStory = document.getElementById('edit-story-modal-text').value;

        siteData.contactLinks.instagram = document.getElementById('link-instagram').value;
        siteData.contactLinks.tiktok = document.getElementById('link-tiktok').value;
        siteData.contactLinks.facebook = document.getElementById('link-facebook').value;
        siteData.contactLinks.telegram = document.getElementById('link-telegram').value;
        siteData.contactLinks.gmail = document.getElementById('link-gmail').value;
        siteData.contactLinks.whatsapp = document.getElementById('link-whatsapp').value;

        saveSiteData();
        alert('¡Todos los cambios han sido guardados!');
    });

    document.getElementById('btn-add-banner').addEventListener('click', () => {
        const tag = document.getElementById('new-banner-tag').value || 'Colección Especial';
        const title = document.getElementById('new-banner-title').value || 'Nuevo Banner';
        const desc = document.getElementById('new-banner-desc').value || 'Descripción del nuevo banner';
        const media = document.getElementById('new-banner-media').value || 'IMG/OFERTON.png';

        siteData.banners.push({ type: media.endsWith('.mp4') ? 'video' : 'image', media, tag, title, desc });
        saveSiteData();
        alert('¡Nuevo banner agregado!');
    });

    document.getElementById('btn-add-product').addEventListener('click', () => {
        const brand = document.getElementById('new-prod-brand').value || 'Mitise';
        const name = document.getElementById('new-prod-name').value || 'Nuevo Perfume';
        const price = parseFloat(document.getElementById('new-prod-price').value) || 90;
        const image = document.getElementById('new-prod-img').value || 'IMG/LOGO_ENTERO.png';

        siteData.products.push({ id: Date.now(), brand, name, price, image });
        saveSiteData();
        alert('¡Producto añadido!');
    });

    document.getElementById('btn-logout-editor').addEventListener('click', () => {
        sessionStorage.removeItem('mitise_active_editor');
        closeAllModals(true);
        alert('Sesión de editor cerrada.');
    });

    document.getElementById('close-editor-panel').addEventListener('click', () => closeAllModals(true));

    // ==========================================
    // 5. MODALES INTERACTIVOS Y MANEJO DEL BOTÓN "ATRÁS"
    // ==========================================
    const storyModal = document.getElementById('story-modal');
    const contactModal = document.getElementById('contact-modal');
    const favoritesModal = document.getElementById('favorites-modal');
    const cartModal = document.getElementById('cart-modal');
    const qtyModal = document.getElementById('quantity-modal');
    const checkoutInfoModal = document.getElementById('checkout-info-modal');
    const checkoutSummaryModal = document.getElementById('checkout-summary-modal');

    const navAbout = document.getElementById('nav-about');
    const navContact = document.getElementById('nav-contact');
    const btnReadStory = document.getElementById('btn-read-story');
    const btnFavoritesTrigger = document.getElementById('btn-favorites-trigger');
    const btnCartTrigger = document.getElementById('btn-cart-trigger');

    const closeStoryModal = document.getElementById('close-story-modal');
    const closeContactModal = document.getElementById('close-contact-modal');
    const closeFavModal = document.getElementById('close-fav-modal');
    const closeCartModal = document.getElementById('close-cart-modal');
    const closeQtyModal = document.getElementById('close-qty-modal');
    const closeInfoModal = document.getElementById('close-info-modal');
    const closeSummaryModal = document.getElementById('close-summary-modal');

    let modalPushedState = false;

    function openModal(modal) {
        closeAllModals(false);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';

            if (!modalPushedState) {
                history.pushState({ modalActive: true }, '');
                modalPushedState = true;
            }
        }
    }

    function closeAllModals(shouldGoBack = true) {
        let wasOpen = false;
        const modals = [
            storyModal, contactModal, favoritesModal, cartModal, 
            qtyModal, checkoutInfoModal, checkoutSummaryModal, 
            loginModal, editorPanel
        ];

        modals.forEach(m => {
            if (m && m.classList.contains('active')) {
                m.classList.remove('active');
                wasOpen = true;
            }
        });

        document.body.style.overflow = '';

        if (wasOpen && modalPushedState && shouldGoBack) {
            modalPushedState = false;
            history.back();
        }
    }

    window.closeAllModals = closeAllModals;

    window.addEventListener('popstate', (e) => {
        if (modalPushedState) {
            modalPushedState = false;
            closeAllModals(false);
        }
    });

    if(navAbout) navAbout.onclick = (e) => { e.preventDefault(); openModal(storyModal); };
    if(btnReadStory) btnReadStory.onclick = () => openModal(storyModal);
    if(navContact) navContact.onclick = (e) => { e.preventDefault(); openModal(contactModal); };
    if(btnFavoritesTrigger) btnFavoritesTrigger.onclick = () => openModal(favoritesModal);
    if(btnCartTrigger) btnCartTrigger.onclick = () => openModal(cartModal);

    if(closeStoryModal) closeStoryModal.onclick = () => closeAllModals(true);
    if(closeContactModal) closeContactModal.onclick = () => closeAllModals(true);
    if(closeFavModal) closeFavModal.onclick = () => closeAllModals(true);
    if(closeCartModal) closeCartModal.onclick = () => closeAllModals(true);
    if(closeQtyModal) closeQtyModal.onclick = () => closeAllModals(true);
    if(closeInfoModal) closeInfoModal.onclick = () => closeAllModals(true);
    if(closeSummaryModal) closeSummaryModal.onclick = () => closeAllModals(true);

    window.onclick = (e) => {
        const modals = [
            storyModal, contactModal, favoritesModal, cartModal, 
            qtyModal, checkoutInfoModal, checkoutSummaryModal, loginModal
        ];
        if(modals.includes(e.target)) {
            closeAllModals(true);
        }
    };

    renderAllContent();
});
