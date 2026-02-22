
document.addEventListener("DOMContentLoaded", function () {
    // Suche den dedizierten Download-Button (beliebiges Element mit data-download="true")
    const downloadButton = document.querySelector('[data-download="true"]');

    if (!downloadButton) {
        console.error("Kein Download-Button mit data-download=\"true\" gefunden.");
        return;
    }

    downloadButton.addEventListener("click", function () {
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

        // JSON-Datei zum Download anbieten: name = location + aktuelles Datum/Zeit
        const locationName = (data.standortName || data.location || 'Standort').toString();
        const sanitize = s => s.replace(/[^a-z0-9_\-]/gi, '_').replace(/_+/g, '_');
        const now = new Date();
        const pad = n => n.toString().padStart(2, '0');
        const timestamp = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
        const filename = `${sanitize(locationName)}_${timestamp}.json`;
        downloadJSON(data, filename);
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
