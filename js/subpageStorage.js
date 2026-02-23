/*
  Structured subpage storage using format: PREFIX_<Name>_<FieldName>
  For Energieversorgung (EV): EV_<Name>_Anschlussleistung_kW
  For Energieverteilung (EV_dist): EV_dist_<Name>_Anzahl_Ladepunkte
*/

(function() {
    const prefixes = {
        'Energieversorgung': 'EV',
        'Energieverteilung': 'EV_dist'
    };

    function getPrefix(group) {
        return prefixes[group] || group;
    }

    function fieldToStorageKey(fieldName) {
        // Convert field names to storage-safe format (e.g., "Anschlussleistung kW" -> "Anschlussleistung_kW")
        return fieldName.replace(/\s+/g, '_');
    }

    function storageKeyToField(key) {
        // Reverse: "Anschlussleistung_kW" -> "Anschlussleistung kW"
        return key.replace(/_/g, ' ');
    }

    function makeStorageKey(group, name, fieldName) {
        const prefix = getPrefix(group);
        const safeName = name.replace(/\s+/g, '_');
        const safeField = fieldToStorageKey(fieldName);
        return `${prefix}_${safeName}_${safeField}`;
    }

    function parseStorageKey(key, group) {
        // Parse "EV_Name_Field" back to {name, field}
        const prefix = getPrefix(group);
        if (!key.startsWith(prefix + '_')) return null;
        const rest = key.slice((prefix + '_').length);
        
        // Try to match against known field names to find boundary
        let fieldGroups = window.fieldGroups;
        if (!fieldGroups || !fieldGroups[group]) return null;
        
        const knownFields = fieldGroups[group];
        for (const field of knownFields) {
            const safField = fieldToStorageKey(field);
            if (rest.endsWith(safField)) {
                const nameEnd = rest.length - safField.length - 1; // -1 for separator underscore
                if (nameEnd > 0) {
                    const name = rest.slice(0, nameEnd).replace(/_/g, ' ');
                    return { name, field };
                }
            }
        }
        return null;
    }

    function getSubpageNames(group) {
        // Scan sessionStorage for all unique names in this group
        const prefix = getPrefix(group);
        const names = new Set();
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if (key && key.startsWith(prefix + '_')) {
                const parsed = parseStorageKey(key, group);
                if (parsed) names.add(parsed.name);
            }
        }
        return Array.from(names);
    }

    function getSubpage(group, name, fields) {
        // Retrieve all values for a subpage
        const data = {};
        fields.forEach(field => {
            const key = makeStorageKey(group, name, field);
            const v = sessionStorage.getItem(key);
            if (v !== null) data[field] = v;
        });
        return data;
    }

    function saveSubpage(group, name, data) {
        // Save all field values for a subpage
        for (const field in data) {
            const key = makeStorageKey(group, name, field);
            sessionStorage.setItem(key, String(data[field]));
        }
    }

    function deleteSubpage(group, name, fields) {
        // Remove all keys for a subpage
        fields.forEach(field => {
            const key = makeStorageKey(group, name, field);
            sessionStorage.removeItem(key);
        });
    }

    window.subpageStorage = {
        getPrefix,
        fieldToStorageKey,
        storageKeyToField,
        makeStorageKey,
        parseStorageKey,
        getSubpageNames,
        getSubpage,
        saveSubpage,
        deleteSubpage
    };
})();
