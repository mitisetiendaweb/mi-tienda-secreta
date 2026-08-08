document.addEventListener('DOMContentLoaded', async () => {

    // ==========================================
    // 0. ESTADO INICIAL Y CONEXIÓN GITHUB API
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
            image: "IMG/LOGO FN.png",
            modalStory: `<p>A mediados de 2011 en Puerto Rico, Mitise es bautizada bajo el concepto revelador de <strong>Mi Tienda Secreta</strong>. Nació tras identificar una gran verdad del mercado: la mayoría de las personas paga sumas exorbitantemente no por la esencia en sí, sino por la marca, el frasco de diseño y la publicidad, recibiendo a cambio fórmulas diluidas en alcohol que se evaporaban al cabo de unas horas.</p>\n\n<p>Frente a esta realidad, la propuesta no fue crear fragancias desde cero, sino democratizar el acceso al lujo mediante la curaduría y distribución de las mejores equivalencias olfativas. Mitise se enfocó en rastrear y seleccionar meticulosamente las mejores inspiraciones de los perfumes más codiciados del mundo, garantizando la más alta fidelidad y, sobre todo, una formulación superior a base de aceites.</p>\n\n<p>El secreto del éxito radicó en la fijación. Al prescindir del alcohol y apostar por concentrados de óleo de alta pureza, las fragancias distribuidas por Mitise no se evaporan rápidamente; penetran en la piel e interactúan con el calor corporal para ofrecer una durabilidad extraordinaria durante todo el día. El cliente descubrió que podía llevar la misma presencia, elegancia y rastro distintivo de una marca de alta gama, pero a un precio justo y accesible.</p>\n\n<p>Hoy, esa misma filosofía cruza el Atlántico para desembarcar en el mercado español. Mitise se presenta en España como el puente directo hacia las mejores inspiraciones en aceite del mundo: un espacio donde la altísima fijación, el rendimiento real y la honestidad en el precio se unen para redefinir la forma en que las personas disfrutan de su perfume diario.</p>`
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

    // Cargar la configuración remota publicada globalmente en GitHub al iniciar
    async function fetchRemoteSiteData() {
        try {
            const response = await fetch(`sitedata.json?t=${Date.now()}`);
            if (response.ok) {
                const remoteData = await response.json();
                if (remoteData && typeof remoteData === 'object') {
                    siteData = remoteData;
                    localStorage.setItem('mitise_site_data', JSON.stringify(siteData));
                }
            }
        } catch (error) {
            console.log("Cargando datos locales o predeterminados:", error);
        }
        renderAllContent();
    }

    let currentSelectedProduct = null;
    let checkoutData = {
        fullname: '',
        countryCode: '+58',
        phone: '',
        paymentMethod: 'Efectivo',
        deliveryMethod: 'Delivery',
        courierCompany: ''
    };

    function saveSiteDataLocal() {
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
    // 2. RENDERIZADO DINÁMICO DE LA TIENDA
    // ==========================================
    function renderAllContent() {
        const tickerContainer = document.getElementById('ticker-track-container');
        if(tickerContainer && siteData.tickerText) {
            const items = siteData.tickerText.split(',').map(item => `<span class="ticker-item">${item.trim()}</span>`).join('');
            tickerContainer.innerHTML = items + items;
        }

        const logoImg = document.getElementById('main-logo-img');
        if(logoImg && siteData.logoPath) logoImg.src = siteData.logoPath;

        renderBanners();
        renderCatalog();

        document.getElementById('about-subtitle-display').innerText = siteData.about.subtitle || "Pasión por el Aroma Real";
        document.getElementById('about-title-display').innerText = siteData.about.title || "La Selección Perfecta Detrás de Cada Gota";
        document.getElementById('about-desc-display').innerText = siteData.about.desc || "";
        
        const aboutImgDisplay = document.getElementById('about-img-display');
        if(aboutImgDisplay) {
            aboutImgDisplay.src = siteData.about.image || siteData.logoPath || "IMG/LOGO FN.png";
        }

        const storyBody = document.getElementById('story-modal-body-display');
        if(storyBody) {
            let storyHtml = siteData.about.modalStory || "";
            if(!storyHtml.includes('<p>')) {
                storyHtml = storyHtml.split(/\n\s*\n/).map(para => `<p>${para.trim()}</p>`).join('');
            }
            storyBody.innerHTML = storyHtml;
        }

        renderContactGrid();

        updateFavBadge();
        updateCartBadge();
        renderFavoritesModal();
        renderCartModal();
    }

    function renderBanners() {
        const slidesWrapper = document.getElementById('slides-wrapper');
        if(!slidesWrapper) return;
        slidesWrapper.innerHTML = '';

        if (!siteData.banners || siteData.banners.length === 0) return;

        siteData.banners.forEach((banner, index) => {
            const slideDiv = document.createElement('div');
            slideDiv.className = `slide slide-${index + 1} ${index === 0 ? 'active' : ''}`;
            
            const isVideo = banner.media.startsWith('data:video') || banner.media.endsWith('.mp4');
            let bgMedia = isVideo 
                ? `<video autoplay muted playsinline class="hero-bg-video"><source src="${banner.media}" type="video/mp4"></video>`
                : `<img src="${banner.media}" alt="Banner ${index+1}" class="hero-bg-img" onerror="this.src='IMG/OFERTON.png'">`;

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

    document.getElementById('btn-qty-accept').addEventListener('click', () => {
        if(!currentSelectedProduct) return;
        const qty = parseInt(document.getElementById('qty-modal-input').value) || 1;

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

    document.getElementById('btn-cart-checkout-start').addEventListener('click', () => {
        if(cartList.length === 0) {
            alert('Agrega al menos un producto al carrito para comprar.');
            return;
        }
        openModal(document.getElementById('checkout-info-modal'));
    });

    document.getElementById('btn-cart-cancel').addEventListener('click', () => closeAllModals(true));

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

        let targetPhone = siteData.contactLinks.whatsapp || 'https://wa.me/+584242032510';
        let waNumber = targetPhone.replace(/[^0-9]/g, '');
        if(!waNumber) waNumber = '584242032510';

        let finalWaUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

        cartList = [];
        saveCart();
        closeAllModals(false);

        window.open(finalWaUrl, '_blank');
    });

    // ==========================================
    // 4. HERO SLIDER E INTEGRACIÓN CMS GITHUB
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

    // LOGIN & EDITOR CMS
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

    function getGitHubConfig() {
        return JSON.parse(localStorage.getItem('mitise_gh_config')) || {
            owner: 'mitisetiendaweb',
            repo: 'mi-tienda-secreta',
            branch: 'main',
            token: ''
        };
    }

    function saveGitHubConfig() {
        const config = {
            owner: document.getElementById('gh-owner').value.trim(),
            repo: document.getElementById('gh-repo').value.trim(),
            branch: document.getElementById('gh-branch').value.trim(),
            token: document.getElementById('gh-token').value.trim()
        };
        localStorage.setItem('mitise_gh_config', JSON.stringify(config));
        
        const statusMsg = document.getElementById('gh-status-msg');
        if(statusMsg) {
            statusMsg.innerText = config.token ? "✅ Estado: Token guardado correctamente." : "⚠️ Estado: Sin token de GitHub ingresado.";
        }
        alert('Configuración de GitHub guardada en este dispositivo.');
    }

    function fillEditorInputs() {
        const ghConfig = getGitHubConfig();
        document.getElementById('gh-owner').value = ghConfig.owner || 'mitisetiendaweb';
        document.getElementById('gh-repo').value = ghConfig.repo || 'mi-tienda-secreta';
        document.getElementById('gh-branch').value = ghConfig.branch || 'main';
        document.getElementById('gh-token').value = ghConfig.token || '';

        const statusMsg = document.getElementById('gh-status-msg');
        if(statusMsg) {
            statusMsg.innerText = ghConfig.token ? "✅ Estado: Token listo para publicar cambios." : "⚠️ Estado: Ingrese su token para activar la publicación global.";
        }

        document.getElementById('edit-ticker-text').value = siteData.tickerText;
        document.getElementById('edit-logo-path').value = siteData.logoPath;
        
        const previewLogo = document.getElementById('preview-logo-img');
        if(previewLogo) previewLogo.src = siteData.logoPath;

        if (siteData.banners[0]) {
            document.getElementById('edit-banner1-tag').value = siteData.banners[0].tag || '';
            document.getElementById('edit-banner1-title').value = siteData.banners[0].title || '';
            document.getElementById('edit-banner1-desc').value = siteData.banners[0].desc || '';
            document.getElementById('edit-banner1-bg').value = siteData.banners[0].media || '';
        }

        if (siteData.banners[1]) {
            document.getElementById('edit-banner2-tag').value = siteData.banners[1].tag || '';
            document.getElementById('edit-banner2-title').value = siteData.banners[1].title || '';
            document.getElementById('edit-banner2-desc').value = siteData.banners[1].desc || '';
            document.getElementById('edit-banner2-bg').value = siteData.banners[1].media || '';
        }
        
        document.getElementById('edit-about-subtitle').value = siteData.about.subtitle || '';
        document.getElementById('edit-about-title').value = siteData.about.title || '';
        document.getElementById('edit-about-desc').value = siteData.about.desc || '';
        document.getElementById('edit-about-img-path').value = siteData.about.image || siteData.logoPath;
        document.getElementById('edit-story-modal-text').value = siteData.about.modalStory || '';

        document.getElementById('link-instagram').value = siteData.contactLinks.instagram || '';
        document.getElementById('link-tiktok').value = siteData.contactLinks.tiktok || '';
        document.getElementById('link-facebook').value = siteData.contactLinks.facebook || '';
        document.getElementById('link-telegram').value = siteData.contactLinks.telegram || '';
        document.getElementById('link-gmail').value = siteData.contactLinks.gmail || '';
        document.getElementById('link-whatsapp').value = siteData.contactLinks.whatsapp || '';

        renderEditorBannersList();
    }

    document.getElementById('btn-save-gh-config').addEventListener('click', saveGitHubConfig);

    function openEditorDashboard(username) {
        document.getElementById('active-editor-name').innerText = username;
        fillEditorInputs();
        renderEditorProductsList();
        openModal(editorPanel);
    }

    function setupFileInputReader(fileInputId, targetInputId, previewImgId) {
        const fileInput = document.getElementById(fileInputId);
        if (!fileInput) return;

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(evt) {
                    const dataUrl = evt.target.result;
                    if (targetInputId) {
                        const targetInput = document.getElementById(targetInputId);
                        if (targetInput) targetInput.value = dataUrl;
                    }
                    if (previewImgId) {
                        const previewImg = document.getElementById(previewImgId);
                        if (previewImg) previewImg.src = dataUrl;
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    setupFileInputReader('edit-logo-file', 'edit-logo-path', 'preview-logo-img');
    setupFileInputReader('edit-banner1-file', 'edit-banner1-bg', null);
    setupFileInputReader('edit-banner2-file', 'edit-banner2-bg', null);
    setupFileInputReader('new-banner-file', 'new-banner-media', null);
    setupFileInputReader('new-prod-file', 'new-prod-img', null);
    setupFileInputReader('edit-about-file', 'edit-about-img-path', null);

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

    function renderEditorBannersList() {
        const grid = document.getElementById('editor-banners-list');
        if(!grid) return;

        const extraBanners = siteData.banners.slice(2);

        if(extraBanners.length === 0) {
            grid.innerHTML = '<p class="editor-hint">No hay banners adicionales registrados.</p>';
            return;
        }

        grid.innerHTML = extraBanners.map((b, idx) => {
            const realIndex = idx + 2;
            return `
                <div class="editor-prod-row">
                    <div class="editor-prod-info">
                        <div>
                            <p class="editor-prod-title">Banner ${realIndex + 1}: ${b.title}</p>
                            <p class="editor-prod-sub">${b.tag} | ${b.desc.substring(0, 45)}...</p>
                        </div>
                    </div>
                    <div class="editor-prod-actions">
                        <button class="btn-fav-remove" onclick="deleteBannerFromCMS(${realIndex})" title="Eliminar Banner">
                            🗑️ Eliminar
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    window.deleteBannerFromCMS = function(index) {
        if(confirm(`¿Deseas eliminar el Banner ${index + 1}?`)) {
            siteData.banners.splice(index, 1);
            saveSiteDataLocal();
            renderEditorBannersList();
        }
    };

    // RENDERIZADO Y SELECCIÓN DE PRODUCTOS PARA EDICIÓN
    function renderEditorProductsList() {
        const grid = document.getElementById('editor-products-list');
        if(!grid) return;

        if(!siteData.products || siteData.products.length === 0) {
            grid.innerHTML = '<p class="editor-hint">No hay productos en el catálogo.</p>';
            return;
        }

        grid.innerHTML = siteData.products.map(p => `
            <div class="editor-prod-row" style="cursor: pointer;" onclick="openEditProductModal(${p.id})">
                <div class="editor-prod-info">
                    <img src="${p.image}" alt="${p.name}" class="editor-prod-thumb" onerror="this.src='IMG/LOGO_ENTERO.png'">
                    <div>
                        <p class="editor-prod-title">${p.name}</p>
                        <p class="editor-prod-sub">${p.brand} - $${Number(p.price).toFixed(2)} USD</p>
                    </div>
                </div>
                <div class="editor-prod-actions" onclick="event.stopPropagation()">
                    <button class="btn-gold-small" onclick="openEditProductModal(${p.id}); event.stopPropagation();">
                        ✏️ Editar
                    </button>
                    <button class="btn-fav-remove" onclick="deleteProductFromCMS(${p.id}); event.stopPropagation();" title="Eliminar Producto">
                        🗑️ Eliminar
                    </button>
                </div>
            </div>
        `).join('');
    }

    // CIERRA ÚNICAMENTE EL MODAL DE EDICIÓN SIN AFECTAR EL PANEL CMS NI NAVEGAR ATRÁS
    function closeEditProductModal() {
        const editModal = document.getElementById('edit-product-modal');
        if (editModal) {
            editModal.classList.remove('active');
        }
    }

    // ASEGURAR Y AUTO-CREAR EL MODAL DE EDICIÓN EN DOM
    function ensureEditProductModalExists() {
        let modalDiv = document.getElementById('edit-product-modal');
        if (!modalDiv) {
            modalDiv = document.createElement('div');
            modalDiv.id = 'edit-product-modal';
            modalDiv.className = 'story-modal-backdrop';
            modalDiv.style.zIndex = '3500';
            modalDiv.innerHTML = `
                <div class="story-modal-card contact-modal-card">
                    <button class="story-modal-close" id="close-edit-prod-modal">&times;</button>
                    <div class="story-header">
                        <span class="gold-subtitle">SISTEMA CMS DE GESTIÓN</span>
                        <h2 class="story-title">Editar Producto</h2>
                        <div class="gold-divider"></div>
                    </div>
                    <form id="form-edit-product" class="checkout-form">
                        <input type="hidden" id="edit-prod-id">
                        <div class="form-group-gold">
                            <label for="edit-prod-brand">Marca:</label>
                            <input type="text" id="edit-prod-brand" required autocomplete="off">
                        </div>
                        <div class="form-group-gold">
                            <label for="edit-prod-name">Nombre del Perfume:</label>
                            <input type="text" id="edit-prod-name" required autocomplete="off">
                        </div>
                        <div class="form-group-gold">
                            <label for="edit-prod-price">Precio ($ USD):</label>
                            <input type="number" id="edit-prod-price" step="0.01" required autocomplete="off">
                        </div>
                        <div class="form-group-gold">
                            <label>Seleccionar Nueva Foto desde el Equipo:</label>
                            <input type="file" id="edit-prod-file" accept="image/*" class="file-input-gold">
                        </div>
                        <div class="form-group-gold">
                            <label for="edit-prod-img">O Ruta Relativa de la Foto:</label>
                            <input type="text" id="edit-prod-img" required autocomplete="off">
                        </div>
                        <div class="editor-preview-box" style="margin-bottom: 15px;">
                            <p class="editor-preview-title">Vista Previa de la Foto:</p>
                            <img id="edit-prod-preview" src="" alt="Preview Perfume" class="editor-img-thumb" onerror="this.src='IMG/LOGO_ENTERO.png'">
                        </div>
                        <div class="modal-actions-row">
                            <button type="submit" class="btn-gold">Guardar Cambios de Producto</button>
                            <button type="button" class="btn-outline-gold" id="btn-cancel-edit-prod">Cancelar</button>
                        </div>
                    </form>
                </div>
            `;
            document.body.appendChild(modalDiv);

            setupFileInputReader('edit-prod-file', 'edit-prod-img', 'edit-prod-preview');
        } else {
            modalDiv.style.zIndex = '3500';
        }

        // ASIGNAR MANEJADORES DE EVENTOS
        const formEdit = document.getElementById('form-edit-product');
        if (formEdit && !formEdit.dataset.bound) {
            formEdit.dataset.bound = "true";
            formEdit.addEventListener('submit', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const prodId = parseInt(document.getElementById('edit-prod-id').value);
                const prod = siteData.products.find(p => p.id === prodId);

                if (prod) {
                    prod.brand = document.getElementById('edit-prod-brand').value.trim();
                    prod.name = document.getElementById('edit-prod-name').value.trim();
                    prod.price = parseFloat(document.getElementById('edit-prod-price').value) || 0;
                    prod.image = document.getElementById('edit-prod-img').value.trim();

                    saveSiteDataLocal();
                    renderEditorProductsList();
                    closeEditProductModal();
                    alert('¡Producto actualizado localmente! Recuerda hacer clic en "🚀 Publicar Cambios Globales" para guardar el cambio en GitHub.');
                }
            });
        }

        const closeBtn = document.getElementById('close-edit-prod-modal');
        if (closeBtn) closeBtn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); closeEditProductModal(); };

        const cancelBtn = document.getElementById('btn-cancel-edit-prod');
        if (cancelBtn) cancelBtn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); closeEditProductModal(); };
    }

    // ABRIR MODAL PARA EDITAR PRODUCTO (POR ENCIMA DEL PANEL CMS)
    window.openEditProductModal = function(productId) {
        ensureEditProductModalExists();

        const prod = siteData.products.find(p => p.id === productId);
        if (!prod) return;

        document.getElementById('edit-prod-id').value = prod.id;
        document.getElementById('edit-prod-brand').value = prod.brand || '';
        document.getElementById('edit-prod-name').value = prod.name || '';
        document.getElementById('edit-prod-price').value = prod.price || 0;
        document.getElementById('edit-prod-img').value = prod.image || '';

        const preview = document.getElementById('edit-prod-preview');
        if (preview) preview.src = prod.image || 'IMG/LOGO_ENTERO.png';

        const editModal = document.getElementById('edit-product-modal');
        if (editModal) {
            editModal.classList.add('active');
        }
    };

    window.deleteProductFromCMS = function(productId) {
        if(confirm('¿Estás seguro de que deseas eliminar este producto del catálogo?')) {
            siteData.products = siteData.products.filter(p => p.id !== productId);
            saveSiteDataLocal();
            renderEditorProductsList();
        }
    };

    // SUBIR ARCHIVO A GITHUB API
    async function commitFileToGitHub(pathInRepo, base64Content, commitMessage) {
        const config = getGitHubConfig();
        if(!config.token) {
            throw new Error("No has ingresado tu Token de Acceso de GitHub. Ve a la pestaña '🔑 GitHub API' para configurarlo.");
        }

        const apiUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${pathInRepo}`;

        let sha = null;
        try {
            const checkRes = await fetch(`${apiUrl}?ref=${config.branch}`, {
                headers: {
                    'Authorization': `Bearer ${config.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            if (checkRes.ok) {
                const checkData = await checkRes.json();
                sha = checkData.sha;
            }
        } catch(err) {
            console.log("Archivo nuevo en GitHub, no requiere SHA previo.");
        }

        const payload = {
            message: commitMessage || `Actualización desde Panel CMS Mitise (${new Date().toLocaleString()})`,
            content: base64Content,
            branch: config.branch
        };
        if(sha) payload.sha = sha;

        const putRes = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${config.token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify(payload)
        });

        if(!putRes.ok) {
            const errorInfo = await putRes.json();
            throw new Error(errorInfo.message || "Error al conectar con la API de GitHub");
        }

        return await putRes.json();
    }

    async function processAndUploadImageIfBase64(imageStr, defaultFilenamePrefix) {
        if (imageStr.startsWith('data:')) {
            const parts = imageStr.split(',');
            const mimeMatch = parts[0].match(/:(.*?);/);
            const ext = mimeMatch ? mimeMatch[1].split('/')[1] : 'png';
            const base64Data = parts[1];
            
            const newPath = `IMG/${defaultFilenamePrefix}_${Date.now()}.${ext}`;
            await commitFileToGitHub(newPath, base64Data, `Subida de imagen ${newPath} desde CMS`);
            return newPath;
        }
        return imageStr;
    }

    // BOTÓN PRINCIPAL: PUBLICAR CAMBIOS GLOBALES
    document.getElementById('btn-save-all').addEventListener('click', async () => {
        const loadingOverlay = document.getElementById('github-loading-overlay');
        if (loadingOverlay) loadingOverlay.style.display = 'flex';

        try {
            siteData.tickerText = document.getElementById('edit-ticker-text').value;
            
            let rawLogo = document.getElementById('edit-logo-path').value;
            siteData.logoPath = await processAndUploadImageIfBase64(rawLogo, 'logo');

            if (!siteData.banners[0]) siteData.banners[0] = { type: 'image', media: '', tag: '', title: '', desc: '' };
            siteData.banners[0].tag = document.getElementById('edit-banner1-tag').value;
            siteData.banners[0].title = document.getElementById('edit-banner1-title').value;
            siteData.banners[0].desc = document.getElementById('edit-banner1-desc').value;
            
            let rawB1 = document.getElementById('edit-banner1-bg').value;
            siteData.banners[0].media = await processAndUploadImageIfBase64(rawB1, 'banner1');
            siteData.banners[0].type = (siteData.banners[0].media.startsWith('data:video') || siteData.banners[0].media.endsWith('.mp4')) ? 'video' : 'image';

            if (!siteData.banners[1]) siteData.banners[1] = { type: 'image', media: '', tag: '', title: '', desc: '' };
            siteData.banners[1].tag = document.getElementById('edit-banner2-tag').value;
            siteData.banners[1].title = document.getElementById('edit-banner2-title').value;
            siteData.banners[1].desc = document.getElementById('edit-banner2-desc').value;
            
            let rawB2 = document.getElementById('edit-banner2-bg').value;
            siteData.banners[1].media = await processAndUploadImageIfBase64(rawB2, 'banner2');
            siteData.banners[1].type = (siteData.banners[1].media.startsWith('data:video') || siteData.banners[1].media.endsWith('.mp4')) ? 'video' : 'image';

            siteData.about.subtitle = document.getElementById('edit-about-subtitle').value;
            siteData.about.title = document.getElementById('edit-about-title').value;
            siteData.about.desc = document.getElementById('edit-about-desc').value;
            
            let rawAboutImg = document.getElementById('edit-about-img-path').value;
            siteData.about.image = await processAndUploadImageIfBase64(rawAboutImg, 'about');
            
            siteData.about.modalStory = document.getElementById('edit-story-modal-text').value;

            siteData.contactLinks.instagram = document.getElementById('link-instagram').value;
            siteData.contactLinks.tiktok = document.getElementById('link-tiktok').value;
            siteData.contactLinks.facebook = document.getElementById('link-facebook').value;
            siteData.contactLinks.telegram = document.getElementById('link-telegram').value;
            siteData.contactLinks.gmail = document.getElementById('link-gmail').value;
            siteData.contactLinks.whatsapp = document.getElementById('link-whatsapp').value;

            for (let i = 0; i < siteData.products.length; i++) {
                if (siteData.products[i].image.startsWith('data:')) {
                    siteData.products[i].image = await processAndUploadImageIfBase64(siteData.products[i].image, `prod_${siteData.products[i].id}`);
                }
            }

            saveSiteDataLocal();

            const jsonString = JSON.stringify(siteData, null, 2);
            const jsonBase64 = btoa(unescape(encodeURIComponent(jsonString)));

            await commitFileToGitHub('sitedata.json', jsonBase64, `Actualización global de sitedata.json vía CMS`);

            if (loadingOverlay) loadingOverlay.style.display = 'none';
            alert('🚀 ¡PUBLICACIÓN GLOBAL EXITOSA!\n\nLos cambios e imágenes han sido guardados en tu repositorio de GitHub. En 1-2 minutos GitHub Pages actualizará la web para todos tus clientes en el mundo.');

        } catch (error) {
            if (loadingOverlay) loadingOverlay.style.display = 'none';
            alert(`⚠️ Error al publicar en GitHub:\n${error.message}`);
        }
    });

    document.getElementById('btn-add-banner').addEventListener('click', async () => {
        const tag = document.getElementById('new-banner-tag').value || 'Colección Especial';
        const title = document.getElementById('new-banner-title').value || 'Nuevo Banner';
        const desc = document.getElementById('new-banner-desc').value || 'Descripción del nuevo banner';
        let media = document.getElementById('new-banner-media').value || 'IMG/OFERTON.png';

        const isVideo = media.startsWith('data:video') || media.endsWith('.mp4');

        siteData.banners.push({ type: isVideo ? 'video' : 'image', media, tag, title, desc });
        saveSiteDataLocal();
        renderEditorBannersList();

        document.getElementById('new-banner-tag').value = '';
        document.getElementById('new-banner-title').value = '';
        document.getElementById('new-banner-desc').value = '';
        document.getElementById('new-banner-media').value = '';

        alert('¡Nuevo banner añadido! Recuerda hacer clic en "🚀 Publicar Cambios Globales" para enviarlo a GitHub.');
    });

    document.getElementById('btn-add-product').addEventListener('click', () => {
        const brand = document.getElementById('new-prod-brand').value || 'Mitise';
        const name = document.getElementById('new-prod-name').value || 'Nuevo Perfume';
        const price = parseFloat(document.getElementById('new-prod-price').value) || 90;
        const image = document.getElementById('new-prod-img').value || 'IMG/LOGO_ENTERO.png';

        siteData.products.push({ id: Date.now(), brand, name, price, image });
        saveSiteDataLocal();
        renderEditorProductsList();
        
        document.getElementById('new-prod-brand').value = '';
        document.getElementById('new-prod-name').value = '';
        document.getElementById('new-prod-price').value = '';
        document.getElementById('new-prod-img').value = '';
        
        alert('¡Producto añadido! Recuerda hacer clic en "🚀 Publicar Cambios Globales" para guardarlo en GitHub.');
    });

    document.getElementById('btn-logout-editor').addEventListener('click', () => {
        sessionStorage.removeItem('mitise_active_editor');
        closeAllModals(true);
        alert('Sesión de editor cerrada.');
    });

    document.getElementById('close-editor-panel').addEventListener('click', () => closeAllModals(true));

    // ==========================================
    // 5. MODALES INTERACTIVOS Y MANEJO DE BOTÓN "ATRÁS"
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
        const editModalElem = document.getElementById('edit-product-modal');
        const modals = [
            storyModal, contactModal, favoritesModal, cartModal, 
            qtyModal, checkoutInfoModal, checkoutSummaryModal, 
            loginModal, editorPanel, editModalElem
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

    window.addEventListener('popstate', () => {
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
        const editModalElem = document.getElementById('edit-product-modal');
        const modals = [
            storyModal, contactModal, favoritesModal, cartModal, 
            qtyModal, checkoutInfoModal, checkoutSummaryModal, loginModal, editModalElem
        ];
        if(modals.includes(e.target)) {
            closeAllModals(true);
        }
    };

    // Cargar los datos publicados globalmente desde GitHub
    await fetchRemoteSiteData();
});
