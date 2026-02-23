
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

        // Sammle alle sessionStorage-Werte, die zu unseren bekannten Feldern gehören,
        // inklusive nummerierter Unterseiten wie "Anzahl Ladepunkte1".
        const baseFields = (window && window.fields) ? window.fields : [];
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            const value = sessionStorage.getItem(key);
            if (value === null) continue;
            const trimmed = value.trim();
            if (trimmed === "") continue;

            for (const base of baseFields) {
                if (key === base) {
                    data[key] = trimmed;
                    break;
                }
                if (key.startsWith(base)) {
                    // remainder should be numeric index, e.g., 'Anzahl Ladepunkte2'
                    const suffix = key.slice(base.length);
                    if (/^\d+$/.test(suffix)) {
                        data[key] = trimmed;
                        break;
                    }
                }
            }
        }

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

    // If the page provides add-subpage UI, wire it up
    const addBtn = document.getElementById('addSubpageBtn');
    if (addBtn) {
        addBtn.addEventListener('click', function () {
            const group = detectGroupName();
            if (!group) return alert('Kann Gruppe nicht bestimmen.');
            addSubpageForGroup(group);
            renderSubpagesList(group);
        });

        // initial render
        const group = detectGroupName();
        if (group) renderSubpagesList(group);
    }

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

    // Helpers for subpage management
    function detectGroupName() {
        // Try document.title (matches the HTML <title>) or body h1
        const title = (document.title || '').trim();
        if (title && window.fieldGroups && window.fieldGroups[title]) return title;
        const h1 = document.querySelector('h1');
        if (h1 && window.fieldGroups && window.fieldGroups[h1.textContent.trim()]) return h1.textContent.trim();
        return null;
    }

    function addSubpageForGroup(group) {
        const groupFields = window.fieldGroups && window.fieldGroups[group] ? window.fieldGroups[group] : [];
        const keyListName = `subpages_${group}`;
        const raw = sessionStorage.getItem(keyListName);
        const list = raw ? JSON.parse(raw) : [];

        // determine next sequential index
        const nextIndex = (list.length === 0) ? 1 : (Math.max(...list.map(i => Number(i))) + 1);

        // optional title
        const titleInput = document.getElementById('subpageTitle');
        const title = titleInput ? titleInput.value.trim() : '';

        // save each field as FieldName + index
        groupFields.forEach(field => {
            const el = document.getElementById(field);
            const value = el ? el.value : sessionStorage.getItem(field) || '';
            sessionStorage.setItem(field + nextIndex, value);
        });

        // store metadata for this subpage
        list.push(nextIndex);
        sessionStorage.setItem(keyListName, JSON.stringify(list));
        if (title) sessionStorage.setItem(`subpageTitle_${group}_${nextIndex}`, title);
        alert(`Unterseite ${nextIndex} hinzugefügt.`);
    }

    function renderSubpagesList(group) {
        const container = document.getElementById('subpagesList');
        if (!container) return;
        const keyListName = `subpages_${group}`;
        const raw = sessionStorage.getItem(keyListName);
        const list = raw ? JSON.parse(raw) : [];
        container.innerHTML = '';
        if (list.length === 0) {
            container.textContent = 'Keine Unterseiten vorhanden.';
            return;
        }
        const ul = document.createElement('ul');
        list.forEach(idx => {
            const li = document.createElement('li');
            const title = sessionStorage.getItem(`subpageTitle_${group}_${idx}`) || `${group} ${idx}`;
            const loadBtn = document.createElement('button');
            loadBtn.textContent = `Anzeigen: ${title}`;
            loadBtn.addEventListener('click', function () { loadSubpage(group, idx); });

            const delBtn = document.createElement('button');
            delBtn.textContent = 'Löschen';
            delBtn.addEventListener('click', function () { deleteSubpage(group, idx); renderSubpagesList(group); });

            li.appendChild(loadBtn);
            li.appendChild(document.createTextNode(' '));
            li.appendChild(delBtn);
            ul.appendChild(li);
        });
        container.appendChild(ul);
    }

    function loadSubpage(group, idx) {
        const groupFields = window.fieldGroups && window.fieldGroups[group] ? window.fieldGroups[group] : [];
        groupFields.forEach(field => {
            const key = field + idx;
            const value = sessionStorage.getItem(key);
            const el = document.getElementById(field);
            if (value !== null && el) {
                el.value = value;
                sessionStorage.setItem(field, value);
            }
        });
        alert(`Unterseite ${idx} geladen.`);
    }

    function deleteSubpage(group, idx) {
        const groupFields = window.fieldGroups && window.fieldGroups[group] ? window.fieldGroups[group] : [];
        groupFields.forEach(field => sessionStorage.removeItem(field + idx));
        sessionStorage.removeItem(`subpageTitle_${group}_${idx}`);
        const keyListName = `subpages_${group}`;
        const raw = sessionStorage.getItem(keyListName);
        const list = raw ? JSON.parse(raw) : [];
        const updated = list.filter(i => Number(i) !== Number(idx));
        sessionStorage.setItem(keyListName, JSON.stringify(updated));
        alert(`Unterseite ${idx} gelöscht.`);
    }
});
