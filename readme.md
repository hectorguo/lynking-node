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

### Send friend request

```
POST /api/user/{:senderLinkedinId}/friends/{:responserLinkedinId}
```

Response:

```json
{
      "_id": "583fe4cccdd8830ef9b8373c",
      "requester": {
        "_id": "583bfb4c5392f15cb8dec06e",
        "linkedinId": "NiMjtTCXCQ",
        "firstName": "Haixu (Hector)",
        "lastName": "Guo",
        "formattedName": "Haixu (Hector) Guo",
        "headline": "Front-end Engineer",
        "numConnections": 125,
        "pictureUrl": "https://media.licdn.com/mpr/mprx/0_PSo2OO7Cy699mlXSlyc7fPfTxzQMRALe5H9oa87k2nEyEjew-HceEFf3gvwzm05H_kcEfQmka7oyJhwm-6U_dLaCM7opJhMHB6UayO-G2vUzJBHTBCwfn9WQHN",
        "profileUrl": "https://www.linkedin.com/in/hectorguo",
        "emailAddress": "hectorguo@live.com",
        "industry": "Internet",
        "summary": "",
        "__v": 44,
        "location": [
          -122.06012648622884,
          37.41037695888831
        ]
      },
      "requested": {
        "_id": "583c0be6f7fb483ebc58ac78",
        "linkedinId": "-AXeEda4CL",
        "firstName": "Aroshi",
        "lastName": "Handa",
        "formattedName": "Aroshi Handa",
        "headline": "Masters Student at Carnegie Mellon University",
        "numConnections": 302,
        "pictureUrl": "https://media.licdn.com/mpr/mprx/0_1vCo8_Kv4EGcPikpkrxWT9lPZF7cGfIs3rYWAjA1EIGBPiH0FPx2-xl9HNCYB7I9cyYWPxr9UCiBhO5rLO15BZKv2CichOJpCO1HG_uzMZtOhWevCsidkQDM_W",
        "profileUrl": "https://www.linkedin.com/in/aroshi-handa",
        "emailAddress": "aroshihanda@gmail.com",
        "industry": "Computer Software",
        "summary": "",
        "__v": 4,
        "location": [
          -122.06012484858881,
          37.4103443844837
        ]
      },
      "__v": 0,
      "dateSent": "2016-12-01T08:52:28.412Z",
      "status": "Pending"
    }
```

### Accept or deny request from sender

```
PUT /api/user/{:responserLinkedinId}/friends/{:senderLinkedinId}
```

Request Body:

```json
{
	"action": "deny" // "accept"
}
```

Response Body:

```json
{
  "_id": "583fe54acdd8830ef9b8373d",
  "requester": {
    "_id": "583bfb4c5392f15cb8dec06e",
    "linkedinId": "NiMjtTCXCQ",
    "firstName": "Haixu (Hector)",
    "lastName": "Guo",
    "formattedName": "Haixu (Hector) Guo",
    "headline": "Front-end Engineer",
    "numConnections": 125,
    "pictureUrl": "https://media.licdn.com/mpr/mprx/0_PSo2OO7Cy699mlXSlyc7fPfTxzQMRALe5H9oa87k2nEyEjew-HceEFf3gvwzm05H_kcEfQmka7oyJhwm-6U_dLaCM7opJhMHB6UayO-G2vUzJBHTBCwfn9WQHN",
    "profileUrl": "https://www.linkedin.com/in/hectorguo",
    "emailAddress": "hectorguo@live.com",
    "industry": "Internet",
    "summary": "",
    "__v": 44,
    "location": [
      -122.06012648622884,
      37.41037695888831
    ]
  },
  "requested": {
    "_id": "583c0be6f7fb483ebc58ac78",
    "linkedinId": "-AXeEda4CL",
    "firstName": "Aroshi",
    "lastName": "Handa",
    "formattedName": "Aroshi Handa",
    "headline": "Masters Student at Carnegie Mellon University",
    "numConnections": 302,
    "pictureUrl": "https://media.licdn.com/mpr/mprx/0_1vCo8_Kv4EGcPikpkrxWT9lPZF7cGfIs3rYWAjA1EIGBPiH0FPx2-xl9HNCYB7I9cyYWPxr9UCiBhO5rLO15BZKv2CichOJpCO1HG_uzMZtOhWevCsidkQDM_W",
    "profileUrl": "https://www.linkedin.com/in/aroshi-handa",
    "emailAddress": "aroshihanda@gmail.com",
    "industry": "Computer Software",
    "summary": "",
    "__v": 4,
    "location": [
      -122.06012484858881,
      37.4103443844837
    ]
  },
  "__v": 0,
  "dateAccepted": "2016-12-01T08:54:54.516Z",
  "dateSent": "2016-12-01T08:54:34.305Z",
  "status": "Accepted"
}
```

### Get all friends' requests (sent and received)

```
GET /api/user/{:linkedinId}/friends/requests
```

```json
{
  "sent": [],
  "received": [
    {
      "_id": "583fe4cccdd8830ef9b8373c",
      "requester": {
        "_id": "583bfb4c5392f15cb8dec06e",
        "linkedinId": "NiMjtTCXCQ",
        "firstName": "Haixu (Hector)",
        "lastName": "Guo",
        "formattedName": "Haixu (Hector) Guo",
        "headline": "Front-end Engineer",
        "numConnections": 125,
        "pictureUrl": "https://media.licdn.com/mpr/mprx/0_PSo2OO7Cy699mlXSlyc7fPfTxzQMRALe5H9oa87k2nEyEjew-HceEFf3gvwzm05H_kcEfQmka7oyJhwm-6U_dLaCM7opJhMHB6UayO-G2vUzJBHTBCwfn9WQHN",
        "profileUrl": "https://www.linkedin.com/in/hectorguo",
        "emailAddress": "hectorguo@live.com",
        "industry": "Internet",
        "summary": "A graduate student at Carnegie Mellon University. More than 4 years' experiences of Web Development -- 7 months in Tencent, 1 year as a Freelancer, and 3+ years in Huawei. Familiar with Single Page App (SPA), Hybrid Mobile App, RESTful web services and Web Extensions Development. Moreover, some web design and game mods have been done during spare time. All personal projects can be seen on my website (http://hectorguo.com/en/projects/).\n\n- Web Front-End Development. (HTML5 & CSS3 & Javascript, ES6).\n- Familiar with Vue.js, Polymer, AngularJS, Jquery and Bootstrap framework.\n- Familiar with RESTful web services (Node.js & Mongoose).\n- Familiar with common tools and libraries (Git, SVN & Gulp).\n- Some work experience with Javascript Unit Test (Mocha).\n- System Design in SOA Implement Framework.\n- Expertise in Requirement Analysis for Web Application.",
        "__v": 44,
        "location": [
          -122.06012648622884,
          37.41037695888831
        ]
      },
      "requested": {
        "_id": "583c0be6f7fb483ebc58ac78",
        "linkedinId": "-AXeEda4CL",
        "firstName": "Aroshi",
        "lastName": "Handa",
        "formattedName": "Aroshi Handa",
        "headline": "Masters Student at Carnegie Mellon University",
        "numConnections": 302,
        "pictureUrl": "https://media.licdn.com/mpr/mprx/0_1vCo8_Kv4EGcPikpkrxWT9lPZF7cGfIs3rYWAjA1EIGBPiH0FPx2-xl9HNCYB7I9cyYWPxr9UCiBhO5rLO15BZKv2CichOJpCO1HG_uzMZtOhWevCsidkQDM_W",
        "profileUrl": "https://www.linkedin.com/in/aroshi-handa",
        "emailAddress": "aroshihanda@gmail.com",
        "industry": "Computer Software",
        "summary": "At present, I am studying at Carnegie Mellon University, Silicon valley pursuing MS in Software Management. Through my engineering background in computer science, past internships and college activities, I perform well in an intellectually stimulating environment. ",
        "__v": 4,
        "location": [
          -122.06012484858881,
          37.4103443844837
        ]
      },
      "__v": 0,
      "dateSent": "2016-12-01T08:52:28.412Z",
      "status": "Pending"
    }
  ]
}
```

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/810f55372c0f77b4a64e)