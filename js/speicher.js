document.addEventListener("DOMContentLoaded", function () {
    const fields = [
        "standortName", "standortAdresse", "standortBemerkung", 
        "location", "supply", "capacity", "time", "energy", 
        "author", "circuit"
    ];

    // **1. Felder aus sessionStorage befüllen**
    fields.forEach(field => {
        const fieldElement = document.getElementById(field);
        if (fieldElement) {
            console.log(`Feld gefunden: ${field}`); // Debugging

            // Falls ein gespeicherter Wert existiert, lade ihn ins Eingabefeld
            if (sessionStorage.getItem(field)) {
                fieldElement.value = sessionStorage.getItem(field);
            }

            // **Änderungen im sessionStorage speichern**
            fieldElement.addEventListener("input", function () {
                sessionStorage.setItem(field, this.value);
                console.log(`Gespeichert: ${field} = ${this.value}`); // Debugging
            });
        } else {
            console.warn(`Feld nicht gefunden: ${field}`); // Warnung in der Konsole
        }
    });
});
