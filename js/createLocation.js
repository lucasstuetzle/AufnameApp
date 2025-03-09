document.addEventListener("DOMContentLoaded", function () {
    const newLocationButton = document.getElementById("newLocation");

    if (newLocationButton) {
        newLocationButton.addEventListener("click", function () {
            const data = {};

            // Überprüfe die Felder und fülle die Daten
            fields.forEach(field => {
                const fieldElement = document.getElementById(field);

                if (fieldElement) {
                    const value = fieldElement.value;
                    if (value) {
                        data[field] = value; // Füge das Feld und seinen Wert hinzu
                    } else {
                        console.warn(`Feld "${field}" ist leer.`);
                    }
                } else {
                    console.warn(`Feld nicht gefunden: ${field}`);
                }
            });

            // Debugging: Überprüfe, welche Daten in 'data' gespeichert sind
            console.log("Daten vor JSON-Erstellung:", data);

            // JSON-Datei erstellen und zum Download anbieten
            downloadJSON(data, "speicher.json");
        });
    } else {
        console.error('Button mit der ID "newLocation" nicht gefunden.');
    }
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

    // Speicher freigeben
    URL.revokeObjectURL(a.href);
}
