"use strict";

const express = require("express");
// const httpServer = createServer();
const socketIO = require("socket.io");
// import { socketIO } from "socket.io";
const PORT = process.env.PORT || 3030;
const INDEX = "/index.html";

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

// const io = socketIO(server);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3100",
  },
  pingTimeout: 500,
  pingInterval: 500,

});

io.on("connection", (socket) => {
  console.log("Client connected id: " + socket.id);

  socket.on("PRIVATE_MESSAGE", function ({ from, content, to }, callback) {
    console.log("from:" + from);
    console.log("content:" + content);
    console.log("to:" + to);
    callback("RECEIVED");
    io.to(to).emit("PRIVATE_MESSAGE", {
      from,
      content,
      to,
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected: " + socket.id);
    io.sockets.emit("disconnect-client", socket.id);
  });

  // io.sockets.emit('connection-client', socket.id)
  // socket.on('disconnect', () => {
  //   console.log('Client disconnected: ' + socket.id)
  //   io.sockets.emit('disconnect-client', socket.id)
  // });
  // socket.on('app-event', function (data) {
  //   console.log(data);
  //   io.sockets.emit('app-event', data)
  //   // callback('ok');
  // });

  // socket.on('web-app', function (data) {
  //   console.log(data);
  //   io.sockets.emit('app-web', data)
  //   // callback('ok');
  // });
});

// setInterval(() => {
//   io.emit('time', new Date().toTimeString(), function(response){
//     console.log(respone)
//   })
// }
//   , 1000);
