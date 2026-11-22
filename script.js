
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
