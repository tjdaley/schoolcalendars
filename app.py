"""
app.py is the main file for the application. It contains the main function.
"""
from fastapi import FastAPI, Request, Response
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import json
import os

app = FastAPI()
templates = Jinja2Templates(directory="templates")

# Sample school calendar data - This will be a single document in the database.
school_calendar_data = {
	"district_id": "Dallas ISD",
	"years": {
		"2022-2023": {
			"08/09/2022": {"description": "First Day of School", "category": "FirstDayofSchool"},
			"01/01/2023": {"description": "New Year's Holiday", "category": "Holiday"},
			"01/14/2023": {"description": "President's Day", "category": "Holiday"},
			"01/15/2023": {"description": "Grading Period", "category": "GradingPeriodStartStop"},
			"05/24/2023": {"description": "Last Day of School", "category": "LastDayofSchool"}
		},
		"2023-2024": {
			"08/14/2023": {"description": "First Day of School", "category": "FirstDayofSchool"},

			"08/03/2023": {"description": "Professional Development (No school)", "category": "staffdevelopment"},
			"08/07/2023": {"description": "Professional Development (No school)", "category": "staffdevelopment"},
			"08/08/2023": {"description": "Professional Development (No school)", "category": "staffdevelopment"},
			"08/09/2023": {"description": "Professional Development (No school)", "category": "staffdevelopment"},
			"10/16/2023": {"description": "Professional Development (No school)", "category": "staffdevelopment"},
			"11/07/2023": {"description": "Professional Development (No school)", "category": "staffdevelopment"},
			"01/08/2024": {"description": "Professional Development (No school)", "category": "staffdevelopment"},
			"02/19/2024": {"description": "Professional Development (No school)", "category": "staffdevelopment"},

			"08/04/2023": {"description": "Teacher Work Day (No school)", "category": "teacherworkday"},
			"08/10/2023": {"description": "Teacher Work Day (No school)", "category": "teacherworkday"},
			"08/11/2023": {"description": "Teacher Work Day (No school)", "category": "teacherworkday"},

			"09/04/2023": {"description": "Labor Day", "category": "Holiday"},
			"11/20/2023": {"description": "Thanksgiving Break", "category": "Holiday"},
			"11/21/2023": {"description": "Thanksgiving Break", "category": "Holiday"},
			"11/22/2023": {"description": "Thanksgiving Break", "category": "Holiday"},
			"11/23/2023": {"description": "Thanksgiving Break", "category": "Holiday"},
			"11/24/2023": {"description": "Thanksgiving Break", "category": "Holiday"},
			"12/25/2023": {"description": "Winter Break", "category": "Holiday"},
			"12/26/2023": {"description": "Winter Break", "category": "Holiday"},
			"12/27/2023": {"description": "Winter Break", "category": "Holiday"},
			"12/28/2023": {"description": "Winter Break", "category": "Holiday"},
			"12/29/2023": {"description": "Winter Break", "category": "Holiday"},
			"12/30/2023": {"description": "Winter Break", "category": "Holiday"},
			"12/31/2023": {"description": "Winter Break", "category": "Holiday"},
			"01/01/2024": {"description": "Winter Break", "category": "Holiday"},
			"01/02/2024": {"description": "Winter Break", "category": "Holiday"},
			"01/03/2024": {"description": "Winter Break", "category": "Holiday"},
			"01/04/2024": {"description": "Winter Break", "category": "Holiday"},
			"01/05/2024": {"description": "Winter Break", "category": "Holiday"},
			"03/11/2024": {"description": "Spring Break", "category": "Holiday"},
			"03/12/2024": {"description": "Spring Break", "category": "Holiday"},
			"03/13/2024": {"description": "Spring Break", "category": "Holiday"},
			"03/14/2024": {"description": "Spring Break", "category": "Holiday"},
			"03/15/2024": {"description": "Spring Break", "category": "Holiday"},
			"03/29/2024": {"description": "Holiday", "category": "Holiday"},
			"05/27/2024": {"description": "Memorial Day", "category": "Holiday"},
			"06/19/2024": {"description": "Juneteenth", "category": "Holiday"},
			"10/12/2023": {"description": "Fall Break", "category": "Holiday"},
			"10/13/2023": {"description": "Fall Break", "category": "Holiday"},

			"12/22/2023": {"description": "Early Release", "category": "EarlyRelease"},

			"04/01/2024": {"description": "Inclement Weather Day", "category": "BadWeatherDay"},
			"05/03/2024": {"description": "Inclement Weather Day", "category": "BadWeatherDay"},

			"01/16/2022": {"description": "Grading Period", "category": "GradingPeriodStartStop"},

			"05/24/2024": {"description": "Last Day of School", "category": "LastDayofSchool"}
		}
	}
}


@app.get("/isd/{district_id}/year/{school_year}")
def get_school_calendar(district_id: str, school_year: str):
	# Assuming school_year will be in the format "YYYY-YYYY" (e.g., "2022-2023")
	print("district_id: ", district_id)
	print("school_year: ", school_year)
	if not school_calendar_data:
		return {"error": f"District not found: {district_id}"}
	
	years = school_calendar_data.get("years")
	if not years:
		return {"error": "School years data not found - database error"}
	
	events = years.get(school_year)
	if not events:
		return {"error": f"School year not found. School year: {school_year} District: {district_id}"}
	
	print(json.dumps(events, indent=4))
	
	return events

@app.get("/calendar")
async def show_calendar(request: Request):
	template = "calendar.html"

	# You can pass any context variables required for rendering dynamic content
	context = {"title": "School Calendar - Dallas ISD", "district_id": "Dallas ISD", "school_year": "2022-2023"}

	# Render the HTML page with the template and context
	return templates.TemplateResponse(template, {"request": request, **context})


if __name__ == "__main__":
	# Mount the 'static' folder to serve static files (like CSS, JS, etc.)
	app.mount("/static", StaticFiles(directory="static"), name="static")

	# Get the current directory where the Python file is located
	current_dir = os.path.dirname(os.path.abspath(__file__))
	print("Current directory: ", current_dir)

	# Serve the 'templates' folder to access the HTML template
	app.mount("/templates", StaticFiles(directory=os.path.join(current_dir, "templates")), name="templates")

	import uvicorn

	uvicorn.run(app, host="0.0.0.0", port=8000)
