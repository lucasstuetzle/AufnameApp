// calculatekWinA.js
// Converts between Anschlussleistung in kW and A using the project's formulas.
document.addEventListener('DOMContentLoaded', function () {
    const kwInput = document.getElementById('Anschlussleistung kW');
    const aInput = document.getElementById('Anschlussleistung A');
    if (!kwInput || !aInput) return;

    let programmatic = false;

    function parseNumber(x) {
        if (x === null || x === undefined) return NaN;
        return parseFloat(String(x).trim().replace(',', '.'));
    }

    // kW -> A : A = kW * 1000 / 690
    function kwToA(kw) {
        const v = parseNumber(kw);
        if (isNaN(v)) return '';
        const a = v * 1000 / 690;
        return String(Math.round(a));
    }

    // A -> kW : kW = A * 690 / 1000
    function aToKw(a) {
        const v = parseNumber(a);
        if (isNaN(v)) return '';
        const kw = v * 690 / 1000;
        return String(Math.round(kw));
    }

    // When the user edits one field, clear the other and compute the new value.
    function handleKwInput() {
        // remove listener from A to avoid reacting while we update
        aInput.removeEventListener('input', handleAInput);
        // compute and set A (clear first visually)
        aInput.value = '';
        aInput.value = kwToA(kwInput.value);
        // reattach listener
        aInput.addEventListener('input', handleAInput);
    }

    function handleAInput() {
        kwInput.removeEventListener('input', handleKwInput);
        kwInput.value = '';
        kwInput.value = aToKw(aInput.value);
        kwInput.addEventListener('input', handleKwInput);
    }

    kwInput.addEventListener('input', handleKwInput);
    aInput.addEventListener('input', handleAInput);

    // initialize values on load if one is present
    if (kwInput.value) {
        aInput.value = kwToA(kwInput.value);
    } else if (aInput.value) {
        kwInput.value = aToKw(aInput.value);
    }
});
