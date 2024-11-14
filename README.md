<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

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

There are some limitations in the system which need to be addressed:

1. The system does not check if availability slots for different duration in one day. So if there are already 30 minutes appointment at 10:00, then the administrator change the duration to 10 minutes, then the system marks 10:10 as available.
2. The system does not check if the booked appointment is overlap with another appointment.
3. The system must consider the timezone for different countries. Currently I assume and worked for the timezone of the server.
