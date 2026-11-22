// ==================== GALERÍA INTERACTIVA ====================

const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        const filter = button.dataset.filter;

        // Actualizar botón seleccionado
        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        // Filtrar proyectos
        projectCards.forEach(card => {

            const category = card.dataset.category;

            card.hidden = filter !== "all" && category !== filter;

        });

    });

});