import { graduationData } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    renderData();
    initCountdown();
    initScrollReveal();
    initMusic();
    initLightbox();
    initParticles();
    initHeroEffects();
    initSecurity();
    // Parallax initialization is done directly if window.simpleParallax is available (disabled on mobile for layout stability)
    if (typeof simpleParallax !== 'undefined' && window.innerWidth > 768) {
        const images = document.querySelectorAll('.thumbnail');
        new simpleParallax(images, {
            scale: 1.2,
            delay: 0.6,
            transition: 'cubic-bezier(0,0,0,1)'
        });
    }
}

// ============================================================
// Golden Particles System
// ============================================================
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 35;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.3 - 0.2;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.fadeSpeed = Math.random() * 0.008 + 0.002;
            this.growing = Math.random() > 0.5;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.growing) {
                this.opacity += this.fadeSpeed;
                if (this.opacity >= 0.6) this.growing = false;
            } else {
                this.opacity -= this.fadeSpeed;
                if (this.opacity <= 0) this.reset();
            }
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
            ctx.fill();
            // Glow effect
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity * 0.2})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

function renderData() {
    // Textos generales
    document.getElementById('generation-text').textContent = graduationData.generacion;
    document.getElementById('career-text').textContent = graduationData.carrera;
    
    // Message with word-by-word animation
    const messageEl = document.getElementById('main-message');
    const words = graduationData.mensajePrincipal.split(' ');
    messageEl.innerHTML = words.map(word => `<span class="word">${word}</span>`).join('');
    
    // Observe the message card to trigger word animation
    const messageCard = messageEl.closest('.mensaje-card');
    const wordObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const wordSpans = messageEl.querySelectorAll('.word');
                wordSpans.forEach((span, i) => {
                    setTimeout(() => {
                        span.classList.add('visible');
                    }, i * 60); // 60ms stagger per word
                });
                wordObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    wordObserver.observe(messageCard);
    
    // Frase motivacional aleatoria
    const randomFrase = graduationData.frasesMotivacionales[Math.floor(Math.random() * graduationData.frasesMotivacionales.length)];
    document.getElementById('frase-text').textContent = randomFrase;

    // Asesores
    const asesoresContainer = document.getElementById('asesores-list');
    graduationData.asesores.forEach(asesor => {
        const li = document.createElement('li');
        li.className = 'asesor-item reveal';
        li.innerHTML = `
            <div class="asesor-icons">
                <div class="asesor-icon-badge" title="Docente / Asesor Académico">
                    <svg class="asesor-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                    </svg>
                </div>
                <div class="asesor-icon-badge" title="Contador Público">
                    <svg class="asesor-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
                        <line x1="8" y1="6" x2="16" y2="6"/>
                        <line x1="16" y1="14" x2="16" y2="18"/>
                        <line x1="8" y1="10" x2="8" y2="10"/>
                        <line x1="12" y1="10" x2="12" y2="10"/>
                        <line x1="16" y1="10" x2="16" y2="10"/>
                        <line x1="8" y1="14" x2="8" y2="14"/>
                        <line x1="12" y1="14" x2="12" y2="14"/>
                        <line x1="8" y1="18" x2="8" y2="18"/>
                        <line x1="12" y1="18" x2="12" y2="18"/>
                    </svg>
                </div>
            </div>
            <span class="asesor-name">${asesor}</span>
        `;
        asesoresContainer.appendChild(li);
    });

    // Alumnos
    const alumnosContainer = document.getElementById('alumnos-grid');
    graduationData.alumnos.forEach(alumno => {
        const div = document.createElement('div');
        div.className = 'alumno-card reveal';
        div.innerHTML = `
            <span class="alumno-folio">#${alumno.folio}</span>
            <div class="alumno-icon">
                <svg class="alumno-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
                </svg>
            </div>
            <div class="alumno-name">${alumno.nombre}</div>
        `;
        alumnosContainer.appendChild(div);
    });

    // Detalles Evento
    document.getElementById('event-place').textContent = graduationData.lugar;
    
    // Mapa
    document.getElementById('map-iframe').src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15197.882194939763!2d-95.22238472856272!3d18.441865955611107!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85e62f01f0535ba3%3A0x7d6c6e736a6e7c10!2sTeatro%20De%20La%20Ciudad%20San%20Andres%20Tuxtla!5e0!3m2!1ses!2smx!4v1700000000000!5m2!1ses!2smx"; // Fallback visual ya que el url de maps provisto necesita ser embed
}

function initCountdown() {
    if (!graduationData.fechaEvento) {
        document.getElementById("countdown").innerHTML = "<div class='hero-date' style='margin-top: 1rem;'>Próximamente</div>";
        return;
    }

    const countDownDate = new Date(graduationData.fechaEvento).getTime();
    
    // Si la fecha es inválida
    if (isNaN(countDownDate)) {
        document.getElementById("countdown").innerHTML = "<div class='hero-date' style='margin-top: 1rem;'>Próximamente</div>";
        return;
    }
    
    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = countDownDate - now;

        if (distance < 0) {
            document.getElementById("countdown").innerHTML = "<div class='hero-date' style='margin-top: 1rem;'>¡El día ha llegado!</div>";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("cd-days").textContent = days.toString().padStart(2, '0');
        document.getElementById("cd-hours").textContent = hours.toString().padStart(2, '0');
        document.getElementById("cd-minutes").textContent = minutes.toString().padStart(2, '0');
        document.getElementById("cd-seconds").textContent = seconds.toString().padStart(2, '0');
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function initScrollReveal() {
    // Si prefiere animación reducida, no inicializar
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => el.classList.add('active'));
        document.querySelectorAll('.section-title').forEach(el => el.classList.add('active'));
        return;
    }

    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Solo animar la primera vez
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

    // Also observe section titles for the expanding underline
    const titles = document.querySelectorAll('.section-title');
    const titleObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    titles.forEach(title => {
        titleObserver.observe(title);
    });
}

function initMusic() {
    const audio = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-btn');
    let isPlaying = false;

    if (!audio || !musicBtn) return;

    // Set correct source
    audio.src = 'assets/music/244. Graduation.mp3';

    function playMusic() {
        if (isPlaying) return;
        audio.play().then(() => {
            musicBtn.classList.add('playing');
            isPlaying = true;
            removeInteractionListeners();
        }).catch(e => {
            console.log("Autoplay blocked or failed:", e);
        });
    }

    function toggleMusic() {
        if (isPlaying) {
            audio.pause();
            musicBtn.classList.remove('playing');
            isPlaying = false;
        } else {
            audio.play().then(() => {
                musicBtn.classList.add('playing');
                isPlaying = true;
            }).catch(e => console.log("Audio play failed:", e));
        }
    }

    musicBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que el click en el botón active el listener general
        toggleMusic();
    });

    // Escuchar cualquier interacción para reproducir música (burlar bloqueos de autoplay)
    const events = ['click', 'touchstart', 'scroll', 'mousemove', 'keydown'];
    
    function handleInteraction() {
        playMusic();
    }

    events.forEach(event => {
        document.addEventListener(event, handleInteraction, { passive: true });
    });

    function removeInteractionListeners() {
        events.forEach(event => {
            document.removeEventListener(event, handleInteraction);
        });
    }
}

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    const galleryItems = document.querySelectorAll('.galeria-item');
    
    if (!lightbox || galleryItems.length === 0) return;

    const images = Array.from(galleryItems).map(item => item.querySelector('.galeria-img').src);
    let currentIndex = 0;

    function openLightbox(index) {
        currentIndex = index;
        lightboxImg.src = images[currentIndex];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        lightboxImg.src = images[currentIndex];
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % images.length;
        lightboxImg.src = images[currentIndex];
    }

    galleryItems.forEach((item, index) => {
        item.querySelector('.galeria-img-wrapper').addEventListener('click', () => openLightbox(index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });
}

function initHeroEffects() {
    // Scroll-linked Parallax for floating stars & scroll indicator fade-out
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Translate floating background elements at different speeds
        const decos = document.querySelectorAll('.hero-deco');
        decos.forEach((deco, index) => {
            const speed = (index + 1) * 0.15 + 0.1;
            deco.style.transform = `translateY(${scrollY * speed}px)`;
        });

        // Translate the hero content slightly on scroll for advanced parallax depth
        const wrapper = document.querySelector('.hero-content-wrapper');
        if (wrapper && scrollY < window.innerHeight) {
            wrapper.style.transform = `translateY(${scrollY * 0.15}px)`;
            wrapper.style.opacity = `${1 - (scrollY / (window.innerHeight * 0.85))}`;
        }

        // Fade scroll indicator
        const indicator = document.querySelector('.scroll-indicator');
        if (indicator) {
            if (scrollY > 50) {
                indicator.style.opacity = '0';
                indicator.style.transform = 'translate(-50%, 15px)';
            } else {
                indicator.style.opacity = '1';
                indicator.style.transform = 'translate(-50%, 0)';
            }
        }
    });
}

function initSecurity() {
    // Deshabilitar clic derecho
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    // Deshabilitar arrastre de imágenes
    document.addEventListener('dragstart', (e) => {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
        }
    });

    // Deshabilitar atajos de teclado para inspeccionar código o guardar
    document.addEventListener('keydown', (e) => {
        // F12
        if (e.key === 'F12') {
            e.preventDefault();
            return false;
        }
        
        // Ctrl/Cmd + Shift + I/J/C
        // Ctrl/Cmd + U (Ver código)
        // Ctrl/Cmd + S (Guardar)
        const isCmdOrCtrl = e.ctrlKey || e.metaKey;
        if (isCmdOrCtrl && (
            e.key === 'u' || 
            e.key === 'U' || 
            e.key === 's' || 
            e.key === 'S' ||
            (e.shiftKey && (e.key === 'i' || e.key === 'I' || e.key === 'j' || e.key === 'J' || e.key === 'c' || e.key === 'C'))
        )) {
            e.preventDefault();
            return false;
        }
    });
}

