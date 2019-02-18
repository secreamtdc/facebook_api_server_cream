const express = require('express')

var rp = require('request-promise');

const mongo = require('../controllers/mongo')
const webhook = require('../controllers/webhook')

const router = express.Router()
router.get('/', function(req, res){
    res.sendFile(__dirname + '../index.html');
  });


  router.get('/api/user/:fbid', (req, res) => {
    
    // Use connect method to connect to the Server
    client.connect(function(err) {
      assert.equal(null, err);
      console.log("Connected successfully to server");
  
      const db = client.db(dbName);
  
  
      const findDocuments = function(db, callback) {
          // Get the documents collection
          const collection = db.collection('Fb_chat');
          // Find some documents
          collection.find({}).toArray(function(err, docs) {
            assert.equal(err, null);
            console.log("Found the following records");
            console.log(docs)
            callback(docs);
          });
        }
        const insertDocuments = function(db, callback) {
          // Get the documents collection
          const collection = db.collection('Fb_chat');
          // Insert some documents
          collection.insertMany([
            {_FBID : req.params.fbid}
          ], function(err, result) {
            assert.equal(err, null);
            assert.equal(3, result.result.n);
            assert.equal(3, result.ops.length);
            console.log("Inserted 3 documents into the collection");
            callback(result);
          });
        }
  
          findDocuments(db, function() {
            client.close();
        });
  
      client.close();
    });
  });

  router.get('/api/userchat/:pageid', (mongo.userChat));
  
  router.get('/ping', (req, res) => {
    res.send('pong')
  })
  router.get('/callsendapi/:friendid/:msg', (req, res) => {
    let response = {
      "text": req.params.msg
    }
    webhook.callSendAPI(req.params.friendid, response);
    res.send('Sent');
  })

  router.get('/callback', (req, res) => {


    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = "Password1234;"
      
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
      
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
    
      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        
        // Responds with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
      
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);      
      }
    }
  })
  router.post('/callback', (req, res) => {  
    console.log('callback');
    
    let body = req.body;
  
    // Checks this is an event from a page subscription
    if (body.object === 'page') {
  
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {
  
        // Gets the message. entry.messaging is an array, but 
        // will only ever contain one message, so we get index 0
        let webhook_event = entry.messaging[0];
        
        // console.log(webhook_event);
        
          // Get the sender PSID
        let sender_psid = webhook_event.sender.id;
        let recipient = webhook_event.recipient.id;
        let timestamp = webhook_event.timestamp;
        // console.log('Sender PSID: ' + sender_psid);
        
        //insert UserProfile
        mongo.insertUserProfile(sender_psid,function(){
          // console.log('insert222');
          
          if (webhook_event.message) {
            console.log('webhook_event');
            
            console.log(webhook_event);
            
            webhook.handleMessage(sender_psid,recipient, webhook_event.message,timestamp);        
          } else if (webhook_event.postback) {
            webhook.handlePostback(sender_psid, webhook_event.postback);
          }
        })
      });
  
      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  
  });


module.exports = router
