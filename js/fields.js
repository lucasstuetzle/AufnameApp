// Gruppierte Felddefinitionen pro Unterkategorie (bessere Übersicht)
const fieldGroups = {
	common: [
		"standortName",
		"standortAdresse",
		"standortBemerkung",
		"author"
	],
	Standort: [
		"location",
		"supply",
		"capacity",
		"time",
		"energy"
	],
	Energieversorgung: [
		"circuit",
		"Anschlussleistung kW",
		"Anschlussleistung A"
	]
};

// Flache Liste für Abwärtskompatibilität
const fields = Object.values(fieldGroups).flat();

// Globale Exports für andere Skripte
window.fieldGroups = fieldGroups;
window.fields = fields;
