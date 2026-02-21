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

const loadButton = document.getElementById("loadLocationButton");
const fileInput = document.getElementById("uploadJSON");

if (loadButton && fileInput) {

    loadButton.addEventListener("click", () => {
        fileInput.click(); // Öffnet Dateiauswahl
    });

    fileInput.addEventListener("change", function (event) {
        const file = event.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (e) {
            try {
                const data = JSON.parse(e.target.result);

                Object.keys(data).forEach(key => {
                    const element = document.getElementById(key);
                    if (element) {
                        element.value = data[key];

                        // optional auch wieder in sessionStorage speichern
                        sessionStorage.setItem(key, data[key]);
                    }
                });

                alert("Standort erfolgreich geladen!");
            } catch (error) {
                alert("Ungültige JSON-Datei.");
                console.error(error);
            }
        };

        reader.readAsText(file);
    });
}
