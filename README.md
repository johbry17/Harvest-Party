# Harvest-Party
Data analysis and interactive visualizations for an annual fundraiser for the [Capital Area Food Bank](https://www.capitalareafoodbank.org/) in Washington DC.

## Table of Contents

- [Description](#description)
- [Usage](#usage)
- [History](#history)
- [Gallery](#gallery)
- [Certificate](#certificate)
- [References](#references)
- [Acknowledgements](#acknowledgements)
- [Author](#author)

## Description

A Python Jupyter Notebook exploratory data analysis of the finances of an annual fundraiser, followed by an explanatory data analysis in Tableau, designed to ensure fiscal transparency for stakeholders and to encourage donations. Accompanied by a website for public outreach.

Names have been changed to protect the guilty. This is a fun project.

## Usage

I posted the 2023 [exploratory data analysis](https://colab.research.google.com/drive/123nofMYi7z7l8IldtLYO9ns2wDWzKHCE?usp=sharing) (EDA) to Google Colab, as some of the hover info from Plotly will not render on GitHub, because GitHub only hosts static web content. You can see the same `exploratory_data_analysis.ipynb` here in the root directory, updated for 2024.

The website is hosted here on GitHub Pages, under the domain name [harvestpartydc.com](https://www.harvestpartydc.com/). All files are in the `/docs/` folder. The visualizations are interactive and contain lots of extra information on hover or click. I'm still ironing out some of the formatting kinks for mobile display. For example, the line plot of "Expenses by Category Over Time" should toggle between an individual category, displaying only that category's expenditure per year while dimming the rest, but it's fickle in functionality, not always displaying amounts, or working at all on mobile.

The 2023 Tableau explanatory data analysis can be viewed [here](https://public.tableau.com/app/profile/bryan.johns6699/viz/HarvestParty/HarvestPartyStory). For best viewing, check the bottom right corner and expand to full screen.

All told, the data analysis found a way to shave roughly $1,000 off the expenses of the party, a 20% savings, which happened in 2024.

## History

Harvest Party is a yearly event that takes place in the fall. It is a time to celebrate the harvest and the end of the growing season. The event is a fundraiser for the Capital Area Food Bank. The event features live music, food, and drinks. The event is open to the public and is a great way to support the local community.

It is adored by my network, so I used it as an opportunity to explain what my technical skill set is geared towards.

The original data is in a chaotic Google Sheet:

![Sample of Original Google Sheet](./resources/images/HP%20Google%20Sheet%20Sample.png)

The first task was to clean and organize the data, eliminating the flotsam and jetsam.  I made a copy of the dataset, removed extraneous information, and standardized the purchase date to reflect only the year. Then, I manually categorized the data:

![Sample of Cleaned Spreadsheet](./resources/images/HP%20Cleaned%20Sheet%20Sample.png)

I also created separate sheets for donations per year, attendees per year (based on Facebook, an increasingly irrelevant metric), and reimbursements to individuals who purchased items. All of these were exported as CSV files.

Using a Git-ignored script, I assigned pseudonyms to participants and merged the individual years into a single expense CSV. The script is dynamic and will work for future years unless new names are added.

I performed minimal data wrangling. Using regex, I stripped '$' and ',' from the data, converted all currency to floats, renamed a few columns, and removed a few nulls from the donations. I also reallocated the "Costco" category, assigning 1/3 to Food and 2/3 to the Bar.

As is good practice for a data project, I performed an exploratory data analysis (EDA) to brainstorm what I wanted to put into the website and Tableau. I created various plots in Matplotlib, Seaborn, and Plotly. The results were unsurprising: costs have increased due to inflation (e.g., rising musician and house cleaning costs) and the addition of new features to the event (e.g., better logo design, cleaners on the day of the event).

I cleaned up the EDA, adding comments on my thought process and the value (or not) of relevant charts, and then posted it to Google Colab, to allow viewers to interact with Plotly's dynamic content.

I built the website to be hosted by GitHub Pages. Building a server side for this project would have been overkill, making GitHub Pages a perfect host for this project. It is designed to be mobile-responsive.

The visualizations are designed to effectively communicate how funds were spent and how much has been donated. They display both individual years and cumulative data for all years, including an estimate of the cost per attendee, despite the growing unreliability of Facebook metrics. The goal is to engender trust and encourage continued donations, as well as trim the budget in future years.

I put a lot of thought into the presentation of the information, rounding off numbers in some cases and often choosing not to display them to reduce the data-to-ink ratio. I used Plotly's hover tools to provide that information if desired, as most casual viewers will likely access the website on mobile. I maintained a consistent color scheme for all visualizations to enhance understanding, even though I would have preferred to use a solid blue for some visualizations, like the initial "Expenditure by Category" plot. However, it would have been confusing to use color coding in some visualizations and not others. I also included a sunburst chart for fun because it is pretty and interactive, although I remain skeptical about its future utility in communicating data insights (too cluttered). Fun fact: I programmed all the numbers to display according to the viewer's locale, ensuring that regionally appropriate punctuation is used for the thousands and decimal separators.

Included is an image carousel that rotates through pictures from the fundraiser, or displays the logo of a chosen year.

The email form is handled by Formspree, delivering submissions to the email address harvestparty313@gmail.com.

I am generally satisfied with the code, although the visualizations could be more efficient. For instance, the math, traces, and layout for many could have been abstracted into separate functions, but I wanted to be able to toggle them on and off with ease.

The Sass, however, is a nightmare of inefficiency, having evolved clumsily as I tackled each element. I know I could have streamlined it. I underestimated the amount of styling needed and how repetitive it can get. Variables and mixins are the future. This is my first major styling project in CSS, and I never want to do it again. Mobile-responsive CSS is officially Nightmare Fuel, and I need Brain Bleach. I would very much like to return to my peaceful little data science Jupyter Notebooks now.

The website does contain a few extra flourishes. For example, the homepage logo randomly selects one of the available logos on reload, and the 2020 page features an empty party venue with a few blue safety masks rolling across the screen — a nod to the year the fundraiser was canceled due to COVID-19.

Future tasks include consulting a graphic designer to improve the aesthetics of the website and adding efficiency enhancements, like preloading images, lazy loading for the image carousel, and caching fetched data in the browser's localStorage or sessionStorage. I might also add a dark mode, subtle animations, or custom icons. Projects never end.

The 2023 Tableau explanatory data analysis has two formats, one for desktop, and one for mobile. The desktop version contains a more comprehensive analysis, while the mobile version distills down to only the highlights. It summarizes the results of the data analysis, explaining to attendees the rationale behind setting suggested donations, and identifying explicit cost-cutting opportunities to be presented to the Harvest Party planning committee, likely resulting in a 20% decrease in expenditures for the upcoming year (n.b., this happened).

## Gallery

Exploratory Data Analysis:

![Box and Whisker Plot from Exploratory Data Analysis](./resources/images/eda.png)

Tableau Explanatory Data Analysis:

![Tableau Net Annual Profit or Loss](./resources/images/tableau.png)

![Tableau Yearly Totals](./resources/images/tableau_alt.png)

![Tableau Cost per Person](./resources/images/tableau_alt_2.png)

Website plots:

![Expenditure by Category, All Years](./resources/images/expenditure_by_category.png)

![Itemized 2019 Visualization](./resources/images/itemized_2019.png)

![Itemized 2022 Table](./resources/images/itemized_table_2022.png)

![Sunburst of All Expenses, All Years](./resources/images/Sunburst.png)

![Donations Minus Expenses](./resources/images/donations_minus_expenses.png)

Pictures from the image carousel:

![Intro screen with kids ponying up to the bar](./resources/images/intro.png)

![Band image from carousel](./resources/images/band.png)

![Dog image from carousel](./resources/images/dog.png)

![Logo 2019](./resources/images/hp_2019.jpg)

![Logo 2022](./resources/images/hp_2022.jpg)

![2020 with masks rolling across it](./resources/images/2020.png)

## Certificate

![cs50x certificate](./resources/images/CS50x.png)

## References

Data supplied by the Harvest Party planning committee.

## Acknowledgements

Much gratitude to the cs50 team, for helping this autodidact learn to code.

Special thanks to the Harvest Party planning committee, Randy Detman, Tom Brady, Watsonville, Morning Glory, and Bitter Barbie.

And to all of the attendees of Harvest Party, past and future.

## Author

Bryan Johns, September 2024
Revised March 2025 (added 2024 data)
