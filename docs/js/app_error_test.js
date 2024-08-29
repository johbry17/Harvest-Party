document.addEventListener('DOMContentLoaded', function() {
    // load and parse csv's
    fetch('../resources/cleaned_expenses.csv')
    .then(response => response.text())
    .then((text) => {
        const data = d3.csvParse(text);

        // populate year dropdown
        populateYearDropdown();

        // initial call to update year
        updateYear(data);

        // event listener for year selection
        // interestingly, if you add a debouncer here, it will only "work" with 'change'
        // meaning that the undefined and actual data go through
        // with 'initial', the undefined data is sent to updateYear... and then the data doesn't go
        document.getElementById('year').addEventListener('change', function() {
            // the data is passed as undefined before here
            const selectedYear = parseInt(this.value);
            console.log('Year changed to:', selectedYear);

            updateYear(data);
        });
    })
    .catch(error => console.error('Error fetching or parsing CSV:', error));
});

// update year based on selected year
function updateYear(data) {
    console.log('Data passed to updateYear:', data);
    // upDateYear mysteriously is passed undefined data without being called...
    // ...and then the eventListener calls updateYear and it works fine
    if (!data) {
        console.error('Data is undefined or null in updateYear.');
        return;
    }

    // select year, update view
    const yearSelect = document.getElementById('year');
    const selectedYear = parseInt(yearSelect.value);
    const totalAmount = calculateTotalAmount(data, selectedYear);
    document.getElementById('total-expenses').textContent = `Total Amount: $${totalAmount.toFixed(2)}`;
}

// calculate total amount for selected year
function calculateTotalAmount(data, selectedYear) {
    // this error only throws if not caught in updateYear
    // NOT THE PROBLEM
    if (!data) {
        console.error('Data is undefined or null in calculateTotalAmount.');
        return;
    }

    return data
        .filter(item => parseInt(item.Year) === selectedYear)
        .reduce((total, item) => total + parseFloat(item.Amount), 0);
}


// populate the year dropdown
function populateYearDropdown() {
    const yearSelect = document.getElementById('year');

    // add "Total" manually
    const totalOption = document.createElement('option');
    totalOption.value = '1';
    totalOption.textContent = 'Total';
    yearSelect.appendChild(totalOption);

    // add years dynamically
    const years = [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    });
}