// require("dotenv").config();
// const express = require("express");
// const cors = require('cors')
// const app = express();
// const http = require("http");
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);
// const PORT = process.env.PORT || 3000;
// const path = require("path");
// const { userInfo } = require("os");
// app.use(cors())
// io.on("connection", function (socket) {
//   console.log("A user connected");
//   socket.userOnline = true;
//   const onlineStatus = socket.userOnline ? "online" : "offline";
//   socket.on("currentUser", (data) => {
//     const userInfo = {
//       onlineStatus: onlineStatus,
//       userName: data,
//     };
//     io.sockets.emit("newMsg", userInfo);
//   });
//   socket.on("message", (msg) => {
//     const formattedMsg = {
//       user: msg.user,
//       message: msg.message,
//     };

//     socket.broadcast.emit("newUser", formattedMsg);
//   });

//   //Whenever someone disconnects this piece of code executed
//   socket.on("disconnect", function () {
//     socket.userOnline = false;
//     const onlineStatus = socket.userOnline ? "online" : "offline";
//     socket.on("currentUser", (data) => {
//       const userInfo = {
//         onlineStatus: onlineStatus,
//         userName: data,
//       };
//       io.sockets.emit("newMsg", userInfo);
//     });
//     console.log("A user disconnected");
//   });
// });
// app.get("/", (req, res) => {
//   var options = {
//     root: path.join(__dirname),
//   };
//   res.sendFile("/index.html", options);
// });

// server.listen(PORT, () => {
//   console.log(`server is running on port ${PORT}`);
// });


require("dotenv").config();
const express = require("express");
const cors = require('cors');
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Socket.io Connection
io.on("connection", function (socket) {
  console.log("A user connected");

  // Setting initial online status
  socket.userOnline = true;

  socket.on("currentUser", (data) => {
    const onlineStatus = socket.userOnline ? "online" : "offline";
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

  // Handle user disconnection
  socket.on("disconnect", function () {
    socket.userOnline = false;
    const onlineStatus = socket.userOnline ? "online" : "offline";
    const data = ''; // Add your logic to get the username if needed
    const userInfo = {
      onlineStatus: onlineStatus,
      userName: data,
    };
    io.sockets.emit("newMsg", userInfo);
    console.log("A user disconnected");
  });
});

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
