document.addEventListener("DOMContentLoaded", function () {
    const newLocationButton = document.getElementById("newLocation");

    if (newLocationButton) {
        newLocationButton.addEventListener("click", function () {
            const data = {};
            let allFieldsFilled = true;  // Eine Flagge, um zu überprüfen, ob alle Felder befüllt sind

            // Überprüfe die Felder und fülle die Daten
            fields.forEach(field => {
                const fieldElement = document.getElementById(field);
                if (fieldElement) {
                    const value = fieldElement.value;
                    if (value) {
                        data[field] = value;  // Füge das Feld und seinen Wert hinzu
                    } else {
                        allFieldsFilled = false;  // Setze Flag auf false, wenn ein Feld leer ist
                    }
                } else {
                    console.warn(`Feld nicht gefunden: ${field}`);  // Debugging, wenn ein Feld nicht gefunden wird
                }
            });

            // Debugging: Überprüfe, welche Daten in 'data' gespeichert sind
            console.log("Daten vor JSON-Erstellung:", data);

            if (allFieldsFilled) {
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
            } else {
                alert("Bitte füllen Sie alle Felder aus, bevor Sie speichern.");
            }
        });
    } else {
        console.warn("Button für 'Neuen Standort erstellen' nicht gefunden");
    }
});
