// I'm sure I could refactor many of these plot functions to be more DRY

// color scale for colorMap and plots
const harvestColors = [
  "#2a9d8f", // teal
  "#f4a261", // amber
  "#e76f51", // orange-red
  "#e9c46a", // gold
  "#6d6875", // smoky mauve
  "#a98467", // clay
  "#b5838d", // rosewood
  "#8e9aaf", // soft slate
  "#ccd5ae", // pale sage
];
const attendeeGreen = "#4caf50"; // green for attendees

// call plots for total view
function totalPlots(
  data,
  donationData,
  attendeeData,
  reimbData,
  selectedYear,
  colorMap
) {
  clearElements(false);
  document.getElementById("individual-expenses-bar-plot").style.display =
    "none";
  expensePieChartWithBackground(data, selectedYear);
  barPlot(data, selectedYear, colorMap);
  treemapPlot(data, selectedYear, colorMap);
  sunburstPlot(data, selectedYear, colorMap);
  categoryLinePlot(data, colorMap);
  totalExpensesDonationsBarPlot(data, donationData);
  totalExpensesDonationsLinePlot(data, donationData);
  donationsVExpensesPlot(data, donationData);
  costPerAttendeePlot(data, attendeeData);
  attendeePlot(attendeeData);
  expenseTable(data, selectedYear);
  hostLossPlot(data, reimbData);
}

function singleYearPlots(data, selectedYear, colorMap) {
  document.getElementById("individual-expenses-bar-plot").style.display =
    "block";
  expensePieChartWithBackground(data, selectedYear);
  barPlot(data, selectedYear, colorMap);
  treemapPlot(data, selectedYear, colorMap);
  individualExpensesBarPlot(data, selectedYear, colorMap);
  sunburstPlot(data, selectedYear, colorMap);
  expenseTable(data, selectedYear);
  clearElements(true);
}

// function to clear elements
function clearElements(onoff) {
  const elements = [
    "tableau-story",
    "category-line-plot",
    "total-expenses-donations-bar-plot",
    "total-expenses-donations-line-plot",
    "donations-v-expenses-plot",
    "cost-per-attendee-plot",
    "facebook-plot-note",
    "attendee-plot",
    "corn-kings-and-queens",
  ];

  if (onoff) {
    elements.forEach(
      (id) => (document.getElementById(id).style.display = "none")
    );
  } else {
    elements.forEach(
      (id) => (document.getElementById(id).style.display = "block")
    );
  }
}

// colormap for categories, assigning blue and orange to Bar and Music
function getColorMap(data) {
  // aggregate data by category (to get total amount for each category)
  const categorySums = data.reduce((acc, item) => {
    const category = item.Category;
    const amount = parseFloat(item.Amount);
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {});

  // sort categories by total amount, descending (puts Bar and Music at the top)
  const sortedCategories = Object.keys(categorySums).sort(
    (a, b) => categorySums[b] - categorySums[a]
  );

  // assign colors to categories
  const colorMap = {};
  sortedCategories.forEach((category, index) => {
    colorMap[category] = harvestColors[index % harvestColors.length];
  });

  return colorMap;
}

// helper functions, new for the pie chart in 2025
// To be refactored into all other plots... someday. Maybe. Probably not.
const formatCurrency = (val) => `$${Math.round(val).toLocaleString("en-US")}`;
const formatPercent = (amt, total) => `${((amt / total) * 100).toFixed(1)}%`;

// pie chart with background image
function expensePieChartWithBackground(data, selectedYear) {
  // filter data by year
  const filteredData =
    selectedYear === 1
      ? data
      : data.filter((item) => parseInt(item.Year) === selectedYear);

  // merge smaller categories into "Other"
  const mainCats = ["Bar", "Music", "Food"];
  const grouped = filteredData.reduce((acc, d) => {
    const cat = mainCats.includes(d.Category) ? d.Category : "Other";
    acc[cat] = (acc[cat] || 0) + parseFloat(d.Amount);
    return acc;
  }, {});

  // aggregate amounts and categories
  const categories = Object.keys(grouped);
  const amounts = categories.map((cat) => grouped[cat]);
  const total = amounts.reduce((a, b) => a + b, 0);

  // format title total, slice labels & hover data
  const totalFormatted = formatCurrency(total);
  const text = amounts.map(
    (amt, i) => `${categories[i]}<br>${formatCurrency(amt)}`
  );
  const hoverData = amounts.map((amt, i) => {
    const label = categories[i];
    const amount = formatCurrency(amt);
    const percent = formatPercent(amt, total);
    return ` <b>${label}</b> <br> ${amount} <br> ${percent} `;
  });

  // Set image and chart size based on device
  const isMobile = window.innerWidth < 600;
  const pieDomain = {
    x: isMobile ? [0.25, 0.75] : [0.15, 0.85],
    y: [0.15, 0.85],
  };
  const imageSize = isMobile
    ? { sizex: 1.05, sizey: 0.7 }
    : { sizex: 1.35, sizey: 0.9 };

  // create trace
  const fadedColor = "rgba(255,255,255,0.25)"; // semi-transparent white
  const trace = {
    values: amounts,
    labels: categories,
    type: "pie",
    text: text,
    textinfo: "text",
    hovertemplate: "%{customdata}<extra></extra>",
    customdata: hoverData,
    marker: {
      colors: categories.map(() => fadedColor), // all slices faded white
      line: { color: "white", width: 3 },
    },
    textfont: { color: "black", size: 16 },
    direction: "clockwise",
    sort: false,
    hole: 0,
    rotation: 90,
    domain: pieDomain, // shrink pie and center it
  };

  // create layout with background image
  const layout = {
    title: {
      text:
        (selectedYear === 1
          ? "Total Expenses by Category"
          : `${selectedYear} Expenses by Category`) +
        `<br><span style="font-size:16px;">Total ${totalFormatted}</span>`,
      font: { color: "black", size: 20 },
    },
    paper_bgcolor: "white", // background outside plot
    plot_bgcolor: "rgba(0,0,0,0)",
    showlegend: false,
    images: [
      {
        source: "./static/images/pumpkin_pie6.png",
        xref: "paper",
        yref: "paper",
        x: 0.5,
        y: 0.5,
        sizex: imageSize.sizex,
        sizey: imageSize.sizey, // adjust for 3:2 aspect of image
        xanchor: "center",
        yanchor: "middle",
        sizing: "contain",
        opacity: 1,
        layer: "below",
      },
    ],
    margin: { t: 60, l: 20, r: 20, b: 20 },
  };

  Plotly.newPlot("expense-pie-chart", [trace], layout, { responsive: true });
}

// bar plot that aggregates Amount by Category
function barPlot(data, selectedYear, colorMap) {
  // filter data by year
  const filteredData =
    selectedYear === 1
      ? data
      : data.filter((item) => parseInt(item.Year) === selectedYear);

  // aggregate data by category
  const categorySums = filteredData.reduce((acc, item) => {
    const category = item.Category;
    const amount = parseFloat(item.Amount);
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {});

  // calculate total expenses
  const totalExpenses = Object.values(categorySums).reduce(
    (acc, amount) => acc + amount,
    0
  );

  // sort categories descending by amount
  const sortedCategories = Object.keys(categorySums).sort(
    (a, b) => categorySums[a] - categorySums[b]
  );

  // extract keys and values
  const sortedKeys = sortedCategories;
  const sortedValues = sortedCategories.map(
    (category) => categorySums[category]
  );
  const percentages = sortedValues.map(
    (value) => (value / totalExpenses) * 100
  );

  // format values as locale strings
  // toLocaleString formats numbers in user's locale (thousands and decimal separators)
  const formattedValues = sortedValues.map(
    (value) => `$${Math.round(value).toLocaleString()}`
  );
  const formattedHoverValues = sortedValues.map((value) =>
    value.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
  const formattedPercentages = percentages.map((value) =>
    value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );

  // create trace
  const trace = {
    x: sortedValues,
    y: sortedKeys,
    type: "bar",
    orientation: "h",
    hovertemplate:
      "<b>%{y}</b><br>Amount: %{customdata[0]}<br>Percentage: %{customdata[1]}%<extra></extra>",
    customdata: sortedValues.map((value, index) => [
      formattedHoverValues[index],
      formattedPercentages[index],
    ]),
    text: formattedValues,
    textposition: "auto",
    marker: {
      color: sortedCategories.map((category) => colorMap[category] || "#ccc"), // light graty default
    },
  };

  // create layout
  const layout = {
    title: `Expenses by Category for ${
      selectedYear === 1 ? "All Years" : selectedYear
    }`,
    xaxis: { title: "Amount", tickformat: "$,.0f" },
    yaxis: { title: "Category" },
    responsive: true,
    margin: { t: 100, l: 80, r: 30, b: 80 },
  };

  // plot chart
  Plotly.newPlot("bar-plot", [trace], layout);
}

// treemap plot that aggregates Amount by Category
function treemapPlot(data, selectedYear, colorMap) {
  // filter data by year
  const filteredData =
    selectedYear === 1
      ? data
      : data.filter((item) => parseInt(item.Year) === selectedYear);

  // aggregate data by category
  const categorySums = filteredData.reduce((acc, item) => {
    const category = item.Category;
    const amount = parseFloat(item.Amount);
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {});

  // calculate total expenses
  const totalExpenses = Object.values(categorySums).reduce(
    (acc, amount) => acc + amount,
    0
  );

  // format values as locale strings
  const formattedValues = Object.values(categorySums).map((value) =>
    value.toLocaleString("en-US", { style: "currency", currency: "USD" })
  );
  const formattedPercentages = Object.values(categorySums).map((value) =>
    ((value / totalExpenses) * 100).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );

  // create trace
  const trace = {
    type: "treemap",
    labels: Object.keys(categorySums),
    parents: Object.keys(categorySums).map(() => ""),
    values: Object.values(categorySums),
    textinfo: "label+value",
    texttemplate:
      "<b><span style='text-decoration: underline;'>%{label}</span></b><br>%{customdata.value}<br>%{customdata.percent:.2f%}%",
    hovertemplate:
      "<b><span style='text-decoration: underline;'>%{label}</span></b><br>%{customdata.value}<br>%{customdata.percent}%<extra></extra>",
    marker: {
      colors: Object.keys(categorySums).map((category) => colorMap[category]),
    },
    customdata: Object.values(categorySums).map((value, index) => ({
      value: formattedValues[index],
      percent: formattedPercentages[index],
    })),
  };

  // create layout
  const layout = {
    title: `Expenses by Category for ${
      selectedYear === 1 ? "All Years" : selectedYear
    }`,
    margin: { t: 50, l: 25, r: 25, b: 25 },
  };

  // plot chart
  Plotly.newPlot("treemap-plot", [trace], layout);
}

// bar plot that shows individual expenses for selected year
function individualExpensesBarPlot(data, selectedYear, colorMap) {
  // filter data by year
  const filteredData = data.filter(
    (item) => parseInt(item.Year) === selectedYear
  );

  // format amounts as USD
  const formattedAmounts = filteredData.map((item) =>
    parseFloat(item.Amount).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    })
  );

  // create trace
  const trace = {
    x: filteredData.map((item) => item.Expense),
    y: filteredData.map((item) => item.Amount),
    type: "bar",
    marker: { color: filteredData.map((item) => colorMap[item.Category]) },
    text: filteredData.map((item) => item.Category),
    hovertemplate:
      "<b>%{x}</b><br>Amount: %{customdata}<br>Category: %{text}<extra></extra>",
    customdata: formattedAmounts,
  };

  // create layout
  const layout = {
    title: `Itemized Expenses for ${selectedYear}`,
    xaxis: { title: "Category" },
    yaxis: { title: "Amount ($)" },
    margin: { t: 100, l: 80, r: 30, b: 80 },
  };

  // plot chart
  Plotly.newPlot("individual-expenses-bar-plot", [trace], layout);
}

// sunburst plot that shows expenses by category, year, and expense
function sunburstPlot(data, selectedYear, colorMap) {
  // filter data by year
  const filteredData =
    selectedYear === 1
      ? data
      : data.filter((item) => parseInt(item.Year) === selectedYear);

  // aggregate data by category, year, and expense in hierarchy
  const hierarchy = filteredData.reduce((acc, item) => {
    const category = item.Category;
    const year = item.Year;
    const expense = item.Expense;
    const amount = parseFloat(item.Amount);

    if (!acc[category]) acc[category] = { total: 0, years: {} };
    if (!acc[category].years[year])
      acc[category].years[year] = { total: 0, expenses: {} };
    if (!acc[category].years[year].expenses[expense])
      acc[category].years[year].expenses[expense] = 0;

    // accumulate amounts for each level of the hierarchy
    acc[category].total += amount;
    acc[category].years[year].total += amount;
    acc[category].years[year].expenses[expense] += amount;

    return acc;
  }, {});

  // prep hierarchical data lists for sunburst
  let labels = [];
  let parents = [];
  let values = [];
  let texts = [];
  let formattedValues = [];

  // conditional for all years or individual year
  if (selectedYear === 1) {
    // for all years
    // categories
    Object.keys(hierarchy).forEach((category) => {
      labels.push(category);
      parents.push("");
      values.push(hierarchy[category].total);
      texts.push(category);
      formattedValues.push(
        hierarchy[category].total.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })
      );

      // years under each category
      Object.keys(hierarchy[category].years).forEach((year) => {
        const yearLabel = `${category}-${year}`; // it wants unique labels
        labels.push(yearLabel);
        parents.push(category);
        values.push(hierarchy[category].years[year].total);
        texts.push(year);
        formattedValues.push(
          hierarchy[category].years[year].total.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })
        );

        // expenses under each year
        Object.keys(hierarchy[category].years[year].expenses).forEach(
          (expense) => {
            const expenseLabel = `${yearLabel}-${expense}`; // it wants unique labels
            labels.push(expenseLabel);
            parents.push(yearLabel);
            values.push(hierarchy[category].years[year].expenses[expense]);
            texts.push(expense);
            formattedValues.push(
              hierarchy[category].years[year].expenses[expense].toLocaleString(
                "en-US",
                { style: "currency", currency: "USD" }
              )
            );
          }
        );
      });
    });
  } else {
    // for individual years
    // categories
    Object.keys(hierarchy).forEach((category) => {
      labels.push(category);
      parents.push("");
      values.push(hierarchy[category].total);
      texts.push(category);
      formattedValues.push(
        hierarchy[category].total.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })
      );

      // assign selected year
      const year = selectedYear.toString();

      // expenses under category
      Object.keys(hierarchy[category].years[year].expenses).forEach(
        (expense) => {
          const expenseLabel = `${category}-${expense}`; // it wants unique labels
          labels.push(expenseLabel);
          parents.push(category);
          values.push(hierarchy[category].years[year].expenses[expense]);
          texts.push(expense);
          formattedValues.push(
            hierarchy[category].years[year].expenses[expense].toLocaleString(
              "en-US",
              { style: "currency", currency: "USD" }
            )
          );
        }
      );
    });
  }

  // default colors for missing labels
  const defaultColor = "#FFFFFF";
  const colors = labels.map((label) => {
    const originalLabel = label.split("-")[0]; // original label for colorMap lookup
    return colorMap[originalLabel] || defaultColor;
  });

  // create trace
  const trace = {
    type: "sunburst",
    labels: labels,
    parents: parents,
    values: values,
    text: texts,
    textinfo: "text+value",
    hoverinfo: "text+value",
    texttemplate:
      //   "%{text}<br><span style='font-size:10px;'>$%{value:.2f}</span>",
      // hovertemplate: "<b>%{text}</b><br>Amount: $%{value:.2f}<extra></extra>",
      "%{text}<br><span style='font-size:10px;'>%{customdata}</span>",
    hovertemplate: "<b>%{text}</b><br>Amount: %{customdata}<extra></extra>",
    marker: {
      colors: colors,
    },
    customdata: formattedValues,
    branchvalues: "total",
  };

  // create layout
  const layout = {
    title: `Sunburst - Itemized Expenses for ${
      selectedYear === 1 ? "All Years" : selectedYear
    }<br><sub>Click on a category to zoom in</sub>`,
    margin: { t: 50, l: 25, r: 25, b: 25 },
  };

  // plot chart
  Plotly.newPlot("sunburst-plot", [trace], layout);
}

// line plot of expenses by category over time, that toggles categories w/ values
// the values sometimes appear when toggled - the plotly gods are fickle creatures
function categoryLinePlot(data, colorMap) {
  // aggregate data by year and category
  const categorySums = data.reduce((acc, item) => {
    const year = item.Year;
    const category = item.Category;
    const amount = parseFloat(item.Amount);
    acc[year] = acc[year] || {};
    acc[year][category] = (acc[year][category] || 0) + amount;
    return acc;
  }, {});

  // extract all unique categories across all years
  const categories = Array.from(new Set(data.map((item) => item.Category)));
  const years = Object.keys(categorySums).sort();

  // create traces for each category
  const traces = categories.map((category) => {
    const values = years.map((year) => categorySums[year]?.[category] || 0);
    const formattedValues = values.map((value) =>
      value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      })
    );
    return {
      x: years,
      y: values,
      mode: "lines+markers+text",
      name: category,
      line: { color: colorMap[category] },
      marker: { color: colorMap[category] },
      text: null, // no text by default
      textposition: "top center",
      textfont: { color: colorMap[category] },
      hovertemplate: `<b>Year: %{x}</b><br>${category}: $%{customdata}<extra></extra>`,
      customdata: formattedValues,
      opacity: 1, // default opacity for all lines
    };
  });

  // create dropdown for toggling category lines dim or highlighted
  const categoryButtons = categories.map((category, index) => ({
    method: "restyle",
    args: [
      {
        opacity: traces.map((_, i) => (i === index ? 1 : 0.2)),
        texttemplate: traces.map((_, i) =>
          i === index
            ? traces[i].y.map((value) =>
                value.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })
              )
            : null
        ),
      },
    ],
    label: category,
  }));

  // "Show All" button to reset all lines to full opacity and no text
  const showAllButton = {
    method: "restyle",
    args: [
      {
        opacity: traces.map(() => 1),
        texttemplate: traces.map(() => null),
      },
    ],
    label: "Show All",
  };

  // put "Show All" first
  const buttons = [showAllButton, ...categoryButtons];

  // create layout with dropdown menu
  const layout = {
    title: "Expenses per Category Over Time",
    xaxis: { title: "Year" },
    yaxis: { title: "Amount", tickformat: "$,.0f" },
    legend: {
      orientation: "h",
      x: 0.5,
      xanchor: "center",
      y: -0.2,
      yanchor: "top",
    },
    margin: { t: 100, l: 80, r: 30, b: 80 },
    updatemenus: [
      {
        buttons: buttons,
        direction: "down",
        showactive: true,
        x: 0.5,
        y: 1.15,
        xanchor: "center",
        yanchor: "top",
      },
    ],
  };

  // plot chart
  Plotly.react("category-line-plot", traces, layout);
}

// bar plot that shows total expenses and donations over time
function totalExpensesDonationsBarPlot(expenseData, donationData) {
  // aggregate data by year
  const expenseSums = expenseData.reduce((acc, item) => {
    const year = item.Year;
    const amount = parseFloat(item.Amount);
    acc[year] = (acc[year] || 0) + amount;
    return acc;
  }, {});

  // create traces
  const expenseTrace = {
    x: Object.keys(expenseSums),
    y: Object.values(expenseSums),
    type: "bar",
    name: "Expenses",
    marker: { color: harvestColors[0] },
    text: Object.values(expenseSums).map(
      (value) => `<b>$${Math.round(value).toLocaleString("en-US")}</b>`
    ),
    textposition: "inside",
    insidetextanchor: "start",
    hovertemplate: "<b>Year: %{x}</b><br>Expenses: %{y:$,.2f}<extra></extra>",
  };

  const donationTrace = {
    x: donationData.map((item) => item.Year),
    y: donationData.map((item) => parseFloat(item.Donations)),
    mode: "lines+text",
    type: "scatter",
    name: "Donations",
    line: { color: harvestColors[1] },
    marker: { color: harvestColors[1] },
    text: donationData.map(
      (item) =>
        `<b>$${Math.round(parseFloat(item.Donations)).toLocaleString(
          "en-US"
        )}</b>`
    ),
    textposition: "auto",
    // textfont: { color: harvestColors[1] },
    hovertemplate: "<b>Year: %{x}</b><br>Donations: %{y:$,.2f}<extra></extra>",
  };

  // create layout
  const layout = {
    title: `Expenses and Donations Over Time`,
    xaxis: { title: "Year" },
    yaxis: { title: "Amount", tickformat: "$,.0f" },
    legend: {
      orientation: "h",
      x: 0.5,
      xanchor: "center",
      y: 1.0,
      yanchor: "bottom",
    },
    margin: { t: 100, l: 80, r: 30, b: 80 },
  };

  // plot chart
  Plotly.newPlot(
    "total-expenses-donations-bar-plot",
    [expenseTrace, donationTrace],
    layout
  );
}

// line plot that shows total expenses and donations over time
function totalExpensesDonationsLinePlot(expenseData, donationData) {
  // aggregate data by year
  const expenseSums = expenseData.reduce((acc, item) => {
    const year = item.Year;
    const amount = parseFloat(item.Amount);
    acc[year] = (acc[year] || 0) + amount;
    return acc;
  }, {});

  // create traces
  const expenseTrace = {
    x: Object.keys(expenseSums),
    y: Object.values(expenseSums),
    // mode: "lines+markers+text",
    mode: "lines+markers",
    name: "Expenses",
    line: { color: harvestColors[0] },
    marker: { color: harvestColors[0] },
    text: Object.values(expenseSums).map(
      (value) => `$${Math.round(value).toLocaleString("en-US")}`
    ),
    textposition: "top center",
    hovertemplate: "<b>Year: %{x}</b><br>Expenses: %{y:$,.2f}<extra></extra>",
  };

  const donationTrace = {
    x: donationData.map((item) => item.Year),
    y: donationData.map((item) => parseFloat(item.Donations)),
    // mode: "lines+markers+text",
    mode: "lines+markers",
    name: "Donations",
    line: { color: harvestColors[1] },
    marker: { color: harvestColors[1] },
    text: donationData.map(
      (item) =>
        `$${Math.round(parseFloat(item.Donations)).toLocaleString("en-US")}`
    ),
    textposition: donationData.map((_, index) =>
      index % 3 === 1 ? "bottom right" : "top center"
    ),
    hovertemplate: "<b>Year: %{x}</b><br>Donations: %{y:$,.2f}<extra></extra>",
  };

  // create layout
  const layout = {
    title: `Expenses and Donations Over Time`,
    xaxis: { title: "Year" },
    yaxis: { title: "Amount", tickformat: "$,.0f" },
    legend: {
      orientation: "h",
      x: 0.5,
      xanchor: "center",
      y: 1.0,
      yanchor: "bottom",
    },
    margin: { t: 100, l: 80, r: 30, b: 80 },
  };

  // plot chart
  Plotly.newPlot(
    "total-expenses-donations-line-plot",
    [expenseTrace, donationTrace],
    layout
  );
}

// line plot of difference between expenses and donations over time
function donationsVExpensesPlot(expenseData, donationData) {
  // aggregate expenses by year
  const expenseSums = expenseData.reduce((acc, item) => {
    const year = item.Year;
    const amount = parseFloat(item.Amount) || 0;
    acc[year] = (acc[year] || 0) + amount;
    return acc;
  }, {});

  // combine data into a single structure
  const allYears = new Set([
    ...Object.keys(expenseSums),
    ...donationData.map((item) => item.Year),
  ]);
  const combinedData = Array.from(allYears).map((year) => {
    return {
      Year: year,
      Expenses: expenseSums[year] || 0,
      Donations:
        donationData.find((item) => item.Year === year)?.Donations || 0,
    };
  });

  // calculate donations minus expenses
  const years = combinedData.map((d) => d.Year);
  const difference = combinedData.map((d) => d.Donations - d.Expenses);

  // array of text positions to fit text on plot
  const textPositions = difference.map((value, index) => {
    // alternate positions to avoid overlap
    return index % 2 === 0 ? "top center" : "bottom center";
  });

  // color text based on "in the red" or "in the black"
  const textColors = difference.map((value) =>
    value < 0 ? harvestColors[2] : "black"
  );

  // create trace
  const trace = {
    x: years,
    y: difference,
    mode: "lines+markers+text",
    type: "scatter",
    name: "Donations - Expenses",
    line: { color: harvestColors[0] },
    marker: { color: harvestColors[0] },
    text: difference.map(
      (value) => `$${Math.round(value).toLocaleString("en-US")}`
    ),
    texttemplate: "%{text}",
    textposition: textPositions,
    textfont: { color: textColors },
    hovertemplate:
      "<b>Year: %{x}</b><br>Gain or Loss:<br>$%{y:.2f}<extra></extra>",
    hoverlabel: { bgcolor: "white" },
  };

  // create layout
  const layout = {
    title: "Donations Minus Expenses by Year",
    xaxis: { title: "Year" },
    yaxis: { title: "Donations Minus Expenses", tickformat: "$,.0f" },
    margin: { t: 100, l: 80, r: 30, b: 80 },
    shapes: [
      {
        type: "line",
        x0: Math.min(...years),
        x1: Math.max(...years),
        y0: 0,
        y1: 0,
        line: {
          color: "black",
          width: 2,
          dash: "dash",
        },
      },
    ],
  };

  // plot chart
  Plotly.newPlot("donations-v-expenses-plot", [trace], layout);
}

// line plot of cost per attendee over time
function costPerAttendeePlot(expenseData, attendeeData) {
  // aggregate expenses by year
  const expenseSums = expenseData.reduce((acc, item) => {
    const year = parseInt(item.Year);
    if (year >= 2017 && year <= 2023) {
      const amount = parseFloat(item.Amount) || 0;
      acc[year] = (acc[year] || 0) + amount;
    }
    return acc;
  }, {});

  // aggregate attendees by year (Going, Going plus Maybes separately)
  const attendees = attendeeData.reduce((acc, item) => {
    const year = parseInt(item.Year);
    if (year >= 2017) {
      const going = parseInt(item.Going) || 0;
      const maybes = parseInt(item.Maybes) || 0;
      acc[year] = acc[year] || { going: 0, goingPlusMaybes: 0 };
      acc[year].going += going;
      acc[year].goingPlusMaybes += going + maybes;
    }
    return acc;
  }, {});

  // combine data into a single structure
  const combinedData = Object.keys(expenseSums).map((year) => ({
    Year: year,
    Expenses: expenseSums[year] || 0,
    Going: attendees[year]?.going || 0,
    GoingPlusMaybes: attendees[year]?.goingPlusMaybes || 0,
  }));

  // calculate cost per attendee for both lines
  const years = combinedData.map((d) => d.Year);
  const costPerGoing = combinedData.map((d) =>
    d.Going ? d.Expenses / d.Going : null
  );
  const costPerGoingPlusMaybes = combinedData.map((d) =>
    d.GoingPlusMaybes ? d.Expenses / d.GoingPlusMaybes : null
  );

  // create traces
  const traceGoing = {
    x: years,
    y: costPerGoing,
    // mode: "lines+markers+text",
    mode: "lines+markers",
    type: "scatter",
    name: "RSVP",
    line: { color: harvestColors[0] },
    marker: { color: harvestColors[0] },
    text: costPerGoing.map((value) =>
      value
        ? `$${value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}`
        : ""
    ),
    textposition: "top center",
    texttemplate: "$%{y:.2f}",
    hovertemplate:
      "<b>Year: %{x}</b><br>Cost per RSVP: $%{y:.2f}<extra></extra>",
  };

  const traceGoingPlusMaybes = {
    x: years,
    y: costPerGoingPlusMaybes,
    // mode: "lines+markers+text",
    mode: "lines+markers",
    type: "scatter",
    name: "RSVP + Maybes",
    line: { color: harvestColors[1] },
    marker: { color: harvestColors[1] },
    text: costPerGoingPlusMaybes.map((value) =>
      value
        ? `$${value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}`
        : ""
    ),
    textposition: "top center",
    texttemplate: "$%{y:.2f}",
    hovertemplate:
      "<b>Year: %{x}</b><br>Cost per RSVP + Maybes: $%{y:.2f}<extra></extra>",
  };

  // create layout
  const layout = {
    title: "Cost per FB Attendee per Year",
    xaxis: { title: "Year" },
    yaxis: { title: "Cost per Attendee", tickformat: "$,.0f" },
    legend: {
      orientation: "h",
      x: 0.5,
      xanchor: "center",
      y: 1.0,
      yanchor: "bottom",
    },
    margin: { t: 100, l: 80, r: 30, b: 80 },
  };

  // plot chart
  Plotly.newPlot(
    "cost-per-attendee-plot",
    [traceGoing, traceGoingPlusMaybes],
    layout
  );
}

// plot of attendees over time
function attendeePlot(data) {
  // Filter out years greater than 2023
  const filteredData = data.filter((item) => parseInt(item.Year) <= 2023);

  xValues = filteredData.map((item) => parseInt(item.Year));
  yValuesGoing = filteredData.map((item) => parseInt(item.Going));
  yValuesMaybes = filteredData.map((item) => parseInt(item.Maybes));
  yValuesTotal = yValuesGoing.map(
    (going, index) => going + yValuesMaybes[index]
  );

  // create traces
  const goingTrace = {
    x: xValues,
    y: yValuesGoing,
    // mode: "lines+markers+text",
    mode: "lines+markers",
    name: "Going",
    line: { color: harvestColors[0] },
    marker: { color: harvestColors[0] },
    text: yValuesGoing,
    textposition: "top center",
    hovertemplate: "<b>Year: %{x}</b><br>Going: %{y}<extra></extra>",
  };

  const maybeTrace = {
    x: xValues,
    y: yValuesMaybes,
    // mode: "lines+markers+text",
    mode: "lines+markers",
    name: "Maybes",
    line: { color: harvestColors[1] },
    marker: { color: harvestColors[1] },
    text: yValuesMaybes,
    textposition: "top center",
    hovertemplate: "<b>Year: %{x}</b><br>Maybes: %{y}<extra></extra>",
  };

  const totalTrace = {
    x: xValues,
    y: yValuesTotal,
    // mode: "lines+markers+text",
    mode: "lines+markers",
    name: "Both",
    line: { color: attendeeGreen },
    marker: { color: attendeeGreen },
    text: yValuesTotal,
    textposition: "top center",
    hovertemplate: "<b>Year: %{x}</b><br>Both: %{y}<extra></extra>",
  };

  // create layout
  const layout = {
    title: "FB Attendees Over Time",
    xaxis: { title: "Year" },
    yaxis: { title: "Number of Attendees" },
    legend: {
      orientation: "h",
      x: 0.5,
      xanchor: "center",
      y: 1.0,
      yanchor: "bottom",
    },
    margin: { t: 100, l: 80, r: 30, b: 80 },
  };

  // plot chart
  Plotly.newPlot("attendee-plot", [totalTrace, goingTrace, maybeTrace], layout);
}

// table of expenses for selected year with plotly
function expenseTable(data, selectedYear) {
  // filter data by year
  const filteredData =
    selectedYear === 1
      ? data
      : data.filter((item) => parseInt(item.Year) === selectedYear);

  // sort data by amount, descending
  filteredData.sort((a, b) => parseFloat(b.Amount) - parseFloat(a.Amount));

  // extract headers and values
  const headers = ["Expense", "Amount", "Name", "Year", "Category"];
  const rows = filteredData.map((item) => [
    item.Expense,
    parseFloat(item.Amount).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    }),
    item.Name,
    item.Year,
    item.Category,
  ]);

  // transpose rows to columns for Plotly
  const columns = headers.map((_, colIndex) =>
    rows.map((row) => row[colIndex])
  );

  // generate alternating row colors for striped effect
  const nRows = columns[0].length;
  const rowColors = Array.from({ length: nRows }, (_, i) =>
    i % 2 === 0 ? "#f9f9f9" : "#e9c46a33"
  );
  // Plotly expects one color array per column
  const fillColors = columns.map(() => rowColors);

  // create trace
  const trace = {
    type: "table",
    header: {
      values: headers,
      align: "left",
      line: { width: 1, color: "#ccc" },
      fill: { color: harvestColors[0] },
      font: { family: "Arial", size: 12, color: "white" },
    },
    cells: {
      values: columns,
      align: "left",
      line: { width: 1, color: "#ccc" },
      fill: { color: fillColors }, // striped effect
      font: { family: "Arial", size: 11, color: "black" },
    },
  };

  // create layout
  const layout = {
    title: `Itemized Expenses for ${
      selectedYear === 1 ? "All Years" : selectedYear
    }`,
    margin: { t: 50, l: 25, r: 25, b: 25 },
  };

  // plot chart
  Plotly.newPlot("expense-table", [trace], layout);
}

// bar plot of each host's losses
function hostLossPlot(expenseData, reimbData) {
  // aggregate expenses by person
  const expenseSums = expenseData.reduce((acc, item) => {
    const person = item.Name;
    const amount = parseFloat(item.Amount) || 0;
    acc[person] = (acc[person] || 0) + amount;
    return acc;
  }, {});

  // aggregate reimbursements by person
  const reimbSums = reimbData.reduce((acc, item) => {
    const person = item.Name;
    const amount = parseFloat(item.Paid) || 0;
    acc[person] = (acc[person] || 0) + amount;
    return acc;
  }, {});

  // calculate net loss per person, filter out zero or positive values
  const lossData = Object.keys(expenseSums)
    .map((person) => ({
      person: person,
      loss: expenseSums[person] - (reimbSums[person] || 0),
    }))
    .filter((d) => d.loss > 0 || d.loss < -1) // filter out zeros, switch < -1 to < 0 to keep Latvia
    .sort((a, b) => b.loss - a.loss);

  // extract sorted values for plotting
  const xValues = lossData.map((d) => d.loss);
  const yValues = lossData.map((d) => d.person);

  // for y-axis ticks, use names with <br>
  const yTickText = yValues.map((name) => name.replace(/\s/g, "<br>"));

  // create trace
  const trace = {
    x: xValues,
    y: yValues,
    type: "bar",
    orientation: "h",
    text: xValues.map((value) =>
      value.toLocaleString("en-US", { style: "currency", currency: "USD" })
    ),
    textposition: "auto",
    customdata: yValues, // doesn't replace whitespace with <br> in hover
    hovertemplate:
      "<b>%{customdata}</b><br>Host Loss: %{x:$,.2f}<extra></extra>",
    marker: { color: harvestColors[0] },
  };

  // create layout
  const layout = {
    title: "Cumulative Host Losses",
    xaxis: { title: "Host Loss", tickformat: "$,.0f" },
    yaxis: {
      title: "Person",
      tickvals: yValues,
      ticktext: yTickText,
    },
    margin: { t: 100, l: 80, r: 30, b: 80 },
  };

  // plot chart
  Plotly.newPlot("corn-kings-and-queens", [trace], layout);
}
