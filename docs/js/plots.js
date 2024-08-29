// bar plot that aggregates Amount by Category
function barPlot(data, selectedYear) {
    // filter data by year
    const filteredData = selectedYear === 1 ? data : data.filter(item => parseInt(item.Year) === selectedYear);

    // aggregate data by category
    const categorySums = filteredData.reduce((acc, item) => {
        const category = item.Category;
        const amount = parseFloat(item.Amount);
        acc[category] = (acc[category] || 0) + amount;
        return acc;
    }, {});

    // sort categories descending by amount
    const sortedCategories = Object.keys(categorySums).sort((a, b) => categorySums[a] - categorySums[b]);

    // extract keys and values
    const sortedKeys = sortedCategories;
    const sortedValues = sortedCategories.map(category => categorySums[category]);

    // create trace
    const trace = {
        x: sortedValues,
        y: sortedKeys,
        type: 'bar',
        orientation: 'h',
    };

    // create layout
    const layout = {
        title: 'Amount by Category',
        xaxis: { title: 'Category' },
        yaxis: { title: 'Amount' }
    };

    // plot chart
    Plotly.newPlot('bar-plot', [trace], layout);
}