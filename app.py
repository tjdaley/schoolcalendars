"""
app.py is the main file for the application. It contains the main function.
"""
from fastapi import FastAPI, Request, Response
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import os

app = FastAPI()
templates = Jinja2Templates(directory="templates")

# Sample school calendar data
school_calendar_data = {
	"district_id": "Dallas ISD",
	"years": [
		{
			"2022-2023": [
				{"01/01/2022": {"description": "New Year's Holiday", "category": "Holiday"}},
				{"01/14/2022": {"description": "President's Day", "category": "Holiday"}},
				{"01/15/2022": {"description": "Grading Period", "category": "GradingPeriodStartStop"}},
			]
		},
		{
			"2023-2024": [
				{"01/01/2024": {"description": "New Year's Holiday", "category": "Holiday"}},
				{"01/15/2024": {"description": "President's Day", "category": "Holiday"}},
				{"01/16/2022": {"description": "Grading Period", "category": "GradingPeriodStartStop"}},
			]
		},
	],
}


@app.get("/isd/{district_id}/year/{school_year}")
def get_school_calendar(district_id: str, school_year: str):
	# Assuming school_year will be in the format "YYYY-YYYY" (e.g., "2022-2023")
	print("district_id: ", district_id)
	print("school_year: ", school_year)
	for year_data in school_calendar_data["years"]:
		if school_year in year_data:
			return year_data[school_year]

	return {"error": "School year not found"}


@app.get("/calendar")
async def show_calendar(request: Request):
	template = "calendar.html"

	# You can pass any context variables required for rendering dynamic content
	context = {"title": "School Calendar - Dallas ISD", "district_id": "Dallas ISD"}

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
