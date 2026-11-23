
/* =========================================================
   GALERÍA INTERACTIVA Y CARRUSEL
========================================================= */

const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

const carousel = document.querySelector(".projects-grid");

const prevButton = document.getElementById("prevProject");
const nextButton = document.getElementById("nextProject");
const projectCounter = document.getElementById("projectCounter");

let currentProject = 0;

const AUTO_INTERVAL = 5000;
let autoCarousel = null;

// Obtener proyectos visibles según el filtro
function getVisibleProjects() {
    return Array.from(projectCards).filter(card => !card.hidden);
}

// Cantidad de tarjetas por pantalla
function getVisibleCount() {
    if (window.innerWidth <= 650) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
}

// Máxima posición del carrusel
function getMaxIndex() {
    const projects = getVisibleProjects();

    return Math.max(
        0,
        projects.length - Math.min(getVisibleCount(), projects.length)
    );
}

// Actualizar contador y botones
function updateCarouselControls() {

    const projects = getVisibleProjects();
    const maxIndex = getMaxIndex();

    currentProject = Math.min(currentProject, maxIndex);

    projectCounter.textContent =
        projects.length === 0
            ? "0 de 0"
            : `${currentProject + 1} de ${projects.length}`;

    prevButton.disabled = currentProject === 0;
    nextButton.disabled = currentProject >= maxIndex;
}

// Mostrar un proyecto
function showProject(index) {

    const projects = getVisibleProjects();
    const maxIndex = getMaxIndex();

    currentProject = Math.max(0, Math.min(index, maxIndex));

    const target = projects[currentProject];

    if (target) {
        const distance =
            target.getBoundingClientRect().left -
            carousel.getBoundingClientRect().left +
            carousel.scrollLeft;

        carousel.scrollTo({
            left: distance,
            behavior: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches ? "auto" : "smooth"
        });
    }

    updateCarouselControls();
}

/* =========================================================
   REPRODUCCIÓN AUTOMÁTICA
========================================================= */

// Avanzar cada 5 segundos
function autoMoveCarousel() {

    const maxIndex = getMaxIndex();

    if (maxIndex === 0) return;

    if (currentProject >= maxIndex) {
        showProject(0);
    } else {
        showProject(currentProject + 1);
    }
}

// Detener reproducción
function stopAutoCarousel() {
    clearInterval(autoCarousel);
    autoCarousel = null;
}

// Iniciar reproducción
function startAutoCarousel() {

    stopAutoCarousel();

    autoCarousel = setInterval(() => {
        autoMoveCarousel();
    }, AUTO_INTERVAL);
}

/* =========================================================
   BOTONES MANUALES
========================================================= */

prevButton.addEventListener("click", () => {
    showProject(currentProject - 1);
    startAutoCarousel();
});

nextButton.addEventListener("click", () => {
    showProject(currentProject + 1);
    startAutoCarousel();
});

/* =========================================================
   FILTROS
========================================================= */

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        const filter = button.dataset.filter;

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        projectCards.forEach(card => {
            card.hidden =
                filter !== "all" &&
                card.dataset.category !== filter;
        });

        currentProject = 0;
        carousel.scrollTo({
            left: 0,
            behavior: "auto"
        });

        updateCarouselControls();

        // Reiniciar temporizador al cambiar filtro
        startAutoCarousel();
    });

});

/* =========================================================
   PAUSAR AL INTERACTUAR
========================================================= */

// Pausar cuando el mouse esté sobre los proyectos
carousel.addEventListener("mouseenter", stopAutoCarousel);

// Continuar cuando el mouse salga
carousel.addEventListener("mouseleave", startAutoCarousel);

// Pausar al navegar con teclado
carousel.addEventListener("focusin", stopAutoCarousel);
carousel.addEventListener("focusout", startAutoCarousel);

// Ajustar al cambiar tamaño de pantalla
window.addEventListener("resize", () => {
    showProject(currentProject);
});

// Inicializar
updateCarouselControls();
startAutoCarousel();


/* =========================================
   BOTÓN VOLVER ARRIBA
========================================= */

const scrollTopBtn = document.getElementById("scrollTopBtn");

// Mostrar u ocultar según la posición
function toggleScrollTopButton() {

    if (window.scrollY > 300) {
        scrollTopBtn.classList.add("visible");
    } else {
        scrollTopBtn.classList.remove("visible");
    }

}

// Detectar desplazamiento
window.addEventListener("scroll", toggleScrollTopButton, {
    passive: true
});

// Volver al inicio al hacer clic
scrollTopBtn.addEventListener("click", () => {

    window.scrollTo({
        top: 0,
        behavior: window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches ? "instant" : "smooth"
    });

});

// Comprobar la posición al cargar
toggleScrollTopButton();


//FORMULARIO DE CONTACTO - EMAILJS

// Configuración de EmailJS
const EMAILJS_PUBLIC_KEY = "9IAiV1fYaYXYGHkM9";
const EMAILJS_SERVICE_ID = "service_x0dgksj";
const EMAILJS_TEMPLATE_ID = "template_h7zubc1";

// Inicializar EmailJS
emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY
});

// Elementos del formulario
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const submitButton = contactForm.querySelector(
    'button[type="submit"]'
);

// Enviar formulario
contactForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    // Validar campos
    if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
    }

    // Evitar envíos duplicados
    submitButton.disabled = true;
    submitButton.textContent = "Enviando...";

    formStatus.textContent = "Enviando mensaje...";
    formStatus.className = "form-status";

    try {

        // Enviar mensaje mediante EmailJS
        await emailjs.sendForm(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            contactForm
        );

        // Mensaje de éxito
        formStatus.textContent =
            "¡Mensaje enviado correctamente! Pronto me pondré en contacto contigo.";

        formStatus.className = "form-status success";

        // Limpiar formulario
        contactForm.reset();

    } catch (error) {

        console.error("Error al enviar el correo:", error);

        formStatus.textContent =
            "No se pudo enviar el mensaje. Inténtalo nuevamente.";

        formStatus.className = "form-status error";

    } finally {

        submitButton.disabled = false;
        submitButton.textContent = "Enviar mensaje";

    }

});
