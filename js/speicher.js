document.addEventListener("DOMContentLoaded", function () {
    // Prefer centralized `fields` from js/fields.js (window.fields). Fallback to local defaults.
    const fields = (window && window.fields && Array.isArray(window.fields)) ? window.fields : defaultFields;

    // Remove duplicates while preserving order
    const seen = new Set();
    const uniqueFields = fields.filter(f => {
        if (seen.has(f)) return false;
        seen.add(f);
        return true;
    });

    // Felder aus dem sessionStorage befüllen und Änderungen speichern
    uniqueFields.forEach(field => {
        const fieldElement = document.getElementById(field);
        if (fieldElement) {
            // Falls ein gespeicherter Wert existiert, lade ihn
            const stored = sessionStorage.getItem(field);
            if (stored !== null) {
                fieldElement.value = stored;
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
