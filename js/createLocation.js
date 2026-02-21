// js/createLocation.js

document.addEventListener("DOMContentLoaded", function () {

  // ======= JSON erstellen =======
  const newLocationButton = document.getElementById("newLocation");

  if (newLocationButton) {
    newLocationButton.addEventListener("click", function () {

      const data = {};
      let allFieldsFilled = true;

      fields.forEach(field => {
        const fieldElement = document.getElementById(field);
        if (fieldElement) {
          const value = fieldElement.value;
          if (value) {
            data[field] = value;
          } else {
            allFieldsFilled = false;
          }
        } else {
          console.warn(`Feld nicht gefunden: ${field}`);
        }
      });

      if (allFieldsFilled) {
        const jsonData = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonData], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "standort.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        alert("Bitte füllen Sie alle Felder aus, bevor Sie speichern.");
      }

    });
  }

  // ======= JSON einlesen =======
  const loadJsonBtn = document.getElementById("loadJsonBtn");
  loadJsonBtn?.addEventListener("click", () => {
    const fileInput = document.getElementById("jsonFileInput");
    const file = fileInput?.files?.[0];

    if (!file) {
      alert("Bitte wähle zuerst eine JSON Datei aus!");
      return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
      try {
        const jsonData = JSON.parse(e.target.result);

        fields.forEach(field => {
          const input = document.getElementById(field);
          if (input && jsonData[field] !== undefined) {
            input.value = jsonData[field];
          }
        });

        alert("Daten erfolgreich geladen!");
      } catch (err) {
        console.error(err);
        alert("Fehler beim Einlesen der JSON Datei");
      }
    };

    reader.readAsText(file);
  });

});
