// call plots for total view
function totalPlots(data, selectedYear, colorMap) {
  barPlot(data, selectedYear);
  treemapPlot(data, selectedYear, colorMap);
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

  // sort categories descending by amount
  const sortedCategories = Object.keys(categorySums).sort(
    (a, b) => categorySums[a] - categorySums[b]
  );

  // extract keys and values
  const sortedKeys = sortedCategories;
  const sortedValues = sortedCategories.map(
    (category) => categorySums[category]
  );

  // create trace
  const trace = {
    x: sortedValues,
    y: sortedKeys,
    type: "bar",
    orientation: "h",
  };

  // create layout
  const layout = {
    title: "Amount by Category",
    xaxis: { title: "Amount" },
    yaxis: { title: "Category" },
  };

  // plot chart
  Plotly.newPlot("bar-plot", [trace], layout);
}

//treemap plot that aggregates Amount by Category
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

  // create trace
  const trace = {
    type: "treemap",
    labels: Object.keys(categorySums),
    parents: Object.keys(categorySums).map((category) => ""),
    values: Object.values(categorySums),
    textinfo: "label+value",
    marker: {
      colors: Object.keys(categorySums).map((category) => colorMap[category]),
    },
  };

  // plot chart
  Plotly.newPlot("treemap-plot", [trace]);
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
    marker: {
      color: filteredData.map((item) => colorMap[item.Category]),
    },
    text: filteredData.map((item) => item.Category),
    hovertemplate:
      "<b>%{x}</b><br>Amount: $%{y}<br>Category: %{text}<extra></extra>",
  };

  // create layout
  const layout = {
    title: "Individual Expenses",
    xaxis: { title: "Amount" },
    yaxis: { title: "Category" },
  };

  // plot chart
  Plotly.newPlot("individual-expenses-bar-plot", [trace], layout);
}
