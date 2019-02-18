const app = require('express')();
const http = require('http').Server(app);
const bodyParser = require('body-parser');
const io = require('socket.io')(http);

const webhook = require('./server/controllers/webhook')
global.io = io;
var _ = require('lodash');


const mongo = require('./server/controllers/mongo')
const routes = require('./server/router/index')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use('/',routes)

// รอการ connect จาก client
io.on('connection', client => {
  console.log('user connected')
  
  // เมื่อ Client ตัดการเชื่อมต่อ
  client.on('disconnect', () => {
      console.log('user disconnected')
  })

  // ส่งข้อมูลไปยัง Client ทุกตัวที่เขื่อมต่อแบบ Realtime
  client.on('sent-message', function (data) {
    let response = {
      "text": data.msg
    }
    webhook.callSendAPI(data.friendid, response);
  })
})



http.listen(4000, function(){
  console.log('listening on *:4000');
});