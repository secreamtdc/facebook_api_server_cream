

const mongo = require('./mongo')

const request = require('request');
// Handles messages events
function handleMessage(sender_psid,recipient, received_message,timestamp) {
    let response;
    
    // Check if the message contains text
    if (received_message.text) {
      console.log('received_message');
      
      console.log(received_message);
      
      
      mongo.insertChat(sender_psid,recipient,received_message.text,timestamp);
      // Create the payload for a basic text message
      response = {
        "text": `You sent the message: "${received_message.text}".`
      }
    }  

    // Sends the response message BOT
    // callSendAPI(sender_psid, response);  
  
  }
    
  // Sends response messages via the Send API
  function callSendAPI(sender_psid, response) {
      // Construct the message body
      let request_body = {
        "recipient": {
          "id": sender_psid
        },
        "message": response
      }
    
      // Send the HTTP request to the Messenger Platform
      request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": "EAAf21W9ZCZCQsBAG2wsrPOZCyxZCYsqpGB7zZCbWnoltwIyjL3nfxKbZApVOrFB8MtEuSm95pGGibd7p6dYBjzsb0VZAlCoJdIZAj2ZAMXOPqhZAcJl2hNS1iduDo3kyDzrbQhidQehaakVHnJR3wQwGxiheVR5UuxmvnRZCwJ2jiGS7Wx8k6iH9tZAoD28fbueZA46EZD" },
        "method": "POST",
        "json": request_body
      }, (err, res, body) => {
        if (!err) {
          console.log('message sent!')
        } else {
          console.error("Unable to send message:" + err);
        }
      }); 
  }
  module.exports = {
    callSendAPI,handleMessage
  };