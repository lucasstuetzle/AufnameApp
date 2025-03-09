document.addEventListener("DOMContentLoaded", function () {
    // Verwende die fields-Konstante aus fields.js
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
});
