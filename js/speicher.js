document.addEventListener("DOMContentLoaded", function() {
    const fields = ["location", "supply", "capacity", "time", "energy", "author", "circuit"];

    fields.forEach(field => {
        const fieldElement = document.getElementById(field);
        if (fieldElement) {
            console.log(`Feld gefunden: ${field}`); // Debugging

            // Falls ein gespeicherter Wert existiert, lade ihn
            if (sessionStorage.getItem(field)) {
                fieldElement.value = sessionStorage.getItem(field);
            }

            // Speichern bei Eingabe
            fieldElement.addEventListener("input", function() {
                sessionStorage.setItem(field, this.value);
                console.log(`Gespeichert: ${field} = ${this.value}`); // Debugging
            });
        } else {
            console.warn(`Feld nicht gefunden: ${field}`); // Warnung in der Konsole
        }
    });
});
