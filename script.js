
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

// Obtener únicamente los proyectos del filtro activo
function getVisibleProjects() {
    return Array.from(projectCards).filter(card => !card.hidden);
}

// Cantidad de tarjetas que caben en pantalla
function getVisibleCount() {
    if (window.innerWidth <= 650) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
}

// Actualizar contador y flechas
function updateCarouselControls() {

    const projects = getVisibleProjects();
    const visibleCount = Math.min(getVisibleCount(), projects.length);

    const maxIndex = Math.max(0, projects.length - visibleCount);

    currentProject = Math.min(currentProject, maxIndex);

    projectCounter.textContent =
        projects.length === 0
            ? "0 de 0"
            : `${currentProject + 1} de ${projects.length}`;

    prevButton.disabled = currentProject === 0;
    nextButton.disabled = currentProject >= maxIndex;
}

// Mover carrusel a una tarjeta
function showProject(index) {

    const projects = getVisibleProjects();

    const maxIndex = Math.max(
        0,
        projects.length - Math.min(getVisibleCount(), projects.length)
    );

    currentProject = Math.max(0, Math.min(index, maxIndex));

    const target = projects[currentProject];

    if (target) {
        carousel.scrollTo({
            left: target.offsetLeft - carousel.offsetLeft,
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "instant"
                : "smooth"
        });
    }

    updateCarouselControls();
}

// Botón anterior
prevButton.addEventListener("click", () => {
    showProject(currentProject - 1);
});

// Botón siguiente
nextButton.addEventListener("click", () => {
    showProject(currentProject + 1);
});

// Filtros
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
        carousel.scrollLeft = 0;

        updateCarouselControls();
    });

});

// Ajustar controles al cambiar tamaño de pantalla
window.addEventListener("resize", () => {
    showProject(currentProject);
});

// Inicializar
updateCarouselControls();
