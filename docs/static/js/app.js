document.addEventListener("DOMContentLoaded", function () {
  // load and parse csv's
  Promise.all([
    fetch("./resources/home_page.md").then((response) => response.text()),
    fetch("./resources/cleaned_expenses.csv").then((response) =>
      response.text()
    ),
    fetch("./resources/cleaned_donations.csv").then((response) =>
      response.text()
    ),
    fetch("./resources/cleaned_attendees.csv").then((response) =>
      response.text()
    ),
  ])
    .then(([homePageText, expenseText, donationText, attendeeText]) => {
      const homePageInfo = marked.parse(homePageText);
      const expenseData = d3.csvParse(expenseText);
      const donationData = d3.csvParse(donationText);
      const attendeeData = d3.csvParse(attendeeText);

      // populate year dropdown
      populateYearDropdown(expenseData);

      // get color map for categories, to ensure consistent colors across plots
      const colorMap = getColorMap(expenseData);

      // initial call to update year
      updateYear(
        homePageInfo,
        expenseData,
        donationData,
        attendeeData,
        colorMap
      );

      // event listener for year selection
      document.getElementById("year").addEventListener("change", function () {
        updateYear(
          homePageInfo,
          expenseData,
          donationData,
          attendeeData,
          colorMap
        );
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

  // add "Home" manually
  const homeOption = document.createElement("option");
  homeOption.value = "42";
  homeOption.textContent = "Home";
  yearSelect.appendChild(homeOption);

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
}

// switch divs shown
function switchView(selectedYear) {
  // hide all views
  document
    .querySelectorAll(".view")
    .forEach((view) => (view.style.display = "none"));

  document.getElementById("attendee-counter").style.display = "block";

  // show view based on selected year
  if (selectedYear === 42) {
    document.getElementById("attendee-counter").style.display = "none";
    document.getElementById("home").style.display = "block";
  } else if (selectedYear >= 2014 && selectedYear <= 2016) {
    document.getElementById("view-2014-2016").style.display = "block";
  } else if (selectedYear === 2020) {
    document.getElementById("2020").style.display = "block";
  } else {
    document.getElementById("view-other-years").style.display = "block";
  }
}

// update based on selected year
function updateYear(
  homePageInfo,
  expenseData,
  donationData,
  attendeeData,
  colorMap
) {
  // select year, update view
  const yearSelect = document.getElementById("year");
  const selectedYear = parseInt(yearSelect.value);
  switchView(selectedYear);

  // conditional for home page, grand total, or specific year
  if (selectedYear === 42) {
    displaySingleImage(`./resources/images/welcome.jpg`);
    document.getElementById("markdown-content").innerHTML = homePageInfo;
  } else if (selectedYear === 1) {
    displayMultipleImages(`./resources/images/hp_pics/*.jpg`);
    updateTotals(expenseData, donationData, attendeeData, "all");
    totalPlots(
        expenseData, 
        donationData, 
        attendeeData, 
        selectedYear, 
        colorMap
    );
  } else {
    displaySingleImage(`./resources/images/hp_logos/hp_${selectedYear}.jpg`);
    updateTotals(expenseData, donationData, attendeeData, selectedYear);
    singleYearPlots(
      expenseData,
      donationData,
      attendeeData,
      selectedYear,
      colorMap
    );
  }
}

// update expenses, donations, and attendees for selected year
function updateTotals(expenseData, donationData, attendeeData, selectedYear) {
  // extract data for selected year
  const totalAmount = calculateTotalAmount(expenseData, selectedYear);
  const totalDonations = calculateTotalDonations(donationData, selectedYear);

  let yesAttendees, maybeAttendees;

  // conditional for all years or specific year
  if (selectedYear === "all") {
    yesAttendees = attendeeData.reduce(
      (total, item) => total + parseInt(item.Going),
      0
    );
    maybeAttendees = attendeeData.reduce(
      (total, item) => total + parseInt(item.Maybes),
      0
    );
  } else {
    yesAttendees = parseInt(
      attendeeData.find((item) => parseInt(item.Year) === selectedYear)?.Going
    );
    maybeAttendees = parseInt(
      attendeeData.find((item) => parseInt(item.Year) === selectedYear)?.Maybes
    );
  }

  // update HTML with data
  document.getElementById(
    "total-expenses"
  ).textContent = `Total Amount: $${totalAmount.toFixed(2)}`;
  document.getElementById(
    "total-donations"
  ).textContent = `Total Donations: $${totalDonations.toFixed(2)}`;
  document.getElementById(
    "FB-stats"
  ).textContent = `Yes: ${yesAttendees}     Maybe: ${maybeAttendees}`;
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
