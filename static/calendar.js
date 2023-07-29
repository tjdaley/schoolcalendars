function fetchData() {
	  //const endpoint = "https://schoolcalendar.jdbot.us/isd/Dallas%20ISD/year/2022-2023";
	  const endpoint = "http://localhost:8000/isd/Dallas%20ISD/year/2022-2023";

	  // Make a GET request to the API endpoint
	  fetch(endpoint)
		.then(response => response.json())
		.then(data => {
		  // Process the data and generate the calendar
		  	displayCalendar(data);
		})
		  .catch(error => {
		  	console.error('Error fetching data:', error);
		});
	}

	// Function to display the calendar with events
function displayCalendar(yearData) {
	console.log(yearData);
	  const calendarDiv = document.getElementById("calendar");

	  // Create a table to represent the calendar
	  const table = document.createElement("table");

	  // Add header row
	  const headerRow = document.createElement("tr");
	  const months = [
		"January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	  ];

	  months.forEach(month => {
		const th = document.createElement("th");
		th.textContent = month;
		headerRow.appendChild(th);
	  });

	  table.appendChild(headerRow);

	  // Add rows for each day in the months
	  if (yearData) {

		for (let i = 1; i <= 31; i++) { // Assuming each month has 31 days
		  const row = document.createElement("tr");

		  months.forEach(month => {
			  const td = document.createElement("td");
			  //td.classList.add('event-tooltip-container');
			  //td.classList.add('event-tooltip-trigger');

			// Get the events for the current month and day
			  const currentDay = `${i}`.padStart(2, "0"); // Pad the day with a leading 0 if needed
			  const currentMonth = `${months.indexOf(month) + 1}`.padStart(2, "0"); // Pad the month with a leading 0 if needed
			  const currentDate = `${currentMonth}/${currentDay}/2022`;
			  td.appendChild(document.createTextNode(currentDay));
			const currentEvents = yearData.filter(event => event[currentDate]);

			// Add the events to the cell
			  currentEvents.forEach(event => {
				  console.log(event[currentDate]);
				const eventDescription = event[currentDate].description;
				  const eventCategory = event[currentDate].category.toLowerCase();
				  const className = 'event-type-' + eventCategory;
				console.log(eventDescription + '  ' + eventCategory);
			  const eventElement = document.createElement('p');
				  eventElement.textContent = eventDescription;
				 //eventElement.classList.add(className);
				  td.classList.add(className);
			  td.appendChild(eventElement);
			//	  const tooltip = document.createElement('div');
			//	  tooltip.classList.add('event-tooltip');
			//	  tooltip.textContent = eventDescription;
			//	  td.appendChild(tooltip);
			});

			row.appendChild(td);
		  });

		  table.appendChild(row);
		}
	  }

	  calendarDiv.appendChild(table);
	}

	// Fetch data and display the calendar when the page loads
	window.onload = function() {
	  fetchData();
	};