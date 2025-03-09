document.addEventListener("DOMContentLoaded", function () {
    const newLocationButton = document.getElementById("newLocationButton");

    if (!newLocationButton) {
        console.error("Button 'newLocationButton' nicht gefunden.");
        return;
    }

    newLocationButton.addEventListener("click", function () {
        // Überprüfen, ob 'fields' definiert ist
        if (typeof fields === "undefined") {
            console.error("'fields' ist nicht definiert.");
            return;
        }

        const data = {};

        // Durch die 'fields' iterieren und Werte aus 'sessionStorage' abrufen
        fields.forEach(field => {
            const value = sessionStorage.getItem(field);
            if (value !== null && value.trim() !== "") {
                data[field] = value.trim(); // Nur nicht-leere Werte speichern
            }
        });

        // Sicherstellen, dass Daten vorhanden sind
        if (Object.keys(data).length === 0) {
            alert("Keine Daten zum Speichern vorhanden.");
            return;
        }

        // JSON-Datei zum Download anbieten
        downloadJSON(data, "speicher.json");
    });

    // Funktion zum Erstellen und Herunterladen der JSON-Datei
    function downloadJSON(data, filename) {
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });

        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
});
