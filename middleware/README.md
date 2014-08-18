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

(work in progress)


#### GET App Properties
```
GET /static/properties/v1/mapboxProperties.json
```
To keep the app's properties consistent among its different versions (IOS, webapp, Android), we stored them in the db.
Examples of properties are:
   - color, thickness, opacity of shapes on the map (blocks, pacman path, vertexes)
   - frequency of position updating
   - proximity required to cover a vertex
   - ...
  
   In this way, changing a property on the db will automatically affect all the app versions, without recompiling.

#### Get Routes

(work in progress)
