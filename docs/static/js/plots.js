// I'm sure I could refactor many of these plot functions to be more DRY
// But then I couldn't toggle them on and off easily

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
  barPlot(data, selectedYear);
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
  barPlot(data, selectedYear);
  treemapPlot(data, selectedYear, colorMap);
  individualExpensesBarPlot(data, selectedYear, colorMap);
  sunburstPlot(data, selectedYear, colorMap);
  expenseTable(data, selectedYear);
  clearElements(true);
}

// function to clear elements
function clearElements(onoff) {
  const elements = [
    "category-line-plot",
    "total-expenses-donations-bar-plot",
    "total-expenses-donations-line-plot",
    "donations-v-expenses-plot",
    "cost-per-attendee-plot",
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

  // color scale for categories
  const colorScale = Plotly.d3.scale.category10().domain(sortedCategories);

  // assign colors to categories
  const colorMap = {};
  sortedCategories.forEach((category, index) => {
    colorMap[category] = colorScale(category);
  });

  return colorMap;
}

// bar plot that aggregates Amount by Category
function barPlot(data, selectedYear) {
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

  // create trace
  const trace = {
    x: sortedValues,
    y: sortedKeys,
    type: "bar",
    orientation: "h",
    hovertemplate:
      "<b>%{y}</b><br>Amount: $%{x:.2f}<br>Percentage: %{customdata:.2f}%<extra></extra>",
    customdata: percentages,
    text: sortedValues.map((value) => `$${value.toFixed(2)}`),
    textposition: "auto",
  };

  // create layout
  const layout = {
    title: `Amount by Category for ${
      selectedYear === 1 ? "All Years" : selectedYear
    }`,
    xaxis: { title: "Amount ($)" },
    yaxis: { title: "Category" },
    responsive: true,
    // margin: { l: 5, r: 5, t: 5, b: 5 }, // removes left, right, top, and bottom margins
    // width: container.clientWidth,
    // height: container.clientHeight,
    // width: containerWidth,
    // height: containerHeight,
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

  // create trace
  const trace = {
    type: "treemap",
    labels: Object.keys(categorySums),
    parents: Object.keys(categorySums).map(() => ""),
    values: Object.values(categorySums),
    textinfo: "label+value",
    texttemplate:
      "<b><span style='text-decoration: underline;'>%{label}</span></b><br>$%{value:.2f}<br>%{customdata.percent:.2%}",
    hovertemplate:
      "<b><span style='text-decoration: underline;'>%{label}</span></b><br>$%{value:.2f}<br>%{customdata.percent:.2%}<extra></extra>",
    marker: {
      colors: Object.keys(categorySums).map((category) => colorMap[category]),
    },
    customdata: Object.values(categorySums).map((value) => ({
      percent: value / totalExpenses,
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

  // create trace
  const trace = {
    x: filteredData.map((item) => item.Expense),
    y: filteredData.map((item) => item.Amount),
    type: "bar",
    marker: { color: filteredData.map((item) => colorMap[item.Category]) },
    text: filteredData.map((item) => item.Category),
    hovertemplate:
      "<b>%{x}</b><br>Amount: $%{y}<br>Category: %{text}<extra></extra>",
  };

  // create layout
  const layout = {
    title: `Individual Expenses for ${selectedYear}`,
    xaxis: { title: "Category" },
    yaxis: { title: "Amount ($)" },
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

  // conditional for all years or individual year
  if (selectedYear === 1) {
    // for all years
    // categories
    Object.keys(hierarchy).forEach((category) => {
      labels.push(category);
      parents.push("");
      values.push(hierarchy[category].total);
      texts.push(category);

      // years under each category
      Object.keys(hierarchy[category].years).forEach((year) => {
        const yearLabel = `${category}-${year}`; // it wants unique labels
        labels.push(yearLabel);
        parents.push(category);
        values.push(hierarchy[category].years[year].total);
        texts.push(year);

        // expenses under each year
        Object.keys(hierarchy[category].years[year].expenses).forEach(
          (expense) => {
            const expenseLabel = `${yearLabel}-${expense}`; // it wants unique labels
            labels.push(expenseLabel);
            parents.push(yearLabel);
            values.push(hierarchy[category].years[year].expenses[expense]);
            texts.push(expense);
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
      "%{text}<br><span style='font-size:10px;'>$%{value:.2f}</span>",
    hovertemplate: "<b>%{text}</b><br>Amount: $%{value:.2f}<extra></extra>",
    marker: {
      colors: colors,
    },
    branchvalues: "total",
  };

  // create layout
  const layout = {
    title: `Expenses by Category, Year, and Expense for ${
      selectedYear === 1 ? "All Years" : selectedYear
    }`,
    margin: { t: 50, l: 25, r: 25, b: 25 },
  };

  // plot chart
  Plotly.newPlot("sunburst-plot", [trace], layout);
}

// line plot of expenses by category over time, that toggles categories
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
    return {
      x: years,
      y: values,
      mode: "lines+markers+text",
      name: category,
      line: { color: colorMap[category] },
      marker: { color: colorMap[category] },
      // text: values.map((value) => `$${value.toFixed(2)}`),
      textposition: "top center",
      textfont: { color: colorMap[category] },
      hovertemplate: `<b>Year: %{x}</b><br>${category}: $%{y:.2f}<extra></extra>`,
      opacity: 1, // default opacity for all lines
    };
  });

  // create layout with updatemenus for toggling lines dim or highlighted
  const layout = {
    title:
      "Expenses by Category Over Time<br><sub>Click on a category to highlight</sub>",
    xaxis: { title: "Year" },
    yaxis: { title: "Amount ($)" },
    updatemenus: [
      {
        buttons: categories
          .map((category, index) => ({
            method: "restyle",
            args: [{ opacity: traces.map((_, i) => (i === index ? 1 : 0.2)) }],
            label: category,
          }))
          .concat([
            {
              method: "restyle",
              args: [{ opacity: 1 }],
              label: "Show All",
            },
          ]),
        direction: "down",
        showactive: true,
        x: 0.1,
        y: 1.15,
        xanchor: "left",
        yanchor: "top",
      },
    ],
  };

  // plot chart
  Plotly.newPlot("category-line-plot", traces, layout);
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
    marker: { color: "blue" },
    text: Object.values(expenseSums).map((value) => `$${value.toFixed(2)}`),
    textposition: "auto",
    hovertemplate: "<b>Year: %{x}</b><br>Expenses: $%{y:.2f}<extra></extra>",
  };

  const donationTrace = {
    x: donationData.map((item) => item.Year),
    y: donationData.map((item) => parseFloat(item.Donations)),
    mode: "lines+markers+text",
    type: "scatter",
    name: "Donations",
    line: { color: "orange" },
    marker: { color: "orange" },
    text: donationData.map(
      (item) => `$${parseFloat(item.Donations).toFixed(2)}`
    ),
    textposition: donationData.map((_, index) =>
      index % 3 === 2 ? "bottom right" : "top center"
    ),
    textfont: {
      color: "orange",
      family: "Arial Black, sans-serif, bold",
    },
    hovertemplate: "<b>Year: %{x}</b><br>Donations: $%{y:.2f}<extra></extra>",
  };

  // create layout
  const layout = {
    title: `Total Expenses and Donations Over Time`,
    xaxis: { title: "Year" },
    yaxis: { title: "Amount ($)" },
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
    mode: "lines+markers+text",
    name: "Expenses",
    line: { color: "blue" },
    marker: { color: "blue" },
    text: Object.values(expenseSums).map((value) => `$${value.toFixed(2)}`),
    textposition: "top center",
    hovertemplate: "<b>Year: %{x}</b><br>Expenses: $%{y:.2f}<extra></extra>",
  };

  const donationTrace = {
    x: donationData.map((item) => item.Year),
    y: donationData.map((item) => parseFloat(item.Donations)),
    mode: "lines+markers+text",
    name: "Donations",
    line: { color: "orange" },
    marker: { color: "orange" },
    text: donationData.map(
      (item) => `$${parseFloat(item.Donations).toFixed(2)}`
    ),
    textposition: donationData.map((_, index) =>
      index % 3 === 1 ? "bottom right" : "top center"
    ),
    hovertemplate: "<b>Year: %{x}</b><br>Donations: $%{y:.2f}<extra></extra>",
  };

  // create layout
  const layout = {
    title: `Total Expenses and Donations Over Time`,
    xaxis: { title: "Year" },
    yaxis: { title: "Amount ($)" },
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
  const textColors = difference.map((value) => (value < 0 ? "red" : "black"));

  // create trace
  const trace = {
    x: years,
    y: difference,
    mode: "lines+markers+text",
    type: "scatter",
    name: "Donations - Expenses",
    line: { color: "blue" },
    marker: { color: "blue" },
    text: difference.map((value) => `$${value.toFixed(2)}`),
    textposition: textPositions,
    texttemplate: "%{text}",
    hovertemplate: "<b>Year: %{x}</b><br>Difference: $%{y:.2f}<extra></extra>",
    textfont: { color: textColors },
  };

  // create layout
  const layout = {
    title: "Total Donations Minus Expenses by Year",
    xaxis: { title: "Year" },
    yaxis: { title: "Total Donations Minus Expenses ($)" },
    shapes: [
      {
        type: "line",
        x0: Math.min(...years),
        x1: Math.max(...years),
        y0: 0,
        y1: 0,
        line: {
          color: "red",
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
    if (year >= 2017) {
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
    mode: "lines+markers+text",
    type: "scatter",
    name: "RSVP'd",
    line: { color: "blue" },
    marker: { color: "blue" },
    text: costPerGoing.map((value) => (value ? `$${value.toFixed(2)}` : "")),
    textposition: "top center",
    texttemplate: "$%{y:.2f}",
    hovertemplate:
      "<b>Year: %{x}</b><br>Cost per RSVP'd: $%{y:.2f}<extra></extra>",
  };

  const traceGoingPlusMaybes = {
    x: years,
    y: costPerGoingPlusMaybes,
    mode: "lines+markers+text",
    type: "scatter",
    name: "RSVP'd + Maybes",
    line: { color: "orange" },
    marker: { color: "orange" },
    text: costPerGoingPlusMaybes.map((value) =>
      value ? `$${value.toFixed(2)}` : ""
    ),
    textposition: "top center",
    texttemplate: "$%{y:.2f}",
    hovertemplate:
      "<b>Year: %{x}</b><br>Cost per RSVP'd + Maybes: $%{y:.2f}<extra></extra>",
  };

  // create layout
  const layout = {
    title: "Cost per Attendee by Year",
    xaxis: { title: "Year" },
    yaxis: { title: "Cost per Attendee ($)" },
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
  xValues = data.map((item) => parseInt(item.Year));
  yValuesGoing = data.map((item) => parseInt(item.Going));
  yValuesMaybes = data.map((item) => parseInt(item.Maybes));
  yValuesTotal = yValuesGoing.map(
    (going, index) => going + yValuesMaybes[index]
  );

  // create traces
  const goingTrace = {
    x: xValues,
    y: yValuesGoing,
    mode: "lines+markers+text",
    name: "Going",
    line: { color: "blue" },
    marker: { color: "blue" },
    text: yValuesGoing,
    textposition: "top center",
    hovertemplate: "<b>Year: %{x}</b><br>Going: %{y}<extra></extra>",
  };

  const maybeTrace = {
    x: xValues,
    y: yValuesMaybes,
    mode: "lines+markers+text",
    name: "Maybes",
    line: { color: "orange" },
    marker: { color: "orange" },
    text: yValuesMaybes,
    textposition: "top center",
    hovertemplate: "<b>Year: %{x}</b><br>Maybes: %{y}<extra></extra>",
  };

  const totalTrace = {
    x: xValues,
    y: yValuesTotal,
    mode: "lines+markers+text",
    name: "Total",
    line: { color: "green" },
    marker: { color: "green" },
    text: yValuesTotal,
    textposition: "top center",
    hovertemplate: "<b>Year: %{x}</b><br>Total: %{y}<extra></extra>",
  };

  // create layout
  const layout = {
    title: "Attendees Over Time",
    xaxis: { title: "Year" },
    yaxis: { title: "Number of Attendees" },
  };

  // plot chart
  Plotly.newPlot("attendee-plot", [goingTrace, maybeTrace, totalTrace], layout);
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
    `$${parseFloat(item.Amount).toFixed(2)}`,
    item.Name,
    item.Year,
    item.Category,
  ]);

  // transpose rows to columns for Plotly
  const columns = headers.map((_, colIndex) =>
    rows.map((row) => row[colIndex])
  );

  // create trace
  const trace = {
    type: "table",
    header: {
      values: headers,
      align: "left",
      line: { width: 1, color: "black" },
      fill: { color: "paleturquoise" },
      font: { family: "Arial", size: 12, color: "black" },
    },
    cells: {
      values: columns,
      align: "left",
      line: { width: 1, color: "black" },
      fill: { color: "lavender" },
      font: { family: "Arial", size: 11, color: ["black"] },
    },
  };

  // create layout
  const layout = {
    title: `Expenses for ${selectedYear === 1 ? "All Years" : selectedYear}`,
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
    .filter((d) => d.loss > 0 || d.loss < 0) // filter out zeros, keep Latvia
    .sort((a, b) => b.loss - a.loss);

  // extract sorted values for plotting
  const xValues = lossData.map((d) => d.loss);
  const yValues = lossData.map((d) => d.person);

  // create trace
  const trace = {
    x: xValues,
    y: yValues,
    type: "bar",
    orientation: "h",
    text: xValues.map((value) => `$${value.toFixed(2)}`),
    textposition: "auto",
    hovertemplate: "<b>%{y}</b><br>Host Loss: $%{x:.2f}<extra></extra>",
  };

  // create layout
  const layout = {
    title: "Cumulative Host Losses",
    xaxis: { title: "Host Loss ($)" },
    yaxis: { title: "Person" },
  };

  // plot chart
  Plotly.newPlot("corn-kings-and-queens", [trace], layout);
}
