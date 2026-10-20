const API_URL = "https://script.google.com/macros/s/AKfycbxzkzysvdgjCtZtt1Bjrwf2uDwZR1cd-UzAcZ2X4DENFScE81fl_WJMk8zRgqhTaXyZzA/exec";

// Evita che il contenuto del foglio venga interpretato come HTML
function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function renderMeal(label, meal) {
    const piatto = (meal.piatto || "").trim();
    const note = (meal.note || "").trim();

    return `
          <div class="meal-box">
            <h3>${label}</h3>
            ${piatto
            ? `<p class="meal-dish">${escapeHtml(piatto)}</p>`
            : `<p class="meal-dish is-empty">--</p>`}
            ${note ? `<p class="meal-note">${escapeHtml(note)}</p>` : ""}
          </div>`;
}

async function loadMenu() {
    const container = document.getElementById("weeklyMenu");

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        container.innerHTML = "";

        // Ordine dei giorni della settimana
        const giorni = ["lun", "mar", "mer", "gio", "ven", "sab", "dom"];

        giorni.forEach((giorno) => {
            // Troviamo i pasti del giorno corrente
            const pranzo = data.find(item => item.giorno === giorno && item.tipo === "pranzo") || {};
            const cena = data.find(item => item.giorno === giorno && item.tipo === "cena") || {};

            const dayCard = document.createElement("section");
            dayCard.className = "day-card";

            dayCard.innerHTML = `
        <h2 class="day-title">${giorno.charAt(0).toUpperCase() + giorno.slice(1)}</h2>

        <div class="meals-container">
          ${renderMeal("Pranzo", pranzo)}
          ${renderMeal("Cena", cena)}
        </div>
      `;

            container.appendChild(dayCard);
        });

    } catch (error) {
        console.error("Errore nel caricamento del menu:", error);
        container.innerHTML = `<p class="message">Non riesco a caricare i pasti. Controlla la connessione e ricarica la pagina.</p>`;
    }
}

loadMenu();