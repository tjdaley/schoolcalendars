function fetchData(school_name, year_range) {
	//const endpoint = "https://schoolcalendar.jdbot.us/isd/Dallas%20ISD/year/2022-2023";
	const endpoint = `http://localhost:8000/isd/${school_name}/year/${year_range}`;
	console.log(endpoint);

	// Make a GET request to the API endpoint
	fetch(endpoint)
		.then(response => response.json())
		.then(data => {
			// Process the data and generate the calendar
			displayCalendar(data, year_range);
		})
		.catch(error => {
			console.error('Error fetching data:', error);
		});
}

class Months {
	constructor(startYear, endYear) {
		this.months = [
			"Jan", "Feb", "Mar", "Apr", "May", "Jun",
			"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
		];

		/* These are month indices, not month numbers. */
		this.monthSequence = [7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6]; // Start with August
		this.startYear = startYear;
		this.endYear = endYear;
	}

	getMonthName(month_idx) {
		return this.months[month_idx];
	}

	/**
	 * 
	 * @param {*} month index of the month, not the month number, so Jan = 0, Feb = 1, etc.
	 * @returns 
	 */
	getApplicableYear(month) {
		if (month < this.monthSequence[0]) {
			return this.endYear;
		} else {
			return this.startYear;
		}
	}

	/**
	 * 
	 * @param {*} month index of the month, not the month number, so Jan = 0, Feb = 1, etc.
	 * @returns
	 * 		Number of days in the month
	 */
	getMaxMonthDays(month) {
		const year = this.getApplicableYear(month);
		const date = new Date(year, month, 0);
		return date.getDate();
	}
}

// Function to display the calendar with events
function displayCalendar(yearData, year_range) {
	console.log(yearData);
	const years = year_range.split('-');
	const startYear = years[0];
	const endYear = years[1];
	const MonthsObj = new Months(startYear, endYear);
	const calendarDiv = document.getElementById("calendar");

	// Create a table to represent the calendar
	const table = document.createElement("table");

	// Add header row
	const headerRow = document.createElement("tr");

	MonthsObj.monthSequence.forEach(month => {
		const th = document.createElement("th");
		th.textContent = MonthsObj.getMonthName(month);
		headerRow.appendChild(th);
	});

	table.appendChild(headerRow);

	// Add rows for each day in the months
	if (yearData) {

		for (let i = 1; i <= 31; i++) { // Assuming each month has 31 days
			const row = document.createElement("tr");

			/* Looping thru each month index, not month number. Jan = 0, Feb = 1, etc. */
			MonthsObj.monthSequence.forEach(month => {
				if (i > MonthsObj.getMaxMonthDays(month+1)) {
					// Skip this day if it doesn't exist in the current month by appending an empty cell.
					const td = document.createElement("td");
					row.appendChild(td);
				} else {
					const td = document.createElement("td");
					td.classList.add('event-tooltip-container');

					// Get the events for the current month and day
					const currentDay = `${i}`.padStart(2, "0"); // Pad the day with a leading 0 if needed
					const currentMonth = `${month + 1}`.padStart(2, "0"); // Pad the month with a leading 0 if needed
					const currentYear = MonthsObj.getApplicableYear(month);
					const currentDate = `${currentMonth}/${currentDay}/${currentYear}`;
					const dateNode = document.createTextNode(currentDay);
					td.appendChild(dateNode);
					myEvent = yearData[currentDate];

					// The array will be necessary once we start showing more than one school district at a time.
					const currentEvents = myEvent ? [myEvent] : [];

					// Add the events to the cell
					currentEvents.forEach(event => {
						const eventDescription = event.description;
						const eventCategory = event.category.toLowerCase();
						const className = 'event-type-' + eventCategory;
						td.classList.add(className);
						addTooltip(td, eventDescription);
					});

					if (currentEvents.length == 0) {
						const myDate = new Date(currentYear, month, currentDay);
						const dayOfWeek = myDate.getDay();
						if (dayOfWeek == 0 || dayOfWeek == 6) {
							var className = 'event-type-weekend';
							if (isFirstThirdFifthWeekend(myDate)) {
								className = 'event-type-135weekend';
							}
							td.classList.add(className);
							addTooltip(td, 'Weekend');
						}
					}

					row.appendChild(td);
				}
			});

			table.appendChild(row);
		}
	}

	calendarDiv.appendChild(table);
}

function addTooltip(parentElement, tooltipText) {
	const tooltip = document.createElement('div');
	tooltip.classList.add('event-tooltip');
	tooltip.textContent = tooltipText;
	parentElement.appendChild(tooltip);
}

function previousDate(date, daysback=1) {
	const onDayInMillis = 24 * 60 * 60 * 1000 * daysback;
	const previousDayInMillis = date.getTime() - onDayInMillis;
	const previousDay = new Date(previousDayInMillis);
	return previousDay;
}

/**
 * 
 * @param {*} date  A date object (must be a saturday or sunday)
 * @returns boolean true if the date is the first, third, or fifth weekend of the month
 */
function isFirstThirdFifthWeekend(date) {
	const dayOfWeek = date.getDay();
	const lookback = dayOfWeek == 6 ? 1 : 2;
	const previousFriday = previousDate(date, lookback);
	if (previousFriday.getDay() != 5) {
		console.log('Error: previous day is not a friday');
		return false;
	}
	const dayOfMonth = previousFriday.getDate();
	const isFirstFriday = dayOfMonth <= 7;
	const isThirdFriday = dayOfMonth >= 15 && dayOfMonth <= 21;
	const isFifthFriday = dayOfMonth >= 29;
	return isFirstFriday || isThirdFriday || isFifthFriday;
}


// Fetch data and display the calendar when the page loads
window.onload = function () {
	fetchData("Dallas ISD", "2023-2024");
};