# Harvest-Party
Exploratory Data Analysis and website of annual Harvest Party budget

Development on this project has stopped.

## Table of Contents

- [Description](#description)
- [Usage](#usage)
- [History](#history)
- [Gallery](#gallery)
- [References](#references)
- [Acknowledgements](#acknowledgements)
- [Author](#author)

## Description

A python jupyter notebook exploratory data analysis of the financials of an annual party, followed by an explanatory data analysis in Tableau, designed to ensure transparency of funding for party attendees, to encourage donations. Accompanied by a website.

Names have been changed to protect the guilty.

## Usage

## History

The original data is in a chaotic Google Sheet:

![Sample of Original Google Sheet](./resources/images/HP%20Google%20Sheet%20Sample.png)

The first task was to make a copy of the data, eliminating the flotsam and jetsam. I copied each year, changed the purchase date to just the year, and manually categorized the data, like so:

![Sample of Cleaned Spreadsheet](./resources/images/HP%20Cleaned%20Sheet%20Sample.png)

I also created sheets for donations/year, attendees/year (based on Facebook, an increasingly irrelevant metric), and reimbursements to whomsoever purchased items for a given year. All were exported as csv's.

Git ignored, I created a script to give the participants pseudonyms and stitch the individual years together into one expense csv. It's dynamic, and will automatically work for future years (unless new names are added).

Commencing an exploratory data analysis (EDA), I began what little data wrangling I had left. Using regex to strip '$' and ',', I converted all currency to floats, renamed a few columns, and dropped a few nulls from the donations. One category, Costco, I semi-arbitrarily broke apart, assigning 1/3 to Food and 2/3 to the Bar.

And then I plotted like a crazed banshee frothing at the mouth (and learned Seaborn and more Plotly while I was at it).

Results were unsurprising. Costs have gone up due to inflation (i.e., increasing musician and house cleaning costs) and adding features to the party (i.e., better logo design, cleaners day-of-party).

I then cleaned up the EDA, adding comments on my thought process and the value (or not) of relevant charts.

It helped me brainstorm what I wanted to put into Tableau.

I built the website to be hosted by GitHub Pages, mainly so that I don't have to pay for a back-end.

The email form is handled by Formspree.

I am generally happy with the code. The plots are most likely inefficient - the math, traces, and layout for many could have been abstracted out into a separate function, but I wanted to be able to toggle them on and off with ease.

The Sass, however, is a nightmare of inefficiency, clumsily evolving as I tackled each element. I know I could have streamlined it. I totally underestimated how much styling I needed, and how repetitive it can get. Variables and Mixins are the future. This is my first major web site styling, and I never want to do it again. Mobile-responsive CSS is officially Nightmare Fuel, I need Brain Bleach, and I would very much like to go back to my peaceful little data science Jupyter notebooks now.

## Gallery

## References

Data supplied by the Harvest Party planning committee.

## Acknowledgements

Much gratitude to the cs50 team, for helping this autodidact learn to code.

Especial thanks to the Harvest Party planning committee, Randy Detman, Tom Brady, Watsonville, Morning Glory, and Bitter Barbie.

And to all of the attendees of Harvest Party, past and future.

## Author

Bryan Johns, September 2024
