document.addEventListener("DOMContentLoaded", function () {
    const fields = ["standortName", "standortAdresse", "standortBemerkung", "location", "supply", "capacity", "time", "energy", "author", "circuit"];

    // Felder aus dem sessionStorage befüllen und Änderungen speichern
    fields.forEach(field => {
        const fieldElement = document.getElementById(field);
        if (fieldElement) {
            console.log(`Feld gefunden: ${field}`); // Debugging

            // Falls ein gespeicherter Wert existiert, lade ihn
            if (sessionStorage.getItem(field)) {
                fieldElement.value = sessionStorage.getItem(field);
            }

            // Speichern bei Eingabe
            fieldElement.addEventListener("input", function () {
                sessionStorage.setItem(field, this.value);
                console.log(`Gespeichert: ${field} = ${this.value}`); // Debugging
            });
        } else {
            console.warn(`Feld nicht gefunden: ${field}`); // Warnung in der Konsole
        }
    });

    // Event-Listener für das Speichern eines neuen Standorts als JSON
    document.getElementById("newLocation").addEventListener("click", function () {
        const data = {};

        fields.forEach(field => {
            const fieldElement = document.getElementById(field);
            if (fieldElement) {
                data[field] = fieldElement.value;
            }
        });

        const jsonData = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonData], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "standort.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    // Event-Listener für das Laden und Bearbeiten eines bestehenden Standorts
    document.getElementById("uploadJson").addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const jsonData = JSON.parse(e.target.result);
                fields.forEach(field => {
                    if (jsonData[field]) {
                        const fieldElement = document.getElementById(field);
                        if (fieldElement) {
                            fieldElement.value = jsonData[field];
                            sessionStorage.setItem(field, jsonData[field]); // Direkt in sessionStorage speichern
                        }
                    }
                });
            } catch (error) {
                console.error("Fehler beim Laden der JSON-Datei:", error);
            }
        };
        reader.readAsText(file);
    });
});

