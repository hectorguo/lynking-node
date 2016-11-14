Lynking
==========

![Cover](http://ws3.sinaimg.cn/mw690/6d0af205gw1f96b1yp9dgj21h80u4gyt.jpg)

## APIs

### Create User
```
POST /api/user
```

Request Body:

```json
{
	"name": "hg",
	"headline": "Engineer",
	"numConnections": 117,
	"pictureUrl": "http://ws3.sinaimg.cn/mw690/6d0af205gw1f96b1yp9dgj21h80u4gyt.jpg",
	"profileUrl": "https://www.linkedin.com/in/hectorguo"
}
```

### Create User's Location
```
POST /api/user/{:name}/location
```

Request Body:

```json
{
	"lat": 37.3890879,
	"lng": -122.0657768
}
```

### Query User
```
GET /api/user/{:name}}
```

Response Body:

```json
{
    "_id": "581e4d325dbf62155bbddd89",
	"name": "hg",
	"headline": "Engineer",
	"numConnections": 117,
	"pictureUrl": "http://ws3.sinaimg.cn/mw690/6d0af205gw1f96b1yp9dgj21h80u4gyt.jpg",
	"profileUrl": "https://www.linkedin.com/in/hectorguo",
    "location": [
        -122.0657768,
        37.3890879
    ]
}
```

### Query Matched List

```
GET /api/user/{:name}/match?distance={:meters}
```

Response Body:

```json
[
  {
    "distance": 288,
    "_id": "581e85ebd77536215ec8b5d7",
    "name": "B",
    "headline": "Masters Student at Carnegie Mellon University",
    "numConnections": 266,
    "pictureUrl": "",
    "profileUrl": "https://www.linkedin.com/in/aroshi-handa",
    "__v": 1,
    "location": [
      -122.062627,
      37.389749
    ]
  },{
    "distance": 401,
    "_id": "581e85f7d77536215ec8b5d8",
    "name": "A",
    "headline": "Master's Student at Carnegie Mellon University",
    "numConnections": 564,
    "pictureUrl": "",
    "profileUrl": "https://www.linkedin.com/in/shreymalhotra",
    "__v": 1,
    "location": [
      -122.063653,
      37.392284
    ]
  }
]
```


[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/810f55372c0f77b4a64e)