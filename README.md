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

## Plan:

- [x] create the parser (no test setup, let's not waste time, but TDD would be ideal for testing
  parser as we go...)
- [x] GET endpoint validation the body will be validated as part of the parser...
- [ ] Database in-memory storage should be easily retrievable and efficient for a range, so a Map<>
  data structure would be best for this
    - Data stored in an array for each map key property...
    - Key in format <date-ISO>_metric so we can easily pick out metrics if necessary
    - We can fetch each day and top and tail the ends... **CORRECTION** date range is only by day
      not date/time, so we ignore that for now.
- [x] For the GET route we
    - Validate the to/from query params and
    - then call getDate() on the db

## Thoughts:

- Structure...
- Lib/ folder for helper functions like the parser
- DB folder for the DB
- Repository for communicating with the database, make it easier to swap out later... create
  abstract interface to implement...
- Create a route for data/ keep things clean (refactor if we have time);

Log times (approx):

- 00:10 read and plan
- 00:25 reorganise folder create abstract interface for repository and implement
- 00:40 Create parser
- 00:44 Extract routes into separate router
- 00:52 Wire up GET data route with parser and database, test parser
- 01:00 Wire up POST data route and simple test request... but no time to implement DB!

## Post challenge thoughts

- Didn't quite stick to the plan, but I think doing the GET route logic first actually made more
  sense to keep focused on one task wiring, and also allowed for immediate testing of routes...
    - I could at least build in all the validation logic for the requests
- The curl commands in the [Task notes](https://powerxai.notion.site/) didn't work so
  I had to create a Postman collection which ate a little time...
    - Working curl:

```bash
curl --request POST \
  --url http://localhost:3000/data \
  --header 'Content-Type: text/plain' \
  --data $'1649941817 Voltage 1.34\n1649941818 Voltage 1.35\n1649941817 Current 12.0\n1649941818 Current 14.0'
```

- Rereading the scope of the task, there was a particular interest in the data structure used,
  hopefully the plan above is enough to show the approach I would have used!

## Progress outside interview timeframe (post review)

### Strict type checking for the Metric

- Didn't catch the power calculation step :-( if I had caught it, I may have implemented a stricter
  Metric type (Union) and run time validation via type guard.
    - In a real world situation, especially ingesting data from building services and industrial
      protocols, perhaps this would introduce brittleness to the system where metrics can be dynamic
      or
      open-ended
        - The lead time implementing this new metric into the code base could lead to data loss.
          I would store everything that fits the schema of the line...
        - If `POWER` is a necessary calculation, which it sounds like it is, and we want to allow
          ingestion of all metrics, we can't validate it on each request because readings are line
          by line one line does not guarantee the next, so:
            - Warn or flag when required metrics are missing on the `GET` request
            - Defer the Power calculation to a scheduled job (e.g. cron) at the end of the day...
            - Anything else? metrics_metadata table perhaps? Totally forgot to consider sensorId as
              part of the key! sensorId would be critical in real-world data.

#### Post Implementation notes

- I used a type guard to implement runtime validation and compile-time type narrowing.
- The use of a const read-only array was fine with only two Metrics, and using .find() allowed me to
  avoid using as (which I did initially with .includes()).
    - commit: 9cd4ac3f74dc8f7e5ee228ce87ae1343ef3f5778
- Comment from `simondo92`: How would we validate if that list grows to hundreds of codes?
    - As discussed with only a few metrics Arrays are fine, but as this list scales Arrays are not
      optimal..
    - Instead we should use a Set<> and then use .has() to check for the metric
    - This is because Array methods like includes, find, etc, will iterate through each element of
      the array, resulting in O(n) complexity which grows linearly with size
    - On the other hand Set<> has a O(1) constant time lookup - we'll implement as the final commit
