function websocket_server(io) {
  var onlineUsers = new Map();
  var userSocketMap=new Map();



  //io connection
  io.on("connection", function (socket) {

    //debug
    // console.log("Websocket Connected", socket.id);
    // console.log("room", io.sockets.adapter.rooms);

    //when a user entering the name
    socket.on("createRoom", (data) => {
    
      //creating a pair of evry possible connection in the room
      for (let i of onlineUsers.keys()) {
        socket.join(createPair(data.roomName, i));
      }

      //adding the user to all users chat list
      onlineUsers.set(data.roomName,0);
      console.log("get-check",onlineUsers.get(data.roomName));
      
      userSocketMap.set(socket.id, data.roomName);
      io.emit("onlineUsers", { onlineUsers: Object.fromEntries(onlineUsers) });

      //debug
      console.log(` ${data.roomName} is connected`);
      // console.log(onlineUsers);
      // console.log(userSocketMap)
      console.log( io.sockets.adapter.rooms);

    });

    //when a user closes the socket
    socket.on("disconnect", (reason) => {
      var user=userSocketMap.get(socket.id);
      console.log(`${user} disconnected for ${reason}`);//debug

      onlineUsers.delete(user);
      userSocketMap.delete(socket.id);

      console.log( io.sockets.adapter.rooms);
      io.emit("onlineUsers", { onlineUsers: Object.fromEntries(onlineUsers) });
  
    });

    //when a user clicks to chat
    socket.on("joinRoom", (data) => {
      socket.join(data.roomName);
      console.log( io.sockets.adapter.rooms);
    })
    socket.on("leaveRoom", (data) => {
      socket.leave(data.roomName);
    })
    
    socket.on("sendMessage", (data) => {
      console.log(data.roomName, data.message);
      
      io.to(data.roomName).emit("receiveMessage", data.message);
    })

  });

  function findRooms(rooms) {
    var availableRooms = [];
    for (element of rooms.values()) {
      availableRooms.push(element);
    }
    return availableRooms;
  }
  function createPair(room1, room2) {
    var pair = [room1, room2];
    pair.sort();
    return String(pair[0]) + ":" + String(pair[1]);
  }
}

module.exports = websocket_server;
