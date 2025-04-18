This project was bootstrapped using Node.js + TypeScript + Express

The task description can be found online
at: https://powerxai.notion.site/Software-Engineer-c2d8095970d94e78a39f1abd86533939

## Getting Started

In the project directory, you can run:

### `npm run serve`

Runs the app in the development mode at [http://localhost:3000](http://localhost:3000).

The server will reload if you make edits.<br />
You will also see any lint or type errors in the console.

## Instructions:

You are tasked with implementing the storage and retrieval logic through two API endpoints:**

### Post /data

- `POST /data` — this endpoint will receive data in a plaintext data format. Each line represents
  one reading, which consists of a timestamp, a metric name, and a metric value. For example:

    ```jsx
    1649941817 Voltage 1.34
    1649941818 Voltage 1.35
    1649941817 Current 12.0
    1649941818 Current 14.0
    ```

  The API should parse this data, store it to the database and return `{ "success": true }` to the
  client. If the data is malformed, the API should return `{ "success": false }` without storing
  anything in the database.

### GET /data

- `GET /data?from=2022-04-12&to=2022-04-14` — this endpoint should retrieve two query parameters
  `from` and `to`, which will be ISO standard dates or date-times. The API should retrieve all data
  within the given date range.

    - The `GET` endpoint should also return an average `Power` reading for each day within the query
      range. Power can be calculated as the average `Current` for a day multiplied by the average
      `Voltage` for the day.

  The result of an API call might look like this:

```jsx
[
    {
        "time": "2022-04-14T13:10:17.000Z",
        "name": "Voltage",
        "value": 1.34
    },
    {
        "time": "2022-04-14T13:10:17.000Z",
        "name": "Current",
        "value": 14
    },
    {
        "time": "2022-04-14T00:00:00.000Z",
        "name": "Power",
        "value": 18.76
    },
]
```

### Plan:

- [ ] create the parser (no test setup, let's not waste time, but TDD would be ideal for testing
  parser as we go...)
- [ ] GET endpoint validation the body will be validated as part of the parser...
- [ ] Database in-memory storage should be easily retrievable and efficient for a range, so a Map<>
  data structure would be best for this
    - Data stored in an array for each map key property...
    - Key in format <date-ISO>_metric so we can easily pick out metrics if necessary
    - We can fetch each day and top and tail the ends... CORRECTION date range is only by day not
      date/time, so we ignore that for now.
- [ ] For the GET route we
    - Validate the to/from query params and then call getDate() on the db

### Thoughts:

- Structure...
- Lib/ folder for helper functions like the parser
- DB folder for the DB
- Repository for communicating with the database, make it easier to swap out later... create
  abstract interface to implement...
- Create a route for data/ keep things clean (refactor if we have time);

Log times:
- 10:00 read and plan
- 25:00 reorganise folder create abstract interface for repository and implment
-   Create parser
