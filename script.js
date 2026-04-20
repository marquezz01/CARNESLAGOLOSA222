/**
 * Maneja los eventos de clic de la página de forma centralizada usando delegación de eventos.
 * Este enfoque mejora el rendimiento y la mantenibilidad, especialmente en páginas complejas
 * o con contenido dinámico.
 */
document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (event) => {
        const whatsappButton = event.target.closest('.js-whatsapp-btn');
        const contactButton = event.target.closest('.js-contact-btn');

        // Redirigir todas las acciones de WhatsApp y cotización a la página de contacto interna
        // para evitar el uso de números de teléfono específicos en el código.
        if (whatsappButton || contactButton) {
            window.location.href = 'contacto.html';
        }
    });

    // === INTERSECTION OBSERVER FOR ANIMATIONS ===
    // Anima elementos cuando entran en el viewport.
    const animatedGrids = document.querySelectorAll('.catalog-grid, .features-grid');

    const gridObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target); // Animar solo una vez
            }
        });
    }, {
        threshold: 0.1 // El elemento debe ser visible en un 10% para activar
    });

    animatedGrids.forEach(element => {
        gridObserver.observe(element);
    });

    // === CATALOG IMAGE SWAP ON HOVER ===
    // Cambia la imagen principal al pasar el cursor sobre las miniaturas con un efecto de fundido.
    const catalogGrid = document.querySelector('.catalog-grid');
    if (catalogGrid) {
        const mainImageEl = catalogGrid.querySelector('.main-catalog-image img');
        const thumbContainers = catalogGrid.querySelectorAll('.thumb-catalog-image');

        if (mainImageEl && thumbContainers.length > 0) {
            const originalSrc = mainImageEl.src;

            const changeImageWithFade = (newSrc) => {
                // No hacer nada si es la misma imagen o si ya hay una transición en curso.
                if (mainImageEl.src === newSrc || mainImageEl.style.opacity === '0') return;

                mainImageEl.style.opacity = '0'; // Inicia el desvanecimiento de salida.

                // Escucha el final de la transición para cambiar la imagen y volver a mostrarla.
                mainImageEl.addEventListener('transitionend', function onFadeOut() {
                    mainImageEl.src = newSrc;
                    mainImageEl.style.opacity = '1';
                    mainImageEl.removeEventListener('transitionend', onFadeOut);
                }, { once: true });
            };

            thumbContainers.forEach(thumb => thumb.addEventListener('mouseenter', () => changeImageWithFade(thumb.querySelector('img').src)));

            catalogGrid.addEventListener('mouseleave', () => changeImageWithFade(originalSrc));
        }
    }

    // === LIGHTBOX LOGIC ===
    // Permite ampliar la imagen principal del catálogo al hacer clic.
    const lightbox = document.getElementById('image-lightbox');
    if (lightbox) {
        const mainImageContainer = document.querySelector('.main-catalog-image');
        const lightboxImg = document.getElementById('lightbox-img');
        const closeBtn = lightbox.querySelector('.lightbox-close');

        if (mainImageContainer && lightboxImg && closeBtn) {
            mainImageContainer.addEventListener('click', () => {
                const mainImageEl = mainImageContainer.querySelector('img');
                lightbox.classList.add('active');
                lightboxImg.src = mainImageEl.src;
            });

            const closeLightbox = () => lightbox.classList.remove('active');

            closeBtn.addEventListener('click', closeLightbox);
            // Cierra el lightbox si se hace clic en el fondo (overlay)
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });

            // Cierra el lightbox al presionar la tecla "Escape"
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                    closeLightbox();
                }
            });
        }
    }

    // === CAROUSEL LOGIC ===
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');

    if (track && slides.length > 0) {
        let currentIndex = 0;
        let slidesPerView = 1;
        const gap = 20; // Debe coincidir con el gap del CSS
        let autoPlayInterval;

        // Determina cuántos slides se ven según el ancho de pantalla
        const updateSlidesPerView = () => {
            if (window.innerWidth >= 1024) slidesPerView = 3;
            else if (window.innerWidth >= 768) slidesPerView = 2;
            else slidesPerView = 1;
            
            // Ajustar índice si cambia el tamaño para evitar espacios vacíos
            const maxIndex = slides.length - slidesPerView;
            if (currentIndex > maxIndex) currentIndex = maxIndex;
            updateCarousel();
        };

        const updateCarousel = () => {
            const slideWidth = slides[0].offsetWidth + gap;
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        };

        const nextSlide = () => {
            const maxIndex = slides.length - slidesPerView;
            if (currentIndex < maxIndex) {
                currentIndex++;
            } else {
                currentIndex = 0; // Loop al inicio
            }
            updateCarousel();
        };

        const prevSlide = () => {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = slides.length - slidesPerView; // Loop al final
            }
            updateCarousel();
        };

        // Auto-play silencioso
        const startAutoPlay = () => {
            stopAutoPlay();
            autoPlayInterval = setInterval(nextSlide, 4500);
        };

        const stopAutoPlay = () => clearInterval(autoPlayInterval);

        // Event Listeners
        nextBtn.addEventListener('click', () => { nextSlide(); startAutoPlay(); });
        prevBtn.addEventListener('click', () => { prevSlide(); startAutoPlay(); });
        
        // Pausar en hover
        track.parentElement.addEventListener('mouseenter', stopAutoPlay);
        track.parentElement.addEventListener('mouseleave', startAutoPlay);
        
        // Responsive
        window.addEventListener('resize', updateSlidesPerView);

        // Inicialización
        updateSlidesPerView();
        startAutoPlay();
    }
});