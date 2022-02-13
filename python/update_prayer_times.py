'''
Output Format:

fajrTime
dhuhrTime
asrTime
maghribTime
ishaTime
currentTime
currentDate
'''

# imports
from datetime import date, datetime, timedelta
import time

# code from github praytimes.py
#     - save this as a .py in the same directory
#     https://gist.github.com/skeeph/3293106
#     http://praytimes.org/manual
from praytimes import PrayTimes

# file in directory that contains location info
from location_input import Location


# import pytz for timezone
import pytz
import os

# function to output list of prayer times
# output to 'prayer_times.py' in same directory
# current output: each major prayer time on one line

# returns 1 if dst, 0 if not
def is_dst(tz):
    now = pytz.utc.localize(datetime.utcnow())
    if(now.astimezone(tz).dst() != timedelta(0)): return 1
    else: return 0
'''
def output_times(times, current_prayer, next_prayer, time_to_next):

    # get current time and date
    current_time = datetime.now(tz).strftime('%#I:%M%p').lower()
    print('%s\n%s\n%s\n%s\n%s\n%s\n%s\n%s\n%s\n%s'
          %(times['fajr'],times['dhuhr'],
          times['asr'],times['maghrib'],
          times['isha'], current_prayer, current_time,
          Location.name, next_prayer, time_to_next))

    # get current time and date
    current_time = datetime.now().strftime('%#I:%M%p').lower()
    # current_date = datetime.now().strftime('%m/%d/%Y')

    # open file
    file = open('prayer_times.txt', 'w')

    # write times to file
    file.write('%s\n%s\n%s\n%s\n%s\n%s\n%s\n%s\n%s\n%s'
                %(times['fajr'],times['dhuhr'],
                  times['asr'],times['maghrib'],
                  times['isha'], current_prayer, current_time,
                  Location.name, next_prayer, time_to_next))

    file.close()
'''
# convert hh:mmam/pm time to number of minutes after 12am
def convert_time (input_time):

    ampm = (input_time.split(':')[1])[2:4]
    # print(input_time, ampm)
    minutes = int((input_time.split(':')[1])[0:2])

    if ampm == 'am':

        # at 12am, set hour to 0
        if input_time.split(':')[0] == '12':
            hour = 0
        # else, set hour to hour
        else:
            hour = int(input_time.split(':')[0])

    if ampm == 'pm':

        # at 12pm, set hour to 12
        if input_time.split(':')[0] == '12':
            hour = 12
        # else, set hour to hour + 12
        else:
            hour = int(input_time.split(':')[0]) + 12

    return (hour * 60 + minutes)

# code to figure out current prayer
# also returns next prayer and time to next prayer
def get_current_prayer (times, tz):

    # get current time
    current_time = convert_time(datetime.now(tz).strftime('%#I:%M%p').lower())

    # generate times for each
    fajr_time = convert_time(times['fajr'])
    sunrise_time = convert_time(times['sunrise'])
    dhuhr_time = convert_time(times['dhuhr'])
    asr_time = convert_time(times['asr'])
    maghrib_time = convert_time(times['maghrib'])
    isha_time = convert_time(times['isha'])

    # determine current prayer and next prayer
    # use to determine time to next prayer
    if (current_time >= isha_time):
        current_prayer = 'Isha'
        next_prayer = 'Fajr'
        # if before midnight, use diff method to determine time_to_next
        time_to_next = fajr_time + (24 * 60 - current_time)

    if (current_time < fajr_time):
        current_prayer = 'Isha'
        next_prayer = 'Fajr'
        time_to_next = fajr_time - current_time


    if (fajr_time <= current_time < sunrise_time):
        current_prayer = 'Fajr'
        next_prayer = 'Sunrise'
        time_to_next = sunrise_time - current_time

    if (sunrise_time <= current_time < dhuhr_time):
        current_prayer = 'Sunrise'
        next_prayer = 'Dhuhr'
        time_to_next = dhuhr_time - current_time

    if (dhuhr_time <= current_time < asr_time):
        current_prayer = 'Dhuhr'
        next_prayer = 'Asr'
        time_to_next = asr_time - current_time

    if (asr_time <= current_time < maghrib_time):
        current_prayer = 'Asr'
        next_prayer = 'Maghrib'
        time_to_next = maghrib_time - current_time

    if (maghrib_time <= current_time < isha_time):
        current_prayer = 'Maghrib'
        next_prayer = 'Isha'
        time_to_next = isha_time - current_time

    # convert time_to_next to hours, min
    if (time_to_next == 1):
        time_to_next_str = ('1 minute')

    elif (1 < time_to_next < 60):
        time_to_next_str = ('%s minutes' %time_to_next)

    elif (time_to_next >= 60):
        if (time_to_next % 60 == 1):
            time_to_next_str = ('%s hours and 1 minute' %(time_to_next // 60))

        else:
            time_to_next_str = ('%s hours and %s minutes'
                                %((time_to_next // 60,
                                time_to_next % 60)))


    # determine time to next prayer
    return current_prayer, next_prayer, time_to_next_str

# returns list of relevant data for prayer display, for sending over api
def send_api_data(): 
    # set current timezone
    tz = pytz.timezone('America/Los_Angeles')

    # initilize class object
    prayTimes = PrayTimes()

    #set calculation method
    prayTimes.setMethod(Location.method)
    # Options: 'MWL', 'ISNA', 'Egypt', 'Makkah', 'Karachi', 'Tehran', 'Jafari'

    # set asr method
    prayTimes.adjust({'asr': Location.asr_method})
    # Options: 'Standard', 'Hanafi'

    # set dst (0/1 = no/yes dst)
    dst = is_dst(tz)

    # update times based on current date
    # getTimes (date, coordinates, timeZone [, dst [, timeFormat]])
    times = prayTimes.getTimes(datetime.now(tz).date(),
                               (Location.lat, Location.lng),
                                Location.time_zone, dst, '12h')

    # get current prayer using function
    current_prayer, next_prayer, time_to_next = get_current_prayer(times, tz)

    # get current time and date
    current_time = datetime.now(tz).strftime('%#I:%M%p').lower()

    # final output
    return('%s;%s;%s;%s;%s;%s;%s;%s;%s;%s'
           %(times['fajr'],times['dhuhr'],
           times['asr'],times['maghrib'],
           times['isha'], current_prayer, current_time,
           Location.name, next_prayer, time_to_next))

    '''
    Output:
    0. Fajr 1. Dhuhr 2. Asr3. Madhrib 4. Isha
    5. Current Prayer 6. Current Time 7. Location Time
    8. Next Prayer 9. Time to Next Prayer
    '''

# returns dictionary of relevant data for prayer display, for sending over api
def send_api_dict():

    # set current timezone
    tz = pytz.timezone('America/Los_Angeles')

    # initilize class object
    prayTimes = PrayTimes()

    #set calculation method
    prayTimes.setMethod(Location.method)
    # Options: 'MWL', 'ISNA', 'Egypt', 'Makkah', 'Karachi', 'Tehran', 'Jafari'

    # set asr method
    prayTimes.adjust({'asr': Location.asr_method})
    # Options: 'Standard', 'Hanafi'

    # set dst (0/1 = no/yes dst)
    dst = is_dst(tz)

    # update times based on current date
    # getTimes (date, coordinates, timeZone [, dst [, timeFormat]])
    times = prayTimes.getTimes(datetime.now(tz).date(),
                               (Location.lat, Location.lng),
                                Location.time_zone, dst, '12h')

    # get current prayer using function
    current_prayer, next_prayer, time_to_next = get_current_prayer(times, tz)

    # get current time and date
    current_time = datetime.now(tz).strftime('%#I:%M%p').lower()

    output_dict = {
        'fajr_time': times['fajr'],
        'dhuhr_time': times['dhuhr'],
        'asr_time': times['asr'],
        'maghrib_time': times['maghrib'],
        'isha_time': times['isha'],
        'current_time': current_time,
        'current_prayer': current_prayer, 
        'next_prayer': next_prayer, 
        'time_to_next': time_to_next,
        'location': Location.name 
    }

    # final output
    return output_dict