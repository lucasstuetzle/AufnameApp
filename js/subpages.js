/* Generic subpage manager for sections like Energieversorgung / Energieverteilung
   Usage: call initSubpageManager({group: 'Energieversorgung', fields: [...], summaryFields: [...]})
*/
(function () {
    function initSubpageManager(opts) {
        const group = opts.group;
        const fields = opts.fields || [];
        const summaryFields = opts.summaryFields || fields.slice(0, 2);

        const createBtn = document.getElementById('createSubpageBtn');
        const listContainer = document.getElementById('subpagesOverview');

        if (!createBtn || !listContainer) return;

        createBtn.addEventListener('click', () => openEditor());

        renderList();

        function keyListName() { return `subpages_${group}`; }

        function getList() {
            const raw = sessionStorage.getItem(keyListName());
            return raw ? JSON.parse(raw) : [];
        }

        function setList(list) { sessionStorage.setItem(keyListName(), JSON.stringify(list)); }

        function nextIndex(list) {
            if (!list || list.length === 0) return 1;
            return Math.max(...list.map(i => Number(i))) + 1;
        }

        function openEditor(idx) {
            // create modal overlay
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.left = 0; overlay.style.top = 0; overlay.style.right = 0; overlay.style.bottom = 0;
            overlay.style.background = 'rgba(0,0,0,0.4)';
            overlay.style.display = 'flex';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            const box = document.createElement('div');
            box.style.background = '#fff';
            box.style.padding = '16px';
            box.style.maxWidth = '480px';
            box.style.width = '90%';
            box.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';

            const title = document.createElement('h2');
            title.textContent = idx ? `Unterseite bearbeiten ${idx}` : `Neue Unterseite für ${group}`;
            box.appendChild(title);

            const form = document.createElement('form');
            form.id = 'subpageEditorForm';

            // optional title field
            const tLabel = document.createElement('label');
            tLabel.textContent = 'Titel (optional)';
            const tInput = document.createElement('input');
            tInput.type = 'text';
            tInput.id = 'subpageEditorTitle';
            form.appendChild(tLabel);
            form.appendChild(tInput);

            fields.forEach(f => {
                const lab = document.createElement('label');
                lab.textContent = f;
                const inp = document.createElement('input');
                inp.name = f;
                // try to detect type
                inp.type = /kapaz|Anschlussleistung|capacity|time|Anzahl|lp|required/i.test(f) ? 'number' : 'text';
                form.appendChild(lab);
                form.appendChild(inp);
            });

            const saveBtn = document.createElement('button');
            saveBtn.type = 'button';
            saveBtn.textContent = 'Speichern';
            const cancelBtn = document.createElement('button');
            cancelBtn.type = 'button';
            cancelBtn.textContent = 'Abbrechen';

            saveBtn.addEventListener('click', () => {
                const formData = new FormData(form);
                const list = getList();
                const id = idx || nextIndex(list);
                fields.forEach(f => {
                    const v = formData.get(f);
                    sessionStorage.setItem(f + id, v === null ? '' : String(v));
                });
                const titleVal = formData.get('subpageEditorTitle') || '';
                if (titleVal) sessionStorage.setItem(`subpageTitle_${group}_${id}`, titleVal);
                if (!list.includes(id)) { list.push(id); setList(list); }
                document.body.removeChild(overlay);
                renderList();
            });

            cancelBtn.addEventListener('click', () => { document.body.removeChild(overlay); });

            box.appendChild(form);
            box.appendChild(saveBtn);
            box.appendChild(cancelBtn);
            overlay.appendChild(box);
            document.body.appendChild(overlay);

            // if editing, populate
            if (idx) {
                const list = getList();
                fields.forEach(f => {
                    const v = sessionStorage.getItem(f + idx) || '';
                    const inp = form.querySelector(`[name="${f}"]`);
                    if (inp) inp.value = v;
                });
                const titleVal = sessionStorage.getItem(`subpageTitle_${group}_${idx}`) || '';
                tInput.value = titleVal;
            }
        }

        function renderList() {
            const list = getList();
            listContainer.innerHTML = '';
            if (!list || list.length === 0) {
                listContainer.textContent = 'Keine Unterseiten vorhanden.';
                return;
            }
            const ul = document.createElement('ul');
            list.forEach(id => {
                const li = document.createElement('li');
                const title = sessionStorage.getItem(`subpageTitle_${group}_${id}`) || `${group} ${id}`;
                const summary = summaryFields.map(f => `${f}${id}: ${sessionStorage.getItem(f + id) || '-'} `).join(', ');
                li.textContent = `${title} — ${summary}`;
                const edit = document.createElement('button'); edit.textContent = 'Bearbeiten';
                edit.addEventListener('click', () => openEditor(id));
                const del = document.createElement('button'); del.textContent = 'Löschen';
                del.addEventListener('click', () => { deleteEntry(id); renderList(); });
                li.appendChild(document.createTextNode(' '));
                li.appendChild(edit);
                li.appendChild(document.createTextNode(' '));
                li.appendChild(del);
                ul.appendChild(li);
            });
            listContainer.appendChild(ul);
        }

        function deleteEntry(id) {
            fields.forEach(f => sessionStorage.removeItem(f + id));
            sessionStorage.removeItem(`subpageTitle_${group}_${id}`);
            const list = getList().filter(i => Number(i) !== Number(id));
            setList(list);
        }
    }

    window.initSubpageManager = initSubpageManager;
})();
