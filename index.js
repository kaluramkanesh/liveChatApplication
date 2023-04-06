require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server);
const PORT = process.env.PORT || 3000;
const path = require("path");
const { userInfo } = require("os");

io.on("connection", function (socket) {
  console.log("A user connected");
  socket.userOnline = true;
  const onlineStatus = socket.userOnline ? "online" : "offline";
  socket.on("currentUser", (data) => {
    const userInfo = {
      onlineStatus: onlineStatus,
      userName: data,
    };
    io.sockets.emit("newMsg", userInfo);
  });
  socket.on("message", (msg) => {
    const formattedMsg = {
      user: msg.user,
      message: msg.message,
    };

    socket.broadcast.emit("newUser", formattedMsg);
  });

  //Whenever someone disconnects this piece of code executed
  socket.on("disconnect", function () {
    socket.userOnline = false;
    const onlineStatus = socket.userOnline ? "online" : "offline";
    socket.on("currentUser", (data) => {
      const userInfo = {
        onlineStatus: onlineStatus,
        userName: data,
      };
      io.sockets.emit("newMsg", userInfo);
    });
    console.log("A user disconnected");
  });
});
app.get("/", (req, res) => {
  var options = {
    root: path.join(__dirname),
  };
  res.sendFile("/index.html", options);
});

server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
