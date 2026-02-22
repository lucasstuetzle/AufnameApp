// calculatekWinA.js
// Converts between Anschlussleistung in kW and A using the project's formulas.
(function () {
    const kwInput = document.getElementById('Anschlussleistung kW');
    const aInput = document.getElementById('Anschlussleistung A');
    if (!kwInput || !aInput) return;

    let programmatic = false;

    function kwToA(kw) {
        const v = parseFloat(kw);
        if (isNaN(v)) return '';
        return (v / 690 * 1000).toFixed(2);
    }

    function aToKw(a) {
        const v = parseFloat(a);
        if (isNaN(v)) return '';
        return (v * 690 / 1000).toFixed(3);
    }

    kwInput.addEventListener('input', function () {
        if (programmatic) { programmatic = false; return; }
        const a = kwToA(kwInput.value);
        programmatic = true;
        aInput.value = a;
    });

    aInput.addEventListener('input', function () {
        if (programmatic) { programmatic = false; return; }
        const kw = aToKw(aInput.value);
        programmatic = true;
        kwInput.value = kw;
    });

    // initialize values on load if one is present
    if (kwInput.value) {
        aInput.value = kwToA(kwInput.value);
    } else if (aInput.value) {
        kwInput.value = aToKw(aInput.value);
    }
})();
