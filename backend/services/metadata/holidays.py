import json
import datetime

def _get_holidays():
    holidays = []
    try:
        with open("services/metadata/holidays.json", "r") as f:
            holidays = json.load(f)
    except Exception as e:
        print(f"Error loading holidays: {e}")
        return []
    
    this_month = datetime.datetime.now().month
    this_day = datetime.datetime.now().day
    holidays_list = []
    month_index = {"January": 1, "February": 2, "March": 3, "April": 4, "May": 5, "June": 6, "July": 7, "August": 8, "September": 9, "October": 10, "November": 11, "December": 12}
    
    for dates in holidays["2025"]:
        month = dates.split(" ")[0]
        month_num = month_index[month]
        
        if month_num >= this_month:
            for days in holidays["2025"][dates]:
                day_str = days.split(" ")[1].replace(",", "")
                day = int(day_str)
                
                if month_num > this_month or day >= this_day:
                    holiday_data = holidays["2025"][dates][days]
                    # Add the holiday name and date to the data
                    holiday_data["name"] = holiday_data["event"]
                    holiday_data["date"] = days  # This contains the full date string like "January 1, 2025, Wednesday"
                    holidays_list.append(holiday_data)
    return holidays_list


def get_next_indian_holidays(count: int):
    holidays = _get_holidays()
    print(f"Found {len(holidays)} holidays")
    return holidays[:min(count,len(holidays))]
    