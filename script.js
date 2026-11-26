
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

// Actualizar contador y botones
function updateCarouselControls() {

    const projects = getVisibleProjects();
    const maxIndex = getMaxIndex();

    currentProject = Math.min(currentProject, maxIndex);

    // Obtener el idioma actual
    const language = document.documentElement.lang || "es";

    // Obtener la traducción de "de"
    const separator = translations[language].carouselOf;

    projectCounter.textContent =
        projects.length === 0
            ? `0 ${separator} 0`
            : `${currentProject + 1} ${separator} ${projects.length}`;

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

// Obtener una traducción según el idioma actual
function translate(key) {

    const language = document.documentElement.lang || "es";

    return translations[language]?.[key] ?? translations.es[key];
}

// Actualizar el mensaje de estado del formulario
function updateFormStatus(key, status = "") {

    formStatus.dataset.i18n = key;

    formStatus.textContent = translate(key);

    formStatus.className = status
        ? `form-status ${status}`
        : "form-status";
}

// Enviar formulario
contactForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    // Evitar envíos duplicados
    if (submitButton.disabled) return;

    // Validar campos
    if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
    }

    // Deshabilitar botón durante el envío
    submitButton.disabled = true;

    submitButton.dataset.i18n = "formSending";
    submitButton.textContent = translate("formSending");

    updateFormStatus("formSendingStatus");

    try {

        // Enviar mensaje mediante EmailJS
        await emailjs.sendForm(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            contactForm
        );

        // Mensaje de éxito
        updateFormStatus("formSuccess", "success");

        // Limpiar formulario
        contactForm.reset();

    } catch (error) {

        console.error("Error al enviar el correo:", error);

        // Mensaje de error
        updateFormStatus("formError", "error");

    } finally {

        submitButton.disabled = false;

        submitButton.dataset.i18n = "formSubmit";
        submitButton.textContent = translate("formSubmit");

    }

});



/* =========================================
   INTERNACIONALIZACIÓN DEL PORTAFOLIO
========================================= */

const languageButtons = document.querySelectorAll(".language-btn");

// Traducir atributos de un elemento
function translateAttribute(selector, attribute, key, language) {

    const elements = document.querySelectorAll(selector);

    elements.forEach(element => {

        if (translations[language][key] !== undefined) {

            element.setAttribute(
                attribute,
                translations[language][key]
            );

        }

    });

}

// Cambiar idioma
function changeLanguage(language) {

    // Validar que el idioma exista
    if (!translations[language]) {
        language = "es";
    }

    // Actualizar el idioma del documento
    document.documentElement.lang = language;

    // Traducir textos
    const elements = document.querySelectorAll("[data-i18n]");

    elements.forEach(element => {

        const key = element.dataset.i18n;

        if (translations[language][key] !== undefined) {
            element.textContent = translations[language][key];
        }

    });

    // Traducir placeholders
    const placeholders = document.querySelectorAll(
        "[data-i18n-placeholder]"
    );

    placeholders.forEach(element => {

        const key = element.dataset.i18nPlaceholder;

        if (translations[language][key] !== undefined) {
            element.placeholder = translations[language][key];
        }

    });

    // Traducir título de la página
    document.title = translations[language].pageTitle;

    // Traducir descripción de la página
    translateAttribute(
        'meta[name="description"]',
        "content",
        "pageDescription",
        language
    );

    // Traducir navegación
    translateAttribute(
        ".navbar",
        "aria-label",
        "navLabel",
        language
    );

    // Traducir logotipos
    translateAttribute(
        ".nav-logo img, .footer-logo",
        "alt",
        "logoAlt",
        language
    );

    translateAttribute(
        ".hero-logo",
        "alt",
        "heroLogoAlt",
        language
    );

    // Traducir fotografía
    translateAttribute(
        ".about-image img",
        "alt",
        "photoAlt",
        language
    );

    // Traducir vistas previas de los CV
    translateAttribute(
        'img[src="CV_ATS_Mauricio.png"]',
        "alt",
        "cvSpanishAlt",
        language
    );

    translateAttribute(
        'img[src="Mauricio_CV_ATS_English.png"]',
        "alt",
        "cvEnglishAlt",
        language
    );

    // Traducir controles del carrusel
    translateAttribute(
        "#prevProject",
        "aria-label",
        "carouselPrevious",
        language
    );

    translateAttribute(
        "#nextProject",
        "aria-label",
        "carouselNext",
        language
    );

    translateAttribute(
        ".projects-grid",
        "aria-label",
        "carouselGallery",
        language
    );

    // Traducir botón volver arriba
    translateAttribute(
        "#scrollTopBtn",
        "aria-label",
        "scrollTop",
        language
    );

    translateAttribute(
        "#scrollTopBtn",
        "title",
        "scrollTopTitle",
        language
    );

    // Traducir botón flotante de WhatsApp
    translateAttribute(
        ".whatsapp-float",
        "aria-label",
        "whatsappLabel",
        language
    );

    translateAttribute(
        ".whatsapp-float",
        "title",
        "whatsappTitle",
        language
    );

    // Actualizar contador del carrusel
    updateCarouselControls();

    // Actualizar los botones de idioma
    languageButtons.forEach(button => {

        const isActive = button.dataset.lang === language;

        button.classList.toggle("active", isActive);

        button.setAttribute("aria-pressed", isActive);

    });

    // Guardar la preferencia del visitante
    localStorage.setItem("portfolioLanguage", language);

}

// Eventos de los botones
languageButtons.forEach(button => {

    button.addEventListener("click", () => {

        changeLanguage(button.dataset.lang);

    });

});

// Recuperar el idioma guardado
const savedLanguage =
    localStorage.getItem("portfolioLanguage") || "es";

changeLanguage(savedLanguage);

