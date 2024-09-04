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
  // hide all views and attendee counter
  document
    .querySelectorAll(".view")
    .forEach((view) => (view.style.display = "none"));
  document.getElementById("attendee-counter").style.display = "none";

  // show view based on selected year
  if (selectedYear === 42) {
    document.getElementById("home").style.display = "block";
  } else if (selectedYear >= 2014 && selectedYear <= 2016) {
    document.getElementById("attendee-counter").style.display = "block";
    document.getElementById("view-2014-2016").style.display = "block";
  } else if (selectedYear === 2020) {
    document.getElementById("2020").style.display = "block";
  } else {
    document.getElementById("attendee-counter").style.display = "block";
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
    totalPlots(expenseData, donationData, attendeeData, selectedYear, colorMap);
  } else {
    displaySingleImage(`./resources/images/hp_logos/hp_${selectedYear}.jpg`);
    updateTotals(expenseData, donationData, attendeeData, selectedYear);
    singleYearPlots(expenseData, selectedYear, colorMap);
  }
}

// update expenses, donations, and attendees for selected year
function updateTotals(expenseData, donationData, attendeeData, selectedYear) {
  // calculate total expenses and donations for the selected year
  const totalAmount = calculateTotalAmount(expenseData, selectedYear);
  const totalDonations = calculateTotalDonations(donationData, selectedYear);

  // attendee counts based on selected year
  const { yesAttendees, maybeAttendees } =
    selectedYear === "all"
      ? {
          yesAttendees: attendeeData.reduce(
            (total, item) => total + parseInt(item.Going),
            0
          ),
          maybeAttendees: attendeeData.reduce(
            (total, item) => total + parseInt(item.Maybes),
            0
          ),
        }
      : {
          yesAttendees: parseInt(
            attendeeData.find((item) => parseInt(item.Year) === selectedYear)
              ?.Going || 0
          ),
          maybeAttendees: parseInt(
            attendeeData.find((item) => parseInt(item.Year) === selectedYear)
              ?.Maybes || 0
          ),
        };

  // calculate cost per attendee
  const costPerYes = yesAttendees ? totalAmount / yesAttendees : 0;
  const costPerYesAndMaybe =
    yesAttendees + maybeAttendees
      ? totalAmount / (yesAttendees + maybeAttendees)
      : 0;

  // calculate profit or loss
  const profitOrLoss = totalDonations - totalAmount;

  // Update HTML with the calculated data
  document.getElementById(
    "FB-stats"
  ).textContent = `Went: ${yesAttendees} Maybe: ${maybeAttendees}`;
  document.getElementById(
    "total-expenses"
  ).textContent = `Total Amount: $${totalAmount.toFixed(2)}`;
  document.getElementById(
    "total-donations"
  ).textContent = `Total Donations: $${totalDonations.toFixed(2)}`;
  document.getElementById(
    "profit-or-loss"
  ).textContent = profitOrLossText(profitOrLoss, selectedYear, expenseData, donationData);
  document.getElementById(
    "cost-per-yes"
  ).textContent = `Cost per Went: $${costPerYes.toFixed(2)}`;
  document.getElementById(
    "cost-per-yes-and-maybe"
  ).textContent = `Cost per Went and Maybe: $${costPerYesAndMaybe.toFixed(2)}`;

  // Toggle visibility of cost per attendee elements based on selected year
  const displayStyle = selectedYear === "all" ? "none" : "block";
  document.getElementById("cost-per-yes").style.display = displayStyle;
  document.getElementById("cost-per-yes-and-maybe").style.display =
    displayStyle;
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

// determine profit or loss text
function profitOrLossText(profitOrLoss, selectedYear, expenseData, donationData) {
    if (selectedYear === "all") {
        // Group amounts by year
        const yearlyTotals = expenseData.reduce((acc, item) => {
            const year = parseInt(item.Year);
            const amount = parseFloat(item.Amount);

            if (!acc[year]) {
                acc[year] = 0;
            }

            acc[year] += amount;
            return acc;
        }, {});

        // Sum the profits ignoring loss years and the year 2019
        const totalDonated = Object.keys(yearlyTotals).reduce((total, year) => {
            const donations = parseFloat(donationData.find(d => parseInt(d.Year) === parseInt(year))?.Donations || 0);
            const yearProfitOrLoss = donations - yearlyTotals[year];

            if (yearProfitOrLoss > 0 && parseInt(year) !== 2019) {
                return total + yearProfitOrLoss;
            }
            return total;
        }, 0);

        // Calculate the final profit or loss after subtracting total donations
        const netProfitOrLoss = profitOrLoss - totalDonated;

        return `Loss: $${Math.abs(netProfitOrLoss).toFixed(2)}<br>Total Donated over the Years: $${totalDonated.toFixed(2)}`;
    } else if (selectedYear === 2019) {
        return `Profit: $${profitOrLoss.toFixed(2)}<br>The surplus was a surprise. Never turned a profit before. I think we threw a pizza party`;
    } else if (profitOrLoss > 0) {
        return `Profit: $${profitOrLoss.toFixed(2)}<br>Donated to Capital Area Food Bank`;
    } else if (profitOrLoss < 0) {
        return `Loss: -$${Math.abs(profitOrLoss).toFixed(2)}`;
    } else {
        return "Break-even";
    }
}
