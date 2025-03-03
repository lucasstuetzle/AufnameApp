document.addEventListener("DOMContentLoaded", function () {
    const fields = [
        "standortName", "standortAdresse", "standortBemerkung", 
        "location", "supply", "capacity", "time", "energy", 
        "author", "circuit"
    ];

    // Event-Listener für das Speichern eines neuen Standorts als JSON
    document.getElementById("newLocation").addEventListener("click", function () {
        const data = {};

        // Hole die Werte der Felder und speichere sie im data-Objekt
        fields.forEach(field => {
            const fieldElement = document.getElementById(field);
            if (fieldElement) {
                data[field] = fieldElement.value;  // Füge den Wert jedes Feldes zum JSON-Objekt hinzu
            }
        });

        // Erstelle die JSON-Daten
        const jsonData = JSON.stringify(data, null, 2);

        // Erstelle einen Blob aus den JSON-Daten
        const blob = new Blob([jsonData], { type: "application/json" });
        const a = document.createElement("a");  // Erstelle einen Download-Link
        a.href = URL.createObjectURL(blob);     // Setze die Blob-URL als Linkziel
        a.download = "standort.json";            // Setze den Dateinamen der JSON-Datei
        document.body.appendChild(a);           // Füge den Link ins Dokument hinzu
        a.click();                              // Simuliere einen Klick, um den Download zu starten
        document.body.removeChild(a);           // Entferne den Link nach dem Klick
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
