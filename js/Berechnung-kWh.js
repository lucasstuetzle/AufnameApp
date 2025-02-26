
	// alert("Das externe Skript wurde geladen!");
	
/* Funktion zur Berechnung der Energiemenge */
function calculateEnergy() {
	let capacity = document.getElementById("capacity").value; // Erfasst die Kapazität
	let time = document.getElementById("time").value; // Erfasst die Zeitdauer
	let energy = capacity * time; // Berechnung: Energiemenge = Kapazität * Zeitdauer
	document.getElementById("energy").value = energy + " kWh"; // Ausgabe der berechneten Energiemenge
	
	// Speichern der berechneten Energiemenge im sessionStorage
    sessionStorage.setItem("energy", energy + " kWh");
}
