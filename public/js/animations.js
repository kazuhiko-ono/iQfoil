// Advanced animations and visual effects for Yuki Sunaga's website

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Animation utilities
    const AnimationUtils = {
        // Easing functions
        easing: {
            easeOutCubic: t => 1 - Math.pow(1 - t, 3),
            easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
            easeOutQuart: t => 1 - Math.pow(1 - t, 4),
            easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2
        },

        // Animate a value over time
        animate: function(start, end, duration, easingFn, callback) {
            const startTime = performance.now();
            const change = end - start;

            function step(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easingFn(progress);
                const currentValue = start + (change * easedProgress);

                callback(currentValue);

                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            }

            requestAnimationFrame(step);
        },

        // Check if element is in viewport
        isInViewport: function(element, threshold = 0.1) {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            const windowWidth = window.innerWidth || document.documentElement.clientWidth;

            const verticalInView = (rect.top <= windowHeight * (1 - threshold)) && ((rect.top + rect.height) >= (windowHeight * threshold));
            const horizontalInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);

            return verticalInView && horizontalInView;
        }
    };

    // Counter animation for statistics
    function initCounterAnimations() {
        const counters = document.querySelectorAll('[data-count]');

        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    animateCounter(entry.target);
                }
            });
        }, observerOptions);

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });

        function animateCounter(element) {
            const target = parseInt(element.getAttribute('data-count'));
            const duration = 2000;
            const start = 0;

            AnimationUtils.animate(start, target, duration, AnimationUtils.easing.easeOutCubic, function(currentValue) {
                element.textContent = Math.floor(currentValue).toLocaleString();
            });
        }
    }

    // Text reveal animation
    function initTextRevealAnimations() {
        const textElements = document.querySelectorAll('.hero-title, .section-title, .achievement-title');

        textElements.forEach(element => {
            const text = element.textContent;
            element.innerHTML = '';

            // Split text into spans for each character
            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.cssText = `
                    display: inline-block;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 0.4s ease;
                    transition-delay: ${i * 0.02}s;
                `;
                element.appendChild(span);
            }
        });

        const textObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const spans = entry.target.querySelectorAll('span');
                    spans.forEach(span => {
                        span.style.opacity = '1';
                        span.style.transform = 'translateY(0)';
                    });
                }
            });
        }, { threshold: 0.5 });

        textElements.forEach(element => {
            textObserver.observe(element);
        });
    }

    // Wave animation for hero section
    function initWaveAnimation() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        // Create wave SVG overlay
        const waveContainer = document.createElement('div');
        waveContainer.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100px;
            overflow: hidden;
            z-index: 1;
            pointer-events: none;
        `;

        const waveSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        waveSVG.setAttribute('width', '100%');
        waveSVG.setAttribute('height', '100%');
        waveSVG.setAttribute('viewBox', '0 0 1200 120');
        waveSVG.setAttribute('preserveAspectRatio', 'none');

        const wavePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        wavePath.setAttribute('d', 'M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z');
        wavePath.setAttribute('fill', 'rgba(255,255,255,0.1)');

        const animateTag = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform');
        animateTag.setAttribute('attributeName', 'transform');
        animateTag.setAttribute('attributeType', 'XML');
        animateTag.setAttribute('type', 'translate');
        animateTag.setAttribute('values', '0 0; 50 0; 0 0');
        animateTag.setAttribute('dur', '8s');
        animateTag.setAttribute('repeatCount', 'indefinite');

        wavePath.appendChild(animateTag);
        waveSVG.appendChild(wavePath);
        waveContainer.appendChild(waveSVG);
        hero.appendChild(waveContainer);
    }

    // Floating elements animation
    function initFloatingElements() {
        const floatingElements = document.querySelectorAll('.achievement-card, .value-card');

        floatingElements.forEach((element, index) => {
            const delay = index * 0.2;
            const duration = 3 + (index % 3);

            element.style.cssText += `
                animation: float ${duration}s ease-in-out ${delay}s infinite;
            `;
        });

        // Add CSS keyframes for floating animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                25% { transform: translateY(-10px) rotate(0.5deg); }
                50% { transform: translateY(-5px) rotate(0deg); }
                75% { transform: translateY(-15px) rotate(-0.5deg); }
            }
        `;
        document.head.appendChild(style);
    }

    // Particle system for background
    function initParticleSystem() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            opacity: 0.3;
        `;

        function resizeCanvas() {
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const particles = [];
        const particleCount = window.innerWidth > 768 ? 50 : 25;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() * 0.5) - 0.25;
                this.speedY = (Math.random() * 0.5) - 0.25;
                this.opacity = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Wrap around edges
                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }

            draw() {
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            // Draw connections between nearby particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.globalAlpha = (100 - distance) / 100 * 0.2;
                        ctx.strokeStyle = '#ffffff';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animate);
        }

        animate();
        hero.appendChild(canvas);
    }

    // Scroll-triggered animations
    function initScrollTriggerAnimations() {
        const elements = document.querySelectorAll('.profile-image, .sport-image, .olympic-image');

        const scrollObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'slideInScale 0.8s ease-out forwards';
                }
            });
        }, { threshold: 0.3 });

        elements.forEach(element => {
            scrollObserver.observe(element);
        });

        // Add CSS keyframes for slide in scale animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInScale {
                0% {
                    opacity: 0;
                    transform: translateY(50px) scale(0.8);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Typing animation for hero subtitle
    function initTypingAnimation() {
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (!heroSubtitle) return;

        const originalText = heroSubtitle.textContent;
        heroSubtitle.textContent = '';

        let charIndex = 0;

        function typeCharacter() {
            if (charIndex < originalText.length) {
                heroSubtitle.textContent += originalText.charAt(charIndex);
                charIndex++;
                setTimeout(typeCharacter, 50);
            }
        }

        // Start typing animation after a delay
        setTimeout(typeCharacter, 1500);
    }

    // Button hover effects
    function initButtonEffects() {
        const buttons = document.querySelectorAll('.cta-button, .submit-button');

        buttons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.animation = 'buttonPulse 0.6s ease-out';
            });

            button.addEventListener('animationend', function() {
                this.style.animation = '';
            });
        });

        // Add CSS keyframes for button pulse animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes buttonPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }

    // Gallery hover effects
    function initGalleryEffects() {
        const galleryItems = document.querySelectorAll('.gallery-item');

        galleryItems.forEach(item => {
            const image = item.querySelector('.gallery-image');
            const overlay = item.querySelector('.gallery-overlay');

            item.addEventListener('mouseenter', function() {
                if (image) {
                    image.style.filter = 'brightness(1.1) saturate(1.2)';
                }
            });

            item.addEventListener('mouseleave', function() {
                if (image) {
                    image.style.filter = 'brightness(1) saturate(1)';
                }
            });
        });
    }

    // Performance monitoring
    function initPerformanceMonitoring() {
        let frameCount = 0;
        let lastTime = performance.now();

        function measureFPS() {
            frameCount++;
            const currentTime = performance.now();

            if (currentTime - lastTime >= 1000) {
                const fps = frameCount;
                frameCount = 0;
                lastTime = currentTime;

                // Log performance warnings if FPS drops below 30
                if (fps < 30) {
                    console.warn('Performance warning: FPS dropped to', fps);
                }
            }

            requestAnimationFrame(measureFPS);
        }

        if (window.location.hostname !== 'localhost') {
            // Only monitor in production
            measureFPS();
        }
    }

    // Initialize all animations
    function initAnimations() {
        // Only initialize complex animations on devices that can handle them
        const hasGoodPerformance = window.innerWidth > 768 &&
                                   !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        initCounterAnimations();
        initScrollTriggerAnimations();
        initButtonEffects();
        initGalleryEffects();

        if (hasGoodPerformance) {
            initTextRevealAnimations();
            initWaveAnimation();
            initFloatingElements();
            initParticleSystem();
            initTypingAnimation();
            initPerformanceMonitoring();
        }
    }

    // Initialize animations after a short delay to ensure DOM is ready
    setTimeout(initAnimations, 100);

    // Reduce animations on mobile for better performance
    if (window.innerWidth <= 768) {
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.3s !important;
                transition-duration: 0.3s !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Pause animations when tab is not visible
    document.addEventListener('visibilitychange', function() {
        const isVisible = !document.hidden;
        const animatedElements = document.querySelectorAll('[style*="animation"]');

        animatedElements.forEach(element => {
            element.style.animationPlayState = isVisible ? 'running' : 'paused';
        });
    });
});