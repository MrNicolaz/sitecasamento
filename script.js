// script.js (Versão Final com Correções e Fuso Horário)

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin); 

// === DEFINIÇÃO DA CLASSE PARTICLE ===
class Particle {
    constructor(canvas, ctx) { // Adiciona canvas e ctx como parâmetros
        this.canvas = canvas;
        this.ctx = ctx;
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.size = Math.random() * 1.5 + 0.5; 
        this.speedX = (Math.random() - 0.5) * 0.5; 
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.8 + 0.2; 
        this.color = `rgba(255, 255, 200, ${this.opacity})`;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Inverte a direção se a partícula atingir as bordas
        if (this.x < 0 || this.x > this.canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > this.canvas.height) this.speedY *= -1;

        // Variação sutil na opacidade
        this.opacity += (Math.random() - 0.5) * 0.02;
        if (this.opacity > 0.8) this.opacity = 0.8;
        if (this.opacity < 0.2) this.opacity = 0.2;
        this.color = `rgba(255, 255, 200, ${this.opacity})`;
    }
    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.shadowColor = 'rgba(255, 255, 200, 0.8)';
        this.ctx.shadowBlur = 5; 
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fill();
    }
}
// === FIM DA DEFINIÇÃO DA CLASSE PARTICLE ===


document.addEventListener('DOMContentLoaded', () => {

    // --- Efeito de Partículas Brilhantes no Hero (Canvas) ---
    const heroSection = document.querySelector('.hero');
    if (heroSection) { 
        let canvas = document.getElementById('particle-canvas');
        if (!canvas) { // Cria o canvas se ele ainda não existe (como fallback)
            canvas = document.createElement('canvas');
            canvas.id = 'particle-canvas';
            heroSection.prepend(canvas);
        }

        const ctx = canvas.getContext('2d');
        let particles = [];
        const numParticles = 80; 
        let animationFrameId;

        function resizeCanvas() {
            if (!canvas || !heroSection || !ctx) return; 
            canvas.width = heroSection.offsetWidth;
            canvas.height = heroSection.offsetHeight;
            particles = []; 
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle(canvas, ctx)); // Passa canvas e ctx para o construtor da Particle
            }
        }

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resizeCanvas, 250); 
        });
        resizeCanvas(); 

        function animateParticles() {
            if (!ctx) return; 
            ctx.clearRect(0, 0, canvas.width, canvas.height); 
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            animationFrameId = requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }


    // --- ANIMAÇÕES DA SEÇÃO HERO (AJUSTADAS PARA OS NOVOS SELECTORES) ---
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroDate = document.querySelector('.hero-date');
    const heroContent = document.querySelector('.hero-content'); // A caixa com o versículo e o botão
    const customNavbar = document.querySelector('.custom-navbar');

    if (heroTitle && heroSubtitle && heroDate && heroContent && customNavbar) {
        const masterTimeline = gsap.timeline({ defaults: { ease: "power2.out" } });

        masterTimeline
            // Animação inicial para os elementos do Hero (título, subtítulo, data)
            .fromTo(heroTitle, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.2, delay: 0.5 })
            .fromTo(heroSubtitle, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, delay: -0.8 }, "<") // Inicia antes do título terminar
            .fromTo(heroDate, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, delay: -0.7 }, "<") // Inicia antes do subtítulo terminar

            // Animação para a caixa de conteúdo (versículo e botão)
            .fromTo(heroContent, 
                { opacity: 0, y: 50, scale: 0.95 }, 
                { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: "power3.out" }, "-=0.5" // Começa um pouco antes do fim da animação da data
            )
            // Animação dos elementos DENTRO da caixa de conteúdo (versículo e referência)
            .from(".hero-content .verse-text-hero", { y: "20%", opacity: 0, duration: 1 }, "<0.3") 
            .from(".hero-content .verse-reference-hero", { y: "20%", opacity: 0, duration: 1 }, "<0.4")
            .from(".hero-content .btn", { y: "10%", opacity: 0, duration: 1 }, "<0.5")

            // Animação para a Navbar
            .fromTo(customNavbar, { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.8"); // Começa junto com o botão

        // Efeito de brilho pulsante no título principal do Hero (seletor corrigido)
        gsap.to(heroTitle, {
            duration: 1.5,
            textShadow: "0 0 10px #fff, 0 0 20px var(--accent-color)",
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
            delay: masterTimeline.duration() // Inicia após a timeline principal do Hero
        });
    }

    // --- Efeito de Brilho no Hero (Overlay Dourado) - Se existir no HTML ---
    const heroOverlayShine = document.querySelector(".hero-overlay-shine");
    if (heroOverlayShine) {
        gsap.to(heroOverlayShine, {
            x: "100%",
            duration: 2.5,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true,
            delay: 2.5 
        });
    }

    // --- Efeito Parallax na Imagem de Fundo do Hero ---
    if (heroSection) { 
        gsap.to(heroSection, {
            backgroundPositionY: "20%", 
            ease: "none",
            scrollTrigger: {
                trigger: heroSection,
                start: "top top",
                end: "bottom top", 
                scrub: true 
            }
        });
    }

    // --- Contagem Regressiva ---
    const countdownElement = document.getElementById("countdown");
    const countdownSpans = {
        days: document.getElementById("days"),
        hours: document.getElementById("hours"),
        minutes: document.getElementById("minutes"),
        seconds: document.getElementById("seconds")
    };
    const countdownFinishedMessage = document.getElementById('countdown-message'); // ID correto do HTML

    if (countdownElement && countdownSpans.days && countdownSpans.hours && countdownSpans.minutes && countdownSpans.seconds) {
        // Data do evento no fuso horário de Santo Antônio do Descoberto (-03)
        // Isso é crucial para evitar problemas de fuso horário.
        const targetDate = new Date('2025-09-06T16:30:00-03:00'); // Set 6, 2025 at 4:30 PM (UTC-3)
        const countdownDate = targetDate.getTime();

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = countdownDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            function animateAndUpdate(element, newValue) {
                if (!element) return; // Garante que o elemento existe
                const paddedNewValue = String(newValue).padStart(2, '0');
                const currentValue = element.textContent; 

                // Somente aplica a animação e atualiza se o valor mudou
                if (paddedNewValue !== currentValue) {
                    gsap.fromTo(element,
                        { scale: 1.2, opacity: 0.5, textShadow: "0 0 10px var(--accent-color)" },
                        { scale: 1, opacity: 1, textShadow: "none", duration: 0.4, ease: "back.out(1.7)" }
                    );
                    element.textContent = paddedNewValue; 
                }
            }

            if (distance < 0) {
                clearInterval(x);
                // Define os valores como "00" e mostra a mensagem de finalização
                countdownSpans.days.textContent = "00";
                countdownSpans.hours.textContent = "00";
                countdownSpans.minutes.textContent = "00";
                countdownSpans.seconds.textContent = "00";
                
                if (countdownFinishedMessage) {
                    countdownFinishedMessage.classList.remove('d-none'); // Remove a classe d-none para mostrar
                    countdownElement.style.display = 'none'; // Esconde os itens do contador
                }
                return; // Encerra a função
            }

            // Atualiza e anima os elementos da contagem regressiva
            animateAndUpdate(countdownSpans.days, days);
            animateAndUpdate(countdownSpans.hours, hours);
            animateAndUpdate(countdownSpans.minutes, minutes);
            animateAndUpdate(countdownSpans.seconds, seconds);
            
            // Garante que a mensagem esteja escondida se o contador estiver ativo
            if (countdownFinishedMessage) {
                countdownFinishedMessage.classList.add('d-none'); // Adiciona a classe d-none para esconder
                countdownElement.style.display = 'flex'; // Garante que os itens do contador estejam visíveis
            }
        };

        const x = setInterval(updateCountdown, 1000); // Define o intervalo de 1 segundo
        updateCountdown(); // Chama uma vez imediatamente para evitar um atraso inicial
    }


    // --- Carrossel de Fotos (Galeria) ---
    const carouselContainer = document.querySelector('.carousel-container');
    const carouselSlide = document.querySelector('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    let carouselImages = []; 

    if (carouselContainer && carouselSlide && prevBtn && nextBtn) {
        carouselImages = Array.from(document.querySelectorAll('.carousel-slide img'));

        if (carouselImages.length > 0) {
            let counter = 1; 
            let size = carouselImages[0] ? carouselImages[0].clientWidth : 0; 

            // Remove clones existentes para evitar duplicatas ao recarregar ou testar
            carouselSlide.querySelectorAll('#firstClone, #lastClone').forEach(el => el.remove());

            const firstClone = carouselImages[0].cloneNode(true);
            const lastClone = carouselImages[carouselImages.length - 1].cloneNode(true);
            firstClone.id = 'firstClone';
            lastClone.id = 'lastClone';
            carouselSlide.appendChild(firstClone);
            carouselSlide.prepend(lastClone);

            // Re-seleciona todas as imagens, incluindo os clones
            carouselImages = Array.from(document.querySelectorAll('.carousel-slide img'));

            // Configura a posição inicial sem transição para evitar flash
            gsap.set(carouselSlide, { x: -size * counter });

            function slideCarousel() {
                gsap.to(carouselSlide, {
                    x: -size * counter,
                    duration: 0.8,
                    ease: "power3.inOut",
                    onStart: () => {
                        // Animação da imagem ativa ao deslizar
                        carouselImages.forEach((img, index) => {
                            if (index === counter) {
                                gsap.fromTo(img,
                                    { scale: 0.95, opacity: 0.5 },
                                    { scale: 1, opacity: 1, duration: 0.4, ease: "power1.out", delay: 0.4 }
                                );
                            } else {
                                // Garante que outras imagens estejam em seu estado padrão
                                gsap.to(img, {
                                    scale: 1,
                                    opacity: 1,
                                    duration: 0.4,
                                    ease: "power1.out"
                                });
                            }
                        });
                    },
                    onComplete: () => {
                        // Lógica de loop infinito para o carrossel
                        if (carouselImages[counter] && carouselImages[counter].id === 'lastClone') {
                            counter = carouselImages.length - 2; 
                            gsap.set(carouselSlide, { x: -size * counter });
                        }
                        if (carouselImages[counter] && carouselImages[counter].id === 'firstClone') {
                            counter = 1;
                            gsap.set(carouselSlide, { x: -size * counter });
                        }
                        // Garante que a imagem final esteja no estado correto após o "teletransporte"
                        gsap.to(carouselImages[counter], { scale: 1, opacity: 1, duration: 0.1 });
                    }
                });
            }

            nextBtn.addEventListener('click', () => {
                if (gsap.isTweening(carouselSlide)) return; // Impede cliques múltiplos
                counter++;
                slideCarousel();
            });

            prevBtn.addEventListener('click', () => {
                if (gsap.isTweening(carouselSlide)) return; // Impede cliques múltiplos
                counter--;
                slideCarousel();
            });

            // Ajusta o carrossel no redimensionamento da janela
            let carouselResizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(carouselResizeTimeout);
                carouselResizeTimeout = setTimeout(() => {
                    size = carouselImages[0] ? carouselImages[0].clientWidth : 0; 
                    gsap.set(carouselSlide, { x: -size * counter });
                }, 250); // Debounce
            });
        }
    }


    // --- Animação de entrada das seções (ScrollTrigger) ---
    // Aplica a animação a todas as seções, exceto a primeira (Hero)
    gsap.utils.toArray(".section:not(#hero)").forEach(section => {
        gsap.from(section, {
            opacity: 0,
            y: "15%",
            rotationX: -30, // Efeito de rotação 3D
            transformOrigin: "top center",
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: section,
                start: "top 75%", // Quando o topo da seção atinge 75% da viewport
                end: "bottom top", 
                toggleActions: "play none none reverse", 
            }
        });
    });

    // --- Efeitos de hover nos botões ---
    document.querySelectorAll(".btn, .carousel-btn").forEach(button => {
        button.addEventListener("mouseenter", () => {
            gsap.to(button, {
                scale: 1.1,
                boxShadow: "0 15px 35px rgba(0,0,0,0.4), 0 0 25px var(--accent-color)",
                duration: 0.3,
                ease: "back.out(2)"
            });
        });
        button.addEventListener("mouseleave", () => {
            gsap.to(button, {
                scale: 1,
                boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
                duration: 0.3,
                ease: "power1.out"
            });
        });
    });

    // --- Smooth Scroll para os links da Navbar ---
    document.querySelectorAll('.navbar-nav .nav-link').forEach(anchor => { 
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) { 
                    gsap.to(window, {
                        duration: 1,
                        scrollTo: {
                            y: targetElement.offsetTop, 
                            autoKill: false 
                        },
                        ease: "power2.inOut",
                        onComplete: () => {
                            // Fecha a navbar colapsada em dispositivos móveis após o clique
                            const navbarToggler = document.querySelector('.navbar-toggler');
                            const navbarCollapse = document.querySelector('.navbar-collapse');
                            if (navbarToggler && navbarCollapse && navbarCollapse.classList.contains('show')) {
                                const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false });
                                bsCollapse.hide();
                            }
                        }
                    });
                }
            }
        });
    });

    
}); // Fim do DOMContentLoaded