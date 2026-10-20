const API_URL = "https://script.google.com/macros/s/AKfycbxzkzysvdgjCtZtt1Bjrwf2uDwZR1cd-UzAcZ2X4DENFScE81fl_WJMk8zRgqhTaXyZzA/exec";

async function loadTable() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        const table = document.getElementById("daysTable");

        let tableContent = `
    <thead>
        <tr>
            <th>Giorno</th>
            <th>Tipo</th>
            <th>Piatto</th>
            <th>Note</th>
            <th>Azione</th>
        </tr>
    </thead>
    <tbody>
        `;

        data.forEach((row, index) => {
            tableContent += `
              <tr>
                <td><strong>${row.giorno.toUpperCase()}</strong></td>
                <td>${row.tipo}</td>
                <td>
                  <input type="text" id="piatto-${index}" value="${row.piatto}" placeholder="Inserisci piatto">
                </td>
                <td>
                  <input type="text" id="note-${index}" value="${row.note}" placeholder="Note...">
                </td>
                <td>
                  <button onclick="saveMeal('${row.giorno}', '${row.tipo}', ${index})">Salva</button>
                </td>
              </tr>
            `;
        });

        tableContent += `</tbody>`;
        table.innerHTML = tableContent;

    } catch (error) {
        console.error("Errore nel caricamento dei pasti:", error);
    }
}

// Invia le modifiche al Foglio Google
async function saveMeal(giorno, tipo, index) {
    const piattoInput = document.getElementById(`piatto-${index}`).value;
    const noteInput = document.getElementById(`note-${index}`).value;

    const payload = {
        giorno: giorno,
        tipo: tipo,
        piatto: piattoInput,
        note: noteInput
    };

    try {
        await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify(payload)
        });
        alert(`Pasto salvato per ${giorno.toUpperCase()} (${tipo})!`);
    } catch (error) {
        console.error("Errore durante il salvataggio:", error);
        alert("Errore nel salvataggio del pasto.");
    }
}
loadTable();