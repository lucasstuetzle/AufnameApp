document.addEventListener("DOMContentLoaded", function () {
    const fields = ["standortName", "standortAdresse", "standortBemerkung", "location", "supply", "capacity", "time", "energy", "author", "circuit"];

    // Felder aus dem sessionStorage befüllen und Änderungen speichern
    fields.forEach(field => {
        const fieldElement = document.getElementById(field);
        if (fieldElement) {
            console.log(`Feld gefunden: ${field}`);

            // Falls ein gespeicherter Wert existiert, lade ihn
            if (sessionStorage.getItem(field)) {
                fieldElement.value = sessionStorage.getItem(field);
            }

            // Speichern bei Eingabe
            fieldElement.addEventListener("input", function () {
                sessionStorage.setItem(field, this.value);
                console.log(`Gespeichert: ${field} = ${this.value}`);
            });
        } else {
            console.warn(`Feld nicht gefunden: ${field}`);
        }
    });

    // Event-Listener für das Speichern als JSON
    document.getElementById("newLocation").addEventListener("click", function () {
        const data = {};

        // Alle Werte aus den Feldern holen und in das JSON-Objekt schreiben
        fields.forEach(field => {
            const fieldElement = document.getElementById(field);
            if (fieldElement) {
                data[field] = fieldElement.value || ""; // Falls leer, wird ein leerer String gespeichert
            }
        });

        console.log("Erstellte JSON-Daten:", data); // Debugging

        const jsonData = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonData], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "standort.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
});
