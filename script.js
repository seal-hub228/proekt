// ========== DATA С ЛОКАЛЬНЫМИ ФОТОГРАФИЯМИ ==========
const toursData = [
    {
        id: 1,
        title: 'Обзорная экскурсия по городу',
        desc: 'Все главные достопримечательности Петербурга с остановками для фото. Исаакиевский собор, Медный всадник, Дворцовая площадь.',
        price: '11 000 ₽',
        category: 'Городские',
        image: 'images/обзор.avif'
    },
    {
        id: 2,
        title: 'Эрмитаж: шедевры мирового искусства',
        desc: 'История главной императорской резиденции и её коллекций. Зимний дворец, картины Да Винчи, Рембрандта и Тициана.',
        price: '8 000 ₽',
        category: 'Музеи',
        image: 'images/Эрмитаж.jpg'
    },
    {
        id: 3,
        title: 'Ночной Петербург на катере',
        desc: 'Романтическая прогулка по рекам и каналам с видами разводных мостов. Дворцовая набережная, Стрелка Васильевского острова.',
        price: '6 500 ₽/час',
        category: 'Водные',
        image: 'images/Ночной.webp'
    },
    {
        id: 4,
        title: 'Петергоф: фонтаны и парки',
        desc: 'Мировой шедевр дворцово-паркового искусства. Большой каскад, Самсон, Нижний парк с фонтанами.',
        price: '16 000 ₽',
        category: 'Пригороды',
        image: 'images/Петергоф.webp'
    },
    {
        id: 5,
        title: 'Царское Село (Пушкин)',
        desc: 'Екатерининский дворец, Янтарная комната, Екатерининский парк с павильонами и прудами.',
        price: '16 000 ₽',
        category: 'Пригороды',
        image: 'images/Царское.webp'
    },
    {
        id: 6,
        title: 'Кронштадт: город-крепость',
        desc: 'Путешествие на остров Котлин. Морской собор, форты, военно-морская слава России.',
        price: '16 000 ₽',
        category: 'Пригороды',
        image: 'images/i.webp'
    },
];

function createTourCard(tour) {
    const card = document.createElement('div');
    card.className = 'tour-card';
    card.dataset.id = tour.id;
    card.innerHTML = `
        <div class="tour-image">
            <img src="${tour.image}" alt="${tour.title}" loading="lazy" 
                 style="width:100%; height:100%; object-fit:cover;" 
                 onerror="this.style.display='none'; this.parentNode.innerHTML='✦'">
        </div>
        <div class="tour-content">
            <h3 class="tour-title">${tour.title}</h3>
            <p class="tour-desc">${tour.desc}</p>
            <div class="tour-meta">
                <span class="tour-price">${tour.price}</span>
                <span class="tour-category">${tour.category}</span>
            </div>
        </div>
    `;
    return card;
}

// ========== CATALOG LOGIC ==========
let currentCount = 0;
const loadStep = 2;
let catalogContainer = document.getElementById('catalogGrid');
let loadMoreBtn = document.getElementById('loadMoreBtn');

function renderCatalog(container, data, count) {
    const itemsToShow = data.slice(0, count);
    container.innerHTML = '';
    itemsToShow.forEach(tour => {
        container.appendChild(createTourCard(tour));
    });
}

function loadMore() {
    if (!catalogContainer) return;
    const total = toursData.length;
    const nextCount = Math.min(currentCount + loadStep, total);
    renderCatalog(catalogContainer, toursData, nextCount);
    currentCount = nextCount;
    if (loadMoreBtn && currentCount >= total) {
        loadMoreBtn.style.display = 'none';
    }
}

function initCatalog() {
    if (catalogContainer) {
        currentCount = Math.min(loadStep, toursData.length);
        renderCatalog(catalogContainer, toursData, currentCount);
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', loadMore);
            if (currentCount >= toursData.length) {
                loadMoreBtn.style.display = 'none';
            }
        }
    }
}

function initFeatured() {
    const featuredGrid = document.getElementById('featuredGrid');
    if (!featuredGrid) return;
    const featuredCount = 4;
    const featuredData = toursData.slice(0, featuredCount);
    featuredData.forEach(tour => {
        featuredGrid.appendChild(createTourCard(tour));
    });
}

// ========== THEME TOGGLE ==========
const themeToggleBtn = document.getElementById('themeToggle');
const themeIcon = themeToggleBtn?.querySelector('.theme-icon');

function setTheme(theme) {
    if (!themeToggleBtn) return;
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeIcon) themeIcon.textContent = '🌙';
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
        if (themeIcon) themeIcon.textContent = '☀️';
        localStorage.setItem('theme', 'light');
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
}

// ========== MOBILE MENU ==========
const mobileBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');
if (mobileBtn && mobileNav) {
    mobileBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('open');
    });
    mobileNav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('open');
        });
    });
}

// ========== CONTACT FORM ==========
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm(name, email, message) {
    const errors = [];
    if (name.trim().length < 2) errors.push('Имя должно содержать минимум 2 символа.');
    if (!validateEmail(email)) errors.push('Введите корректный email адрес.');
    if (message.trim().length < 5) errors.push('Сообщение должно содержать минимум 5 символов.');
    return errors;
}

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        const errors = validateForm(name, email, message);

        if (errors.length > 0) {
            formStatus.textContent = '❌ ' + errors.join(' ');
            formStatus.className = 'form-status error';
            return;
        }

        const formData = {
            name: name,
            email: email,
            message: message
        };
        console.log('📩 Данные формы:', formData);

        formStatus.textContent = '✅ Ваша заявка отправлена! Мы свяжемся с вами в ближайшее время.';
        formStatus.className = 'form-status success';
        contactForm.reset();

        setTimeout(() => {
            formStatus.textContent = '';
            formStatus.className = 'form-status';
        }, 5000);
    });
}

// ========== ANIMATED COUNTERS ==========
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                const duration = 1500;
                const startTime = performance.now();

                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const current = Math.floor(progress * target);
                    el.textContent = current;

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        el.textContent = target;
                    }
                }
                requestAnimationFrame(updateCounter);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        setTheme('dark');
    }

    initCatalog();
    initFeatured();
    animateCounters();

    document.querySelectorAll('.tour-image img').forEach(img => {
        img.onerror = function() {
            this.style.display = 'none';
            const placeholder = document.createElement('span');
            placeholder.textContent = '✦';
            placeholder.style.fontSize = '3rem';
            placeholder.style.color = 'var(--accent-color)';
            placeholder.style.display = 'flex';
            placeholder.style.alignItems = 'center';
            placeholder.style.justifyContent = 'center';
            placeholder.style.height = '100%';
            this.parentNode.appendChild(placeholder);
        };
    });
});
