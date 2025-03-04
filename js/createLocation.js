document.addEventListener("DOMContentLoaded", function () {
    const newLocationButton = document.getElementById("newLocation");
    
    if (newLocationButton) {
        newLocationButton.addEventListener("click", function () {
            const data = {};

            // Verwende die fields-Konstante aus fields.js
            fields.forEach(field => {
                const fieldElement = document.getElementById(field);
                if (fieldElement) {
                    data[field] = fieldElement.value;
                }
            });

            // JSON-Daten erstellen
            const jsonData = JSON.stringify(data, null, 2);

            // JSON-Datei erstellen und herunterladen
            const blob = new Blob([jsonData], { type: "application/json" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "standort.json";  // Dateiname für die heruntergeladene Datei
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a); // A-Tag nach dem Klick entfernen
        });
    } else {
        console.warn("Button für 'Neuen Standort erstellen' nicht gefunden");
    }
});
