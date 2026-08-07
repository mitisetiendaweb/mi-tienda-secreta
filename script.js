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
            modalStory: `<p>A mediados de 2011 en Puerto Rico, Mitise es bautizada bajo el concepto revelador de <strong>Mi Tienda Secreta</strong>. nació tras identificar una gran verdad del mercado: la mayoría de las personas paga sumas exorbitantes no por la esencia en sí, sino por la marca, el frasco de diseño y la publicidad, recibiendo a cambio fórmulas diluidas en alcohol que se evaporaban al cabo de unas horas.</p>\n\n<p>Frente a esta realidad, la propuesta no fue crear fragancias desde cero, sino democratizar el acceso al lujo mediante la curaduría y distribución de las mejores equivalencias olfativas. Mitise se enfocó en rastrear y seleccionar meticulosamente las mejores inspiraciones de los perfumes más codiciados del mundo, garantizando la más alta fidelidad y, sobre todo, una formulación superior a base de aceites.</p>\n\n<p>El secreto del éxito radicó en la fijación. Al prescindir del alcohol y apostar por concentrados de óleo de alta pureza, las fragancias distribuidas por Mitise no se evaporan rápidamente; penetran en la piel e interactúan con el calor corporal para ofrecer una durabilidad extraordinaria durante todo el día. El cliente descubrió que podía llevar la misma presencia, elegancia y rastro distintivo de una marca de alta gama, pero a un precio justo y accesible.</p>\n\n<p>Ese concepto de compra inteligente convirtió a la tienda en un secreto imposible de guardar. La marca dio el salto a Miami, posicionándose en el mercado estadounidense como la alternativa definitiva para quienes buscan la máxima calidad olfativa sin pagar sobreprecios innecesarios.</p>\n\n<p>Hoy, esa misma filosofía cruza el Atlántico para desembarcar en el mercado español. Mitise se presenta en España como el puente directo hacia las mejores inspiraciones en aceite del mundo: un espacio donde la altísima fijación, el rendimiento real y la honestidad en el precio se unen para redefinir la forma en que las personas disfrutan de su perfume diario.</p>`
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

    function saveSiteData() {
        localStorage.setItem('mitise_site_data', JSON.stringify(siteData));
        renderAllContent();
    }

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
    // 2. RENDERIZADO DINÁMICO DE LA WEB
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
                storyHtml = storyHtml
                    .split(/\n\s*\n/)
                    .map(para => `<p>${para.trim()}</p>`)
                    .join('');
            }
            storyBody.innerHTML = storyHtml;
        }

        // Redes
        renderContactGrid();
    }

    function renderBanners() {
        const slidesWrapper = document.getElementById('slides-wrapper');
        if(!slidesWrapper) return;
        slidesWrapper.innerHTML = '';

        siteData.banners.forEach((banner, index) => {
            const slideDiv = document.createElement('div');
            slideDiv.className = `slide slide-${index + 1} ${index === 0 ? 'active' : ''}`;
            
            let bgMedia = '';
            if(banner.media.endsWith('.mp4')) {
                bgMedia = `<video autoplay muted playsinline class="hero-bg-video"><source src="${banner.media}" type="video/mp4"></video>`;
            } else {
                bgMedia = `<img src="${banner.media}" alt="Banner ${index+1}" class="hero-bg-img">`;
            }

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
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-img-box">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='IMG/LOGO_ENTERO.png'">
                </div>
                <div class="product-details">
                    <div>
                        <p class="product-brand">${product.brand}</p>
                        <h3 class="product-name">${product.name}</h3>
                    </div>
                    <div>
                        <p class="product-price">$${Number(product.price).toFixed(2)} USD</p>
                        <button class="btn-add-cart" onclick="addToCart('${product.name}', ${product.price})">Añadir al Carrito</button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
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

            if (item.key === 'tiktok' && url !== '#') {
                if (url.startsWith('@')) url = `https://www.tiktok.com/${url}`;
                else if (!url.startsWith('http')) url = `https://www.tiktok.com/@${url}`;
            }

            if (item.key === 'instagram' && url !== '#') {
                if (url.startsWith('@')) url = `https://www.instagram.com/${url.replace('@', '')}/`;
                else if (!url.startsWith('http')) url = `https://www.instagram.com/${url}/`;
            }

            if (item.key === 'gmail') {
                const cleanEmail = url.replace('mailto:', '').replace('https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=', '').trim();
                if (isMobile) {
                    url = `mailto:${cleanEmail}`;
                } else {
                    url = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${cleanEmail}`;
                }
            }

            if (url !== '#' && !url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('mailto:')) {
                url = `https://${url}`;
            }

            const isTarget = url !== '#' && !url.startsWith('mailto:');
            
            return `
                <a href="${url}" ${isTarget ? 'target="_blank" rel="noopener noreferrer"' : 'onclick="event.preventDefault()"'} class="btn-social-gold">
                    <img src="${item.icon}" alt="${item.label}" class="btn-social-icon" onerror="this.style.display='none'">
                    <span>${item.label}</span>
                </a>
            `;
        }).join('');

        const floatWa = document.getElementById('floating-whatsapp-btn');
        if(floatWa) {
            const waUrl = links.whatsapp && links.whatsapp.trim() !== '' ? links.whatsapp : 'https://wa.me/+584242032510';
            floatWa.href = waUrl.startsWith('http') ? waUrl : `https://${waUrl}`;
        }
    }

    // ==========================================
    // 3. SLIDER INTERACTIVO INTELIGENTE
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

    // ==========================================
    // 4. AUTENTICACIÓN Y EDITOR
    // ==========================================
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
                loginModal.classList.add('active');
            }
        });
    }

    if(closeLoginModal) {
        closeLoginModal.addEventListener('click', () => loginModal.classList.remove('active'));
    }

    if(loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('login-username').value.trim().toUpperCase();
            const pass = document.getElementById('login-password').value.trim();

            if(USERS[user] && USERS[user] === pass) {
                loginErrorMsg.innerText = "";
                sessionStorage.setItem('mitise_active_editor', user);
                loginModal.classList.remove('active');
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
        editorPanel.classList.add('active');
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
        editorPanel.classList.remove('active');
        alert('Sesión de editor cerrada.');
    });

    document.getElementById('close-editor-panel').addEventListener('click', () => {
        editorPanel.classList.remove('active');
    });

    // ==========================================
    // 5. MODALES INTERACTIVOS
    // ==========================================
    const storyModal = document.getElementById('story-modal');
    const contactModal = document.getElementById('contact-modal');
    
    const navAbout = document.getElementById('nav-about');
    const navContact = document.getElementById('nav-contact');
    const btnReadStory = document.getElementById('btn-read-story');
    
    const closeStoryModal = document.getElementById('close-story-modal');
    const closeContactModal = document.getElementById('close-contact-modal');

    function openModal(modal) {
        closeAllModals();
        if(modal) modal.classList.add('active');
    }

    function closeAllModals() {
        if(storyModal) storyModal.classList.remove('active');
        if(contactModal) contactModal.classList.remove('active');
    }

    if(navAbout) navAbout.onclick = (e) => { e.preventDefault(); openModal(storyModal); };
    if(btnReadStory) btnReadStory.onclick = () => openModal(storyModal);
    if(navContact) navContact.onclick = (e) => { e.preventDefault(); openModal(contactModal); };

    if(closeStoryModal) closeStoryModal.onclick = closeAllModals;
    if(closeContactModal) closeContactModal.onclick = closeAllModals;

    renderAllContent();
});

let itemCount = 0;
let totalPrice = 0;

function addToCart(name, price) {
    itemCount++;
    totalPrice += price;
    
    document.getElementById('cart-count').innerText = itemCount;
    document.getElementById('cart-price').innerText = `$${totalPrice.toFixed(2)}`;
}
