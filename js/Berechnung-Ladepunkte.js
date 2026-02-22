// Berechnung-Ladepunkte.js
// Berechnet die benötigte Energie basierend auf Anzahl Ladepunkte und Mode (GLF oder kW/SP)
document.addEventListener('DOMContentLoaded', function () {
    const countInput = document.getElementById('Anzahl Ladepunkte');
    const modeSelect = document.getElementById('lpMode');
    const slider = document.getElementById('lpSlider');
    const sliderValue = document.getElementById('lpSliderValue');
    const out = document.getElementById('requiredEnergy');

    if (!countInput || !modeSelect || !slider || !sliderValue || !out) return;

    function parseNumber(x) {
        if (x === null || x === undefined) return NaN;
        return parseFloat(String(x).trim().replace(',', '.'));
    }

    function updateSliderRange() {
        const mode = modeSelect.value;
        if (mode === 'GLF') {
            slider.min = 0.1; slider.max = 1; slider.step = 0.1;
        } else {
            slider.min = 0.1; slider.max = 11; slider.step = 0.1;
        }
        // keep slider value in range
        if (parseNumber(slider.value) < parseNumber(slider.min)) slider.value = slider.min;
        if (parseNumber(slider.value) > parseNumber(slider.max)) slider.value = slider.max;
        sliderValue.textContent = slider.value;
    }

    function compute() {
        const count = parseNumber(countInput.value) || 0;
        const mode = modeSelect.value;
        const s = parseNumber(slider.value) || 0;
        let result = 0;
        if (mode === 'GLF') {
            // Anzahl Ladepunkte * GLF * 11
            result = count * s * 11;
        } else {
            // Anzahl Ladepunkte * kW per SP
            result = count * s;
        }
        out.value = String(Math.round(result));
    }

    // Event handlers
    modeSelect.addEventListener('change', function () {
        updateSliderRange();
        compute();
    });

    slider.addEventListener('input', function () {
        sliderValue.textContent = slider.value;
        compute();
    });

    countInput.addEventListener('input', function () {
        compute();
    });

    // init
    updateSliderRange();
    compute();
});
