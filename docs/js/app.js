document.addEventListener('DOMContentLoaded', function() {
    // load and parse csv
    fetch('../resources/cleaned_expenses.csv')
        .then(response => response.text())
        .then(text => {
            const data = d3.csvParse(text);
            // initial call to update year
            updateYear(data);

            // event listener for year selection
            document.getElementById('year').addEventListener('change', function() {
                updateYear(data);
            });
        })
});

function updateYear(data) {
    const yearSelect = document.getElementById('year');
    const selectedYear = parseInt(yearSelect.value);
    const totalAmount = calculateTotalAmount(data, selectedYear);
    document.getElementById('total-amount').textContent = `Total Amount: $${totalAmount.toFixed(2)}`;
}

function calculateTotalAmount(data, selectedYear) {
    return data
        .filter(item => parseInt(item.Year) === selectedYear)
        .reduce((total, item) => total + parseFloat(item.Amount), 0);
}

