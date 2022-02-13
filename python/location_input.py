'''
File contains a class called "Location"
This class contains the location info used
    in update_prayer_times.py

Update all parameters in here, don't change update_prayer_times.py
'''

class Location:

    # coordinates at 550 Gene Friend Way
    # lat = 37.76924051347001
    # lng = -122.38970209581704

    # coordinates at 3438 Valley Vista Dr.
    lat = 37.33746814100603
    lng = -121.78669145808736

    # location name
    name = "The Palla House"

    # time zone as +/- UTC
    # PST is -8 UTC
    time_zone = -8

    # General Calculation Method
    # Options: 'MWL', 'ISNA', 'Egypt', 'Makkah', 'Karachi', 'Tehran', 'Jafari'
    # Details for Calc Methods Below
    method = 'ISNA'

    # Asr Calculation Method
    # Options: 'Standard', 'Hanafi'
    asr_method = 'Hanafi'

'''
# Calculation Methods
methods = {
    'MWL': {
        'name': 'Muslim World League',
        'params': {'fajr': 18, 'isha': 17}},
    'ISNA': {
        'name': 'Islamic Society of North America (ISNA)',
        'params': {'fajr': 15, 'isha': 15}},
    'Egypt': {
        'name': 'Egyptian General Authority of Survey',
        'params': {'fajr': 19.5, 'isha': 17.5}},
    'Makkah': {
        'name': 'Umm Al-Qura University, Makkah',
        'params': {'fajr': 18.5, 'isha': '90 min'}}, # fajr was 19 degrees before 1430 hijri
    'Karachi': {
        'name': 'University of Islamic Sciences, Karachi',
        'params': {'fajr': 18, 'isha': 18}},
    'Tehran': {
        'name': 'Institute of Geophysics, University of Tehran',
        'params': {'fajr': 17.7, 'isha': 14, 'maghrib': 4.5, 'midnight': 'Jafari'}},
    # isha is not explicitly specified in this method
    'Jafari': {
        'name': 'Shia Ithna-Ashari, Leva Institute, Qum',
        'params': {'fajr': 16, 'isha': 14, 'maghrib': 4, 'midnight': 'Jafari'}}
}
'''
