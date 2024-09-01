document.addEventListener("DOMContentLoaded", function () {
  // load and parse csv's
  Promise.all([
    fetch("../resources/cleaned_expenses.csv").then((response) =>
      response.text()
    ),
    fetch("../resources/cleaned_donations.csv").then((response) =>
      response.text()
    ),
  ])
    .then(([expenseText, donationText]) => {
      const expenseData = d3.csvParse(expenseText);
      const donationData = d3.csvParse(donationText);

      // populate year dropdown
      populateYearDropdown(expenseData);

      // initial call to update year
      updateYear(expenseData, donationData);

      // event listener for year selection
      document.getElementById("year").addEventListener("change", function () {
        updateYear(expenseData, donationData);
      });
    })
    .catch((error) => console.error("Error fetching or parsing CSV:", error));
});

// populate the year dropdown
function populateYearDropdown(expenseData) {
  const yearSelect = document.getElementById("year");

  // determine max year
  const maxYear = expenseData.reduce((max, d) => {
    const year = parseInt(d.Year);
    return year > max ? year : max;
  }, 2014); // party started in 2014 - in fact, no data before 2017

  // add "Total" manually
  const totalOption = document.createElement("option");
  totalOption.value = "1";
  totalOption.textContent = "Total";
  yearSelect.appendChild(totalOption);

  // add years dynamically
  for (let year = 2014; year <= maxYear; year++) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }
//   const years = [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
//   years.forEach((year) => {
//     const option = document.createElement("option");
//     option.value = year;
//     option.textContent = year;
//     yearSelect.appendChild(option);
//   });
}

// switch divs shown
function switchView(selectedYear) {
  // hide all views
  document
    .querySelectorAll(".view")
    .forEach((view) => (view.style.display = "none"));

  // show view based on selected year
  if (selectedYear >= 2014 && selectedYear <= 2016) {
    document.getElementById("view-2014-2016").style.display = "block";
  } else if (selectedYear === 2020) {
    document.getElementById("2020").style.display = "block";
  } else {
    document.getElementById("view-other-years").style.display = "block";
  }
}

// update year based on selected year
function updateYear(expenseData, donationData) {
  // hacky, but upDateYear mysteriously is passed undefined data without being called...
  // ...and then the eventListener calls updateYear and it works fine
  if (!expenseData) {
    console.error("Data is undefined or null in updateYear.");
    return;
  }

  // select year, update view
  const yearSelect = document.getElementById("year");
  const selectedYear = parseInt(yearSelect.value);
  switchView(selectedYear);

  // conditional for grand total or others
  if (selectedYear === 1) {
    displayMultipleImages("../resources/images/hp_pics/*.jpg");
    updateTotal(expenseData, donationData, "all");
    barPlot(expenseData, selectedYear);
    treemapPlot(expenseData, selectedYear);
  } else {
    displaySingleImage(`../resources/images/hp_logos/hp_${selectedYear}.jpg`);
    updateTotal(expenseData, donationData, selectedYear);
    barPlot(expenseData, selectedYear);
    treemapPlot(expenseData, selectedYear);
  }
}

// update total amount and donations for selected year
function updateTotal(expenseData, donationData, selectedYear) {
  const totalAmount = calculateTotalAmount(expenseData, selectedYear);
  const totalDonations = calculateTotalDonations(donationData, selectedYear);

  document.getElementById(
    "total-expenses"
  ).textContent = `Total Amount: $${totalAmount.toFixed(2)}`;
  document.getElementById(
    "total-donations"
  ).textContent = `Total Donations: $${totalDonations.toFixed(2)}`;
}

// calculate total amount for selected year
function calculateTotalAmount(data, selectedYear) {
  if (selectedYear === "all") {
    return data.reduce((total, item) => total + parseFloat(item.Amount), 0);
  } else {
    return data
      .filter((item) => parseInt(item.Year) === selectedYear)
      .reduce((total, item) => total + parseFloat(item.Amount), 0);
  }
}

// calculate total donations for selected year
function calculateTotalDonations(data, selectedYear) {
  if (selectedYear === "all") {
    return data.reduce((total, item) => total + parseFloat(item.Donations), 0);
  } else {
    const donationEntry = data.find(
      (item) => parseInt(item.Year) === selectedYear
    );
    if (donationEntry) {
      return parseFloat(donationEntry.Donations);
    } else {
      return 0;
    }
  }
}
