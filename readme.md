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
  "linkedinId": "O68mBLPgcn",
  "firstName": "Haixu (Hector)",
  "lastName": "Guo",
  "formattedName": "Haixu (Hector) Guo",
  "headline": "Engineer",
  "numConnections": 117,
  "pictureUrl": "http://ws3.sinaimg.cn/mw690/6d0af205gw1f96b1yp9dgj21h80u4gyt.jpg",
  "profileUrl": "https://www.linkedin.com/in/hectorguo",
  "emailAddress": "hectorguo@live.com",
  "industry": "Internet"
}
```

### Add User's Location
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
GET /api/user/{:name}
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
GET /api/user/{:name}/match?distance={:meters}&industry=Internet
```

Response Body:

```json
{
  "users": [
    {
      "distance": 0,
      "_id": "583b6c108741bd262f27fb18",
      "name": "hg",
      "linkedinId": "O68mBLPgcn",
      "firstName": "Haixu (Hector)",
      "lastName": "Guo",
      "formattedName": "Haixu (Hector) Guo",
      "numConnections": 117,
      "pictureUrl": "http://ws3.sinaimg.cn/mw690/6d0af205gw1f96b1yp9dgj21h80u4gyt.jpg",
      "profileUrl": "https://www.linkedin.com/in/hectorguo",
      "emailAddress": "hectorguo@live.com",
      "headline": "Engineer",
      "industry": "Internet",
      "__v": 1,
      "location": [
        -122.0657768,
        37.3890879
      ]
    },
    {
      "distance": 288,
      "_id": "581e85ebd77536215ec8b5d7",
      "name": "Aroshi Handa",
      "headline": "Masters Student at Carnegie Mellon University",
      "numConnections": 266,
      "pictureUrl": "https://media.licdn.com/media/AAEAAQAAAAAAAAlmAAAAJDdlYTk3MzRiLTdmNGYtNGU3YS1iYWQ3LTM1NWVkMWMyNWUwNA.jpg",
      "profileUrl": "https://www.linkedin.com/in/aroshi-handa",
      "__v": 1,
      "location": [
        -122.062627,
        37.389749
      ]
    }
  ]
}
```

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/810f55372c0f77b4a64e)