// Language System
class LanguageManager {
    constructor() {
        this.currentLang = 'pt';
        this.init();
    }

    init() {
        this.bindEvents();
        this.setLanguage(this.currentLang);
    }

    bindEvents() {
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                this.setLanguage(lang);
            });
        });
    }

    setLanguage(lang) {
        this.currentLang = lang;
        
        // Update button states
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Update text content
        document.querySelectorAll('[data-pt][data-en]').forEach(element => {
            const text = element.getAttribute(`data-${lang}`);
            if (text) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = text;
                } else {
                    element.textContent = text;
                }
            }
        });

        // Update labels
        document.querySelectorAll('label[data-pt][data-en]').forEach(label => {
            const text = label.getAttribute(`data-${lang}`);
            if (text) {
                label.textContent = text;
            }
        });

        // Store preference
        localStorage.setItem('preferredLanguage', lang);
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupScrollEffects();
        this.setupParallax();
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, options);

        // Observe elements for animation
        const animateElements = document.querySelectorAll(
            '.section-header, .about-text, .about-image, .service-card, .process-step, .project-card, .contact-form, .contact-info'
        );

        animateElements.forEach(el => {
            observer.observe(el);
        });
    }

    setupScrollEffects() {
        let ticking = false;

        const updateScrollEffects = () => {
            const scrollY = window.pageYOffset;
            
            // Header background opacity
            const header = document.querySelector('.header');
            if (scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Parallax effect for hero
            const hero = document.querySelector('.hero-background img');
            if (hero) {
                const speed = scrollY * 0.5;
                hero.style.transform = `translateY(${speed}px)`;
            }

            // Progress indicator (optional)
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            
            // You can add a progress bar here if needed
            
            ticking = false;
        };

        const requestScrollUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestScrollUpdate);
    }

    setupParallax() {
        const parallaxElements = document.querySelectorAll('.hero-background img');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            parallaxElements.forEach(element => {
                element.style.transform = `translateY(${rate}px)`;
            });
        });
    }
}

// Mobile Navigation
class MobileNavigation {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        this.createMobileMenu();
        this.bindEvents();
    }

    createMobileMenu() {
        const nav = document.querySelector('.nav');
        const mobileNav = nav.cloneNode(true);
        mobileNav.classList.add('mobile-nav');
        
        const mobileMenuContainer = document.createElement('div');
        mobileMenuContainer.classList.add('mobile-menu');
        mobileMenuContainer.appendChild(mobileNav);
        
        document.body.appendChild(mobileMenuContainer);
    }

    bindEvents() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileLinks = document.querySelectorAll('.mobile-nav .nav-link');

        toggle.addEventListener('click', () => {
            this.toggleMenu();
        });

        // Close menu when clicking on links
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!toggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.isOpen = !this.isOpen;
        const mobileMenu = document.querySelector('.mobile-menu');
        const toggle = document.querySelector('.mobile-menu-toggle');
        
        mobileMenu.classList.toggle('active', this.isOpen);
        toggle.classList.toggle('active', this.isOpen);
        document.body.classList.toggle('menu-open', this.isOpen);
    }

    closeMenu() {
        this.isOpen = false;
        const mobileMenu = document.querySelector('.mobile-menu');
        const toggle = document.querySelector('.mobile-menu-toggle');
        
        mobileMenu.classList.remove('active');
        toggle.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
}

// Smooth Scrolling
class SmoothScrolling {
    constructor() {
        this.init();
    }

    init() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Form Handler
class FormHandler {
    constructor() {
        this.init();
    }

    init() {
        const form = document.getElementById('contactForm');
        if (form) {
            form.addEventListener('submit', this.handleSubmit.bind(this));
        }

        // Add floating label effect
        this.setupFloatingLabels();
    }

    setupFloatingLabels() {
        const formGroups = document.querySelectorAll('.form-group');
        
        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea');
            const label = group.querySelector('label');
            
            if (input && label) {
                input.addEventListener('focus', () => {
                    group.classList.add('focused');
                });
                
                input.addEventListener('blur', () => {
                    if (!input.value) {
                        group.classList.remove('focused');
                    }
                });
                
                // Check if input has value on load
                if (input.value) {
                    group.classList.add('focused');
                }
            }
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const submitBtn = form.querySelector('.submit-btn');
        
        // Show loading state
        const originalText = submitBtn.textContent;
        submitBtn.textContent = this.getCurrentLang() === 'pt' ? 'Enviando...' : 'Sending...';
        submitBtn.disabled = true;
        
        try {
            // Here you would typically send the form data to your server
            // For now, we'll simulate a successful submission
            await this.simulateFormSubmission(formData);
            
            // Show success message
            this.showMessage(
                this.getCurrentLang() === 'pt' 
                    ? 'Mensagem enviada com sucesso!' 
                    : 'Message sent successfully!',
                'success'
            );
            
            form.reset();
            
        } catch (error) {
            // Show error message
            this.showMessage(
                this.getCurrentLang() === 'pt' 
                    ? 'Erro ao enviar mensagem. Tente novamente.' 
                    : 'Error sending message. Please try again.',
                'error'
            );
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    simulateFormSubmission(formData) {
        return new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
    }

    showMessage(text, type) {
        const message = document.createElement('div');
        message.className = `form-message ${type}`;
        message.textContent = text;
        
        const form = document.getElementById('contactForm');
        form.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }

    getCurrentLang() {
        return document.querySelector('.lang-btn.active')?.dataset.lang || 'pt';
    }
}

// Loading Animation
class LoadingAnimation {
    constructor() {
        this.init();
    }

    init() {
        // Create loading screen
        this.createLoadingScreen();
        
        // Remove loading screen when page is loaded
        window.addEventListener('load', () => {
            this.hideLoadingScreen();
        });
    }

    createLoadingScreen() {
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-logo">
                    <img src="assets/images/logo.png" alt="Lot Vision Studio">
                </div>
                <div class="loader-spinner"></div>
            </div>
        `;
        
        document.body.appendChild(loader);
    }

    hideLoadingScreen() {
        const loader = document.querySelector('.page-loader');
        if (loader) {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.remove();
            }, 500);
        }
    }
}

// Cursor Effects (for desktop)
class CursorEffects {
    constructor() {
        this.init();
    }

    init() {
        if (window.innerWidth > 768) {
            this.createCustomCursor();
            this.bindCursorEvents();
        }
    }

    createCustomCursor() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);

        const cursorDot = document.createElement('div');
        cursorDot.className = 'cursor-dot';
        document.body.appendChild(cursorDot);
    }

    bindCursorEvents() {
        const cursor = document.querySelector('.custom-cursor');
        const cursorDot = document.querySelector('.cursor-dot');
        
        if (!cursor || !cursorDot) return;

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top = e.clientY + 'px';
        });

        // Add hover effects
        const hoverElements = document.querySelectorAll('a, button, .service-card, .project-card');
        
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
            });
        });
    }
}

// Performance Optimization
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.optimizeScrollEvents();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    optimizeScrollEvents() {
        let ticking = false;
        
        const optimizedScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Scroll-dependent operations here
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', optimizedScroll, { passive: true });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new LanguageManager();
    new ScrollAnimations();
    new MobileNavigation();
    new SmoothScrolling();
    new FormHandler();
    new LoadingAnimation();
    new CursorEffects();
    new PerformanceOptimizer();

    // Add some additional interactive effects
    initializeInteractiveEffects();
});

// Additional Interactive Effects
function initializeInteractiveEffects() {
    // Typing effect for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.cta-button, .submit-btn');
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });

    // Service cards tilt effect
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', handleCardTilt);
        card.addEventListener('mouseleave', resetCardTilt);
    });
}

function createRipple(e) {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function handleCardTilt(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
}

function resetCardTilt(e) {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar panorama 360
    initPanorama360();
    
    // Configurar interatividade dos itens de serviço
    setupServiceItemsInteractivity();
    
    // Configurar animações de entrada
    setupScrollAnimations();
});

// Função para inicializar o panorama 360º
function initPanorama360() {
    if (typeof pannellum !== 'undefined') {
        try {
            pannellum.viewer('panorama-360', {
                "type": "equirectangular",
                "panorama": "assets/images/360_interior.jpg",
                "autoLoad": true,
                "autoRotate": -2,
                "showControls": true,
                "showZoomCtrl": true,
                "showFullscreenCtrl": true,
                "hfov": 110,
                "pitch": 10,
                "yaw": 180
            });
        } catch (error) {
            console.log('Erro ao carregar panorama 360:', error);
        }
    }
}

// Função para configurar interatividade dos itens de serviço
function setupServiceItemsInteractivity() {
    const serviceItems = document.querySelectorAll('.service-item');
    
    serviceItems.forEach(item => {
        // Efeito hover com mouse
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Efeito para dispositivos touch
        item.addEventListener('touchstart', function() {
            this.style.transform = 'translateY(-5px) scale(1.01)';
        });
        
        item.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = 'translateY(0) scale(1)';
            }, 200);
        });
    });
}

// Função para configurar animações de scroll
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar todos os itens de serviço
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach((item, index) => {
        // Configurar estado inicial
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `all 0.6s ease ${index * 0.1}s`; // Delay escalonado
        
        observer.observe(item);
    });
}

// Função para lazy loading de vídeos
function setupVideoLazyLoading() {
    const videos = document.querySelectorAll('video');
    
    const videoObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                if (video.paused) {
                    video.play().catch(error => {
                        console.log('Erro ao reproduzir vídeo:', error);
                    });
                }
                videoObserver.unobserve(video);
            }
        });
    });
    
    videos.forEach(video => {
        videoObserver.observe(video);
    });
}

// Função para otimizar performance do model-viewer
function optimizeModelViewer() {
    const modelViewers = document.querySelectorAll('model-viewer');
    
    modelViewers.forEach(viewer => {
        viewer.addEventListener('load', function() {
            console.log('Modelo 3D carregado com sucesso');
        });
        
        viewer.addEventListener('error', function(error) {
            console.log('Erro ao carregar modelo 3D:', error);
        });
    });
}

// Função para redimensionar elementos quando a janela mudar de tamanho
function handleWindowResize() {
    window.addEventListener('resize', function() {
        // Reajustar panorama se necessário
        if (window.innerWidth <= 768) {
            // Ajustes para mobile
            const panorama = document.getElementById('panorama-360');
            if (panorama) {
                panorama.style.height = '250px';
            }
        }
    });
}

// Inicializar outras funcionalidades quando necessário
setTimeout(() => {
    setupVideoLazyLoading();
    optimizeModelViewer();
    handleWindowResize();
}, 1000);

// Função para debugging (pode ser removida em produção)
function debugInfo() {
    console.log('Seção de Serviços - Lot Vision Studio carregada');
    console.log('Pannellum disponível:', typeof pannellum !== 'undefined');
    console.log('Model Viewer disponível:', customElements.get('model-viewer') !== undefined);
}