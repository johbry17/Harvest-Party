document.addEventListener('DOMContentLoaded', function() {
    // load and parse csv's
    Promise.all([
        fetch('../resources/cleaned_expenses.csv').then(response => response.text()),
        fetch('../resources/cleaned_donations.csv').then(response => response.text())
    ])
        .then(([expenseText, donationText]) => {
            const expenseData = d3.csvParse(expenseText);
            const donationData = d3.csvParse(donationText);
            
            // initial call to update year
            updateYear(expenseData, donationData);

            // event listener for year selection
            document.getElementById('year').addEventListener('change', function() {
                updateYear(expenseData, donationData);
            });
        })
        .catch(error => console.error('Error fetching or parsing CSV:', error));
});

// switch divs shown
function switchView(selectedYear) {
    // hide all views
    document.querySelectorAll('.view').forEach(view => view.style.display = 'none');

    // show view based on selected year
    if (selectedYear >= 2014 && selectedYear <= 2016) {
        document.getElementById('view-2014-2016').style.display = 'block';
    } else if (selectedYear === 2020) {
        document.getElementById('2020').style.display = 'block';
    } else {
        document.getElementById('view-other-years').style.display = 'block';
    }
}

// update year based on selected year
function updateYear(expenseData, donationData) {
    // hacky, but upDateYear mysteriously is passed undefined data without being called...
    // ...and then the eventListener calls updateYear and it works fine
    if (!expenseData) {
        console.error('Data is undefined or null in updateYear.');
        return;
    }

    const yearSelect = document.getElementById('year');
    const selectedYear = parseInt(yearSelect.value);

    switchView(selectedYear);

    const totalAmount = calculateTotalAmount(expenseData, selectedYear);
    const donationEntry = donationData.find(item => parseInt(item.Year) === selectedYear);

    document.getElementById('total-expenses').textContent = `Total Amount: $${totalAmount.toFixed(2)}`;
    if (donationEntry) {
        const totalDonations = parseFloat(donationEntry.Donations);
        document.getElementById('total-donations').textContent = `Total Donations: $${totalDonations.toFixed(2)}`;
    } else {
        document.getElementById('total-donations').textContent = `Total Donations: $0.00`;
    }
}

// calculate total amount for selected year
function calculateTotalAmount(data, selectedYear) {
    return data
        .filter(item => parseInt(item.Year) === selectedYear)
        .reduce((total, item) => total + parseFloat(item.Amount), 0);
}

