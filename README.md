## Description

Simple school appointment system.

## Project prerequisites

- Node.js
- postgresql

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run migrations

```bash
# run migrations
$ npm run db:migrate:up

# rollback migrations
$ npm run db:migrate:down
```

## Configurations

All configurations are in the `.env` file. Copy the `.env.example` file and rename it to `.env`. It has the following app variables:

- APP_APPOINTMENTS_SLOTS - Appointments slots number per session
- APP_APPOINTMENTS_DURATION - Appointments duration in minutes
- APP_SHCOOL_START_HOUR - School start hour
- APP_SHCOOL_END_HOUR - School end hour
- APP_SCHOOL_OFF_DATES - School off dates in array of dates, example: ["2024-11-01", "2024-11-02"]

Note: if this need to be configurable by back office, it should be stored in database later. Especially if different school scenario with different operating hours. Since this is a simple project, it will be stored in the .env file.

## System Design

### Database

There is only one table entity in the database to store the appointments made.
The purpose of this table is to keep track of the appointments made and count the available slots for each time slot.

### API

There are only two endpoints:

- GET /schedules/available?date='2024-11-14' - Returns the available slots for the selected date. This willl return an array of available slots for the selected date.

```
[
    {
        "date": "2024-11-17",
        "time": "09:00",
        "availableSlots": 0
    },
    {
        "date": "2024-11-17",
        "time": "09:30",
        "availableSlots": 0
    },
    {
        "date": "2024-11-17",
        "time": "10:00",
        "availableSlots": 0
    },
    {
        "date": "2024-11-17",
        "time": "10:30",
        "availableSlots": 0
    },
    {
        "date": "2024-11-17",
        "time": "11:00",
        "availableSlots": 0
    }
]
```

- POST /appointments - Creates an appointment with the following body:

```
{
    "date": "2024-11-14",
    "time": "16:30",
    "name": "iqbal"
}
```

### Limitations

There are some limitations in the system which need to be addressed (due to time constraints):

1. The system does not check if availability slots for different duration in one day. So if there are already 30 minutes appointment at 10:00, then the administrator change the duration to 10 minutes, then the system marks 10:10 as available.
2. The system does not check if the booked appointment is overlap with another appointment.
3. The system must consider the timezone for different countries. Currently I assume and worked for the timezone of the server.
