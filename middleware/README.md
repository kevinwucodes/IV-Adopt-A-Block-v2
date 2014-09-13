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
POST /users/images
```
HEADERS
Content-Type: multipart/form-data
Accept-Version: ~1

PAYLOAD

{
    tripID: "",
    imageType: "JPG",
    blob: <multipart representation>, // this no longer require base64 encoding due to multipart/form-data content type
    type: "hazard",
    comment: "bring something to clean up glass please",
    point: {
      "lat": 34.409094,
      "long": -119.854158,
      "epoch": 1405659960723
    }
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


#### GET Static Routes

(work in progress)



#### Get Routes

GET /users/completed/:start/:end

```
This gets only COMPLETED routes based on timestamp between :start and :end
  {
    firstname: #firstname#,
    lastname: #lastname#,
    trips: [
      {
        tripID: #tripID#,
        created : #date#,
        buckets: #buckets#,
        blocks: #blocks#,
        completed: #completed#
      }, ...
    ]
  }
```

GET /users/incomplete

```
This returns all tripIDs where they are not complete
  {
    firstname: #firstname#,
    lastname: #lastname#,
    trips: [
      {
        tripID: #tripID#
      }, ...
    ]
  }
```

GET /users/waypoints/:tripID

```
This returns all the waypoings from a :tripID
  {
    firstname: #firstname#,
    lastname: #lastname#,
    trips: {
      tripID: #tripID#,
      points: [ 
                {
                    "lat" : #lat#,
                    "long" : #long#,
                    "epoch" : #epoch#,
                    "received" : #received#
                }, ...
      ]
    }
  }
```
