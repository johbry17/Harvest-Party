document.addEventListener("DOMContentLoaded", async function () {
  // load and parse csv's
  try {
    const [homePageText, expenseText, donationText, attendeeText, reimbText] =
      await Promise.all([
        fetch("./resources/home_page.md").then((res) => res.text()),
        fetch("./resources/cleaned_expenses.csv").then((res) => res.text()),
        fetch("./resources/cleaned_donations.csv").then((res) => res.text()),
        fetch("./resources/cleaned_attendees.csv").then((res) => res.text()),
        fetch("./resources/cleaned_reimbursements.csv").then((res) =>
          res.text()
        ),
      ]);

    const homePageInfo = marked.parse(homePageText);
    const expenseData = d3.csvParse(expenseText);
    const donationData = d3.csvParse(donationText);
    const attendeeData = d3.csvParse(attendeeText);
    const reimbData = d3.csvParse(reimbText);

    // welcome modal
    const modal = document.getElementById("welcome-modal");
    modal.style.display = "flex"; // toggle modal display on / off
    modal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // populate year dropdown
    populateYearDropdown(attendeeData);

    // get color map for categories, to ensure consistent colors across plots
    const colorMap = getColorMap(expenseData);

    // declare variables
    const yearSelect = document.getElementById("year");
    const homeButton = document.getElementById("home-link");
    const updateView = () => {
      updateYear(
        homePageInfo,
        expenseData,
        donationData,
        attendeeData,
        reimbData,
        colorMap
      );
    };

    // initial call to update year, plot sizer
    updateView();
    resizePlots();

    // eventListeners for plot resize, year dropdown, and home button
    window.addEventListener("resize", resizePlots);
    yearSelect.addEventListener("change", updateView);
    homeButton.addEventListener("click", () => {
      yearSelect.value = 42;
      updateView();
    });
  } catch (error) {
    console.error("Error fetching or parsing CSV:", error);
  }
});

// populate the year dropdown
function populateYearDropdown(attendeeData) {
  const yearSelect = document.getElementById("year");

  // get year range from attendee data
  const years = attendeeData.map((item) => parseInt(item.Year));
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  const yearRange = [];
  for (let year = minYear; year <= maxYear; year++) {
    yearRange.push(year);
  }

  // add "Home" and "Total" options manually
  const homeOption = new Option("Home", 42);
  const totalOption = new Option("Total", 1);
  yearSelect.add(homeOption);
  yearSelect.add(totalOption);

  // add years dynamically
  yearRange.forEach((year) => {
    const option = new Option(year, year);
    yearSelect.add(option);
  });
}

// switch divs shown
function switchView(selectedYear) {
  // hide all views and attendee counter
  document
    .querySelectorAll(".view")
    .forEach((view) => (view.style.display = "none"));
  document.getElementById("attendee-counter").style.display = "none";

  // turn on carousel-images (it's off for 2020)
  const carouselDiv = document.querySelector(".carousel-images");
  carouselDiv.style.display = "block";

  const carouselControlDiv = document.querySelector(".carousel-controls");
  carouselControlDiv.style.display = selectedYear === 42 || selectedYear === 1 ? "flex" : "none";

  // show view based on selected year
  if (selectedYear === 42) {
    document.getElementById("home").style.display = "block";
  } else if (selectedYear >= 2014 && selectedYear <= 2016) {
    document.getElementById("attendee-counter").style.display = "block";
    document.getElementById("view-2014-2016").style.display = "block";
  } else if (selectedYear === 2020) {
    carouselDiv.style.display = "none";
    document.getElementById("year-2020").style.display = "block";
    rollMask(); // tee-hee
    setInterval(rollMask, 10000); // repeatedly roll mask
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
  reimbData,
  colorMap
) {
  // select year, update view
  const selectedYear = parseInt(document.getElementById("year").value);
  switchView(selectedYear);
  setHomeLogo(expenseData);

  // conditional for home page, grand total, or specific year
  if (selectedYear === 42) {
    displayMultipleImages("home");
    document.getElementById("markdown-content").innerHTML = homePageInfo;
  } else if (selectedYear === 1) {
    displayMultipleImages("total");
    updateTotals(expenseData, donationData, attendeeData, "all");
    totalPlots(
      expenseData,
      donationData,
      attendeeData,
      reimbData,
      selectedYear,
      colorMap
    );
  } else {
    displaySingleImage(`./static/images/hp_logos/hp_${selectedYear}.jpg`);
    updateTotals(expenseData, donationData, attendeeData, selectedYear);
    singleYearPlots(expenseData, selectedYear, colorMap);
  }
}

// update expenses, donations, and attendees for selected year
function updateTotals(expenseData, donationData, attendeeData, selectedYear) {
  // conditional for all years over a single year
  const filterByYear = (data, year) =>
    year === "all" ? data : data.filter((item) => parseInt(item.Year) === year);

  // function to calculate totals for a given field
  // "|| 0" to handle NaN in 2024 attendee data
  const calculateTotal = (data, field) =>
    data.reduce((total, item) => total + (parseFloat(item[field]) || 0), 0);

  // calculate total expenses and donations for the selected year
  const totalAmount = calculateTotal(
    filterByYear(expenseData, selectedYear),
    "Amount"
  );
  const totalDonations = calculateTotal(
    filterByYear(donationData, selectedYear),
    "Donations"
  );

  // // calculate attendee totals, pre 2024
  // const yesAttendees =
  //   selectedYear === "all"
  //     ? calculateTotal(attendeeData, "Going")
  //     : parseInt(
  //         attendeeData.find((item) => parseInt(item.Year) === selectedYear)
  //           ?.Going || 0
  //       );
  // const maybeAttendees =
  //   selectedYear === "all"
  //     ? calculateTotal(attendeeData, "Maybes")
  //     : parseInt(
  //         attendeeData.find((item) => parseInt(item.Year) === selectedYear)
  //           ?.Maybes || 0
  //       );

  // calculate attendee totals, with 2024
  let yesAttendees = 0;
  let maybeAttendees = 0;

  if (selectedYear !== 2024) {
    yesAttendees =
      selectedYear === "all"
        ? calculateTotal(attendeeData, "Going")
        : parseInt(
            attendeeData.find((item) => parseInt(item.Year) === selectedYear)
              ?.Going || 0
          );
    maybeAttendees =
      selectedYear === "all"
        ? calculateTotal(attendeeData, "Maybes")
        : parseInt(
            attendeeData.find((item) => parseInt(item.Year) === selectedYear)
              ?.Maybes || 0
          );
  }

  // calculate cost per attendee metrics
  const costPerYes = yesAttendees ? totalAmount / yesAttendees : 0;
  const costPerYesAndMaybe =
    yesAttendees + maybeAttendees
      ? totalAmount / (yesAttendees + maybeAttendees)
      : 0;

  const profitOrLoss = totalDonations - totalAmount;

  // // update HTML with the calculated data, pre 2024
  // document.getElementById("rsvp-count").textContent = yesAttendees;
  // document.getElementById("maybe-count").textContent = maybeAttendees;
  // document.getElementById("total-amount").innerHTML = `$${totalAmount.toFixed(
  //   2
  // )}`;
  // document.getElementById(
  //   "total-donations"
  // ).textContent = `$${totalDonations.toFixed(2)}`;
  // document.getElementById("profit-loss-value").innerHTML = profitOrLossText(
  //   profitOrLoss,
  //   selectedYear,
  //   expenseData,
  //   donationData
  // );
  // document.getElementById("rsvp-amount").innerHTML = `$${costPerYes.toFixed(
  //   2
  // )}`;
  // document.getElementById(
  //   "rsvp-maybe-amount"
  // ).innerHTML = `$${costPerYesAndMaybe.toFixed(2)}`;

  // update HTML with the calculated data, with 2024
  if (selectedYear === 2024) {
    document.getElementById("rsvp-count").textContent = "?";
    document.getElementById("maybe-count").textContent = "?";
    document.getElementById("rsvp-amount").textContent = "?";
    document.getElementById("rsvp-maybe-amount").textContent = "?";
    document.getElementById("irrelevant-metric").style.display = "block";
    document.getElementById("young-once?").style.display = "block";
  } else {
    document.getElementById("rsvp-count").textContent = yesAttendees;
    document.getElementById("maybe-count").textContent = maybeAttendees;
    document.getElementById("rsvp-amount").innerHTML = `$${costPerYes.toFixed(
      2
    )}`;
    document.getElementById(
      "rsvp-maybe-amount"
    ).innerHTML = `$${costPerYesAndMaybe.toFixed(2)}`;
    document.getElementById("irrelevant-metric").style.display = "none";
    document.getElementById("young-once?").style.display = "none";
  }

  // document.getElementById("total-amount").innerHTML = `$${totalAmount.toFixed(
  //   2
  // )}`;
  // document.getElementById(
  //   "total-donations"
  // ).textContent = `$${totalDonations.toFixed(2)}`;
  document.getElementById("total-amount").innerHTML = `$${totalAmount.toLocaleString(
    undefined,
    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
  )}`;
  document.getElementById(
    "total-donations"
  ).textContent = `$${totalDonations.toLocaleString(
    undefined,
    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
  )}`;
  document.getElementById("profit-loss-value").innerHTML = profitOrLossText(
    profitOrLoss,
    selectedYear,
    expenseData,
    donationData
  );

  // toggle visibility of cost per attendee elements based on selected year
  document.getElementById("cost-per-attendee").style.display =
    selectedYear === "all" ? "none" : "block";
  document.getElementById("end-metric").style.display =
    selectedYear === "all" ? "block" : "none";
}

// determine profit or loss text
function profitOrLossText(
  profitOrLoss,
  selectedYear,
  expenseData,
  donationData
) {
  // group expense amounts by year
  if (selectedYear === "all") {
    const yearlyTotals = expenseData.reduce((acc, item) => {
      acc[item.Year] = (acc[item.Year] || 0) + parseFloat(item.Amount);
      return acc;
    }, {});

    // sum profits, ignoring loss years and the year 2019
    const totalDonated = Object.keys(yearlyTotals).reduce((total, year) => {
      const donations = parseFloat(
        donationData.find((d) => parseInt(d.Year) === parseInt(year))
          ?.Donations || 0
      );
      const yearProfitOrLoss = donations - yearlyTotals[year];

      if (yearProfitOrLoss > 0 && parseInt(year) !== 2019) {
        return total + yearProfitOrLoss;
      }
      return total;
    }, 0);

    // calculate 2019 profit
    const profitOrLoss2019 = yearlyTotals[2019]
      ? parseFloat(
          donationData.find((d) => parseInt(d.Year) === 2019)?.Donations || 0
        ) - yearlyTotals[2019]
      : 0;

    // calculate net loss (after subtracting donations) to Harvest Party hosts
    // technically, 2019 was a profit, but nobody knows what happened to the $179
    // we were surprised to have a profit, probably got pizza
    // flimsy justification for pocketing the money, but this is where the idea to donate came from
    const netProfitOrLoss = profitOrLoss - totalDonated - profitOrLoss2019;

    return `<i class="fas fa-exclamation-triangle"></i> Loss to Hosts:<br>$${Math.abs(netProfitOrLoss).toLocaleString(
      undefined,
      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    )}<br><br><i class="fas fa-hand-holding-heart"></i><br>Total Donated to Capital Area Food Bank over the Years:<br>$${totalDonated.toLocaleString(
      undefined,
      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    )}`;
  } else if (selectedYear === 2019) {
    return `<i class="fas fa-piggy-bank"></i> Profit:<br>$${profitOrLoss.toFixed(
      2
    )}<br>The surplus was a surprise. Never turned a profit before. I think we threw a pizza party`;
  } else if (profitOrLoss > 0) {
    return `<i class="fas fa-donate"></i> Profit:<br>$${profitOrLoss.toLocaleString(
      undefined,
      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    )}<br><i class="fas fa-gift"></i> Donated to Capital Area Food Bank`;
  } else if (profitOrLoss < 0) {
    return `<i class="fas fa-frown"></i> Loss:<br>-$${Math.abs(profitOrLoss).toLocaleString(
      undefined,
      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    )}`;
  } else {
    return "Break-even";
  }
}

// resize plots on window resize
function resizePlots() {
  // all plotly plot ids
  const plotIds = [
    "bar-plot",
    "treemap-plot",
    "individual-expenses-bar-plot",
    "sunburst-plot",
    "category-line-plot",
    "total-expenses-donations-bar-plot",
    "total-expenses-donations-line-plot",
    "donations-v-expenses-plot",
    "cost-per-attendee-plot",
    "attendee-plot",
    "expense-table",
    "corn-kings-and-queens",
  ];

  plotIds.forEach((id) => {
    const container = document.getElementById(id);
    if (container) {
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      // Ensure dimensions are valid
      if (containerWidth > 0 && containerHeight > 0) {
        Plotly.relayout(container, {
          width: containerWidth,
          height: containerHeight,
        });
      }
    }
  });
}
