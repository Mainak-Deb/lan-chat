// import the necessary modules
const express = require("express");
const socket = require("socket.io");

//global important variables
const app = express();
const port = 3000;
var server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
var io = socket(server);
var onlineUsers = [];

//http server
app.use(express.static("view"));
app.get("/home", (req, res) => {
  res.sendFile("view/index.html", { root: __dirname });
});

//websocket server
io.on("connection", function (socket) {
  console.log("Websocket Connected", socket.id);
  socket.on("createRoom", (data) => {
    for (var i = 0; i < onlineUsers.length; i++) {
      socket.join(createPair(data.roomName,onlineUsers[i]));
    }
    onlineUsers.push(data.roomName);
    console.log(onlineUsers);
    io.emit("onlineUsers", 
      {onlineUsers:onlineUsers}
    );
    console.log(io.sockets.adapter.rooms);
    
  });
});

function findRooms(rooms) {
  var availableRooms = [];
  for (element of rooms.values()) {
    availableRooms.push(element);
  }
  return availableRooms;
}
function createPair(room1, room2) {
  var pair = [room1,room2];
  pair.sort();
  return String(pair[0])+":"+String(pair[1]);
}