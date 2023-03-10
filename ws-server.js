function websocket_server(io) {
  var onlineUsers = new Map();
  var userSocketMap = new Map();
  var socketMap = new Map();
  


  //io connection
  io.on("connection", function (socket) {
    //debug
    // console.log("Websocket Connected", socket.id);
    // console.log("room", io.sockets.adapter.rooms);

    //when a user entering the name
    socket.on("createRoom", (data) => {

      onlineUsers.set(data.roomName, data.publicKey);
      userSocketMap.set(socket.id, data.roomName);
      socketMap.set( data.roomName,socket.id);

      //console.log(onlineUsers);
      io.emit("onlineUsers", { onlineUsers: Object.fromEntries(onlineUsers) });

      //debug
      console.log(` ${data.roomName} is connected `);


      // console.log(onlineUsers);
      // console.log(userSocketMap)
      //console.log(io.sockets.adapter.rooms);
    });

    //when a user closes the socket
    socket.on("disconnect", (reason) => {
      var user = userSocketMap.get(socket.id);
      console.log(`${user} disconnected for ${reason}`); //debug

      onlineUsers.delete(user);
      socketMap.delete(user);
      userSocketMap.delete(socket.id);

      //console.log(io.sockets.adapter.rooms);
      io.emit("onlineUsers", { onlineUsers: Object.fromEntries(onlineUsers) });
    });

    socket.on("sendMessage", (data) => {
      console.log(data.roomName, data.message);
      var destinationSocket=socketMap.get(data.roomName);

      io.to(destinationSocket).emit("receiveMessage",{ sender:data.sender ,message:data.message});
    });

    socket.on("videoCall", (data) => {
      console.log(data.roomName, data.message);
      var destinationSocket=socketMap.get(data.roomName);

      io.to(destinationSocket).emit("videoCall",{ sender:data.sender ,message:data.message,offer:data.offer});
    });
    socket.on("decline", (data) => {
      var destinationSocket=socketMap.get(data.roomName);
      io.to(destinationSocket).emit("decline",{ sender:data.sender });
    });
    socket.on("answer", (data) => {
      var destinationSocket=socketMap.get(data.roomName);
      io.to(destinationSocket).emit("answer",data.answer);
    });
    
  socket.on("candidate", function (candidate, roomName) {
    console.log("On Candidate::", roomName);
    var destinationSocket=socketMap.get(roomName);
    io.to(destinationSocket).emit("candidate", candidate);
  });
  socket.on("leave", function (roomName) {
    console.log("On leave::", roomName);
    var destinationSocket=socketMap.get(roomName);
    io.to(destinationSocket).emit("leave");
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
    var pair = [room1, room2];
    pair.sort();
    return String(pair[0]) + ":" + String(pair[1]);
  }
}

module.exports = websocket_server;
