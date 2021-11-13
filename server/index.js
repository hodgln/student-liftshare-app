require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
    origin: "http://localhost:8081",
    methods: ["GET", "POST"],
 }});
// const messaging = require("./routes/messaging");






//middleware
app.use(cors())
app.use(express.json())

//ROUTES
app.use("/auth", require("./routes/JWTauth"));

//dashboard route
app.use("/dashboard", require("./routes/dashboard"));

//payment route
app.use("/payment", require("./routes/payment"));

//messaging route
app.use("/conversation", require("./routes/conversation"));

//confirmation code route
app.use("/confirmation", require("./routes/confirmation"));

//locations route
app.use("/locations", require("./routes/locations"));


//get messages
//app.get("/getmessage", messaging.getSocketMessages)

/*

//send out most recent messages
const emitRecentMessages = (convo_id) => {
  messaging.getSocketMessages(convo_id).then((result) => io.emit("chat received", result));
}

//message socket
io.on("connection", socket => {
    console.log(socket.id);
    socket.on("chat message", async(msg) => {
      await messaging.createSocketMessage(msg)
      try {
        
      console.log(msg.convo_id);
      //io.emit("chat received", msg);

      emitRecentMessages(msg.convo_id);
      
      } catch (error) {
        console.log(error.message)
      }
      
    });
    socket.on("disconnect", () => {
        console.log("user disconnected")
    })
  });

  */


//start server
server.listen(8081, () => console.log('server has started on port 8081'))



