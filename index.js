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
        console.log("Successfully sent notification:", response);
        res.json({"Message": "Successfully sent notification"});
    })
    .catch(function(error) {
        console.log("Error sending notification:", error);
        res.json({"Message": "Error sending notification"});
    });
});

app.post('/subscribeToTopic', function(req, res){
    const topic = req.body.topic;
    const token = req.body.token;

    admin.messaging().subscribeToTopic(token, topic)
    .then(function(response){
        console.log("Successfully subscribed to topic:", response);
        res.json({"Message": "Successfully subscribed to topic."});
    })
    .catch(function(error){
        console.log("Error subscribing to topic:", error);
        res.json({"Message": "Error subscribing to topic."});
    })
});

app.post('/unsubscribeFromTopic', function(req, res){
    const topic = req.body.topic;
    const token = req.body.token;

    admin.messaging().unsubscribeFromTopic(token, topic)
    .then(function(response){
        console.log("Successfully subscribed to topic:", response);
        res.json({"Message": "Successfully subscribed to topic."});
    })
    .catch(function(error){
        console.log("Error subscribing to topic:", error);
        res.json({"Message": "Error subscribing to topic."});
    })
});

app.post('/sendToTopic', function(req, res){
    const topic = req.body.topic;
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

    admin.messaging().sendToTopic(topic, notificationPayload, notificationOptions)
    .then(function(response){
        console.log("Successfully sent notification to a topic:", response);
        res.json({"Message": "Successfully sent notification to a topic."});
    })
    .catch(function(error){
        console.log("Error in sending notification to a topic:", error);
        res.json({"Message": "Error in sending notification to a topic."});
    })
});