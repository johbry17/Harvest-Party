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

Names have been changed to protect the guilty.

## Usage

## History

The original data is in a chaotic Google Sheet:

![Sample of Original Google Sheet](./static/resources/images/HP%20Google%20Sheet%20Sample.png)

The first task was to make a copy of the data, eliminating the flotsam and jetsam. I copied each year, changed the purchase date to just the year, and manually categorized the data, like so:

![Sample of Cleaned Spreadsheet](./static/resources/images/HP%20Cleaned%20Sheet%20Sample.png)

I also created sheets for donations/year, attendees/year (based on Facebook, an increasingly irrelevant metric), and reimbursements to whomsoever purchased items for a given year. All were exported as csv's.

Git ignored, I created a script to give the participants pseudonyms and stitch the individual years together into one expense csv. It's dynamic, and will automatically work for future years (unless new names are added).

Commencing an exploratory data analysis (EDA), I began what little data wrangling I had left. Using regex to strip '$' and ',', I converted all currency to floats, renamed a few columns, and dropped a few nulls from the donations. One category, Costco, I semi-arbitrarily broke apart, assigning 1/3 to Food and 2/3 to the Bar.

And then I plotted like a crazed banshee frothing at the mouth (and learned Seaborn and more Plotly while I was at it).

## Gallery

## References

Data supplied by the Harvest Party planning committee.

## Acknowledgements

Much gratitude to the cs50 team, for helping this autodidact learn to code.

Especial thanks to the Harvest Party planning committee, Randy Detman, Tom Brady, Watsonville, Morning Glory, and Bitter Barbie.

And to all of the attendees of Harvest Party, past and future.

## Author

Bryan Johns, February 2024