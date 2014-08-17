This is the REST layer for IV Adopt-a-Block

#### Post Routes

All POST Headers should be:
```
Content-Type: application/json
Accept-Version: ~1
```

POST /users
```
{
  "firstname":"michael",
  "lastname":"jordan",
  "tripCategory":"staff"
}
```
POST /users/waypoints
```
{
  "tripID": "",
  "point": {
    "lat": 34.409094,
    "long": -119.854158,
    "epoch": 1405659960723
  }
}
```
POST /users/paused
```
{
  "tripID": ""
}
```
POST /users/resumed
```
{
  "tripID": ""
}
```
POST /users/completed
```
{
  "tripID": "",
  "buckets": 0.75,
  "blocks": 1.5,
  "comments": "I love picking up trash"
}
```

#### GET Static Routes


```
GET /static/properties/v1/mapboxProperties.json
```
This file is necessary for de-lac.  (de-lac, could you provide a description for this for documentation purposes?)

#### Get Routes

(work in progress)
