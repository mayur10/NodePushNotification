const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const cors = require('cors');
const dotenv = require('dotenv');
const serviceAccount = require("./node-pushnotification-blog-001-firebase-adminsdk-md1p6-5e729c4532.json");

const notification = {
    title: "A Push Notification Test",
    body: "A Test Body"
};

const data = {
    key1: "value1",
    key2: "value2"
};

var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL
});

app.post('/sendToDevice', function(req, res){
    const fcmToken = req.body.token;
    const type = req.body.type;
    let notificationPayload;

    if(type === 'notification'){
        notificationPayload = {
            "notification": notification
        };
    } else if(type === 'data'){
        notificationPayload = {
            "data": data
        };
    } else{
        notificationPayload = {
            "notification": notification,
            "data": data
        };   
    }

    var notificationOptions = {
        priority: "high"
    };

    admin.messaging().sendToDevice(fcmToken, notificationPayload, notificationOptions)
    .then(function(response) {
        res.json({"Message": 'success'});
        console.log("Notification sent successfully", response);
    })
    .catch(function(error) {
        res.json({"Message": 'failure'});
        console.log("Error while sending notification", error);
    });
})