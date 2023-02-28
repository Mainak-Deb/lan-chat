let socket = io.connect();
var currentUser = "";
var currentRoom = "";

function makeOnline() {
  var name = document.getElementById("name").value;
  var namebox = document.getElementById("namebox");
  var chatbox = document.getElementById("chatbox");
  currentUser = name;

  console.log(`${name} is online`);
  socket.emit("createRoom", {
    roomName: name,
  });
  namebox.style.display = "none";
  chatbox.style.display = "block";
  document.getElementById("username").innerHTML = name;
}
socket.on("connection", (socket) => {
  console.log(`${socket} is connected`);
});

socket.on("onlineUsers", function (data) {
  var chatNames = MapToChats(data);
  console.log(chatNames);

  var allusers = ``;
  var names = document.getElementById("chatNames");
  for (let i of chatNames) {
    if (i[0] != currentUser) {
      if (i[1] == 0) {
        allusers += `<div class="names" onclick="joinRoom('${i[0]}')" ><div>${i[0]} </div>  </div>`;
      } else {
        allusers += `<div class="names" onclick="joinRoom('${i[0]}')" ><div>${i[0]} </div> <div class="bubble">10</div> </div>`;
      }
    }
  }
  names.innerHTML = allusers;
});

socket.on("receiveMessage",data=>{
    console.log(data);
})




function MapToChats(data) {
  var chatNames = [];
  for (let i of Object.keys(data.onlineUsers)) {
    if (i != currentUser) {
      chatNames.push([i, parseInt(data.onlineUsers[i])]);
    }
  }
  chatNames.sort(function (a, b) {
    return a[1] - b[1];
  });
  return chatNames;
}

function joinRoom(Rname) {
  socket.emit("leaveRoom", { roomName: currentRoom });
  currentRoom = createPair(Rname, currentUser);
  socket.emit("joinRoom", { roomName: currentRoom });
  document.getElementById("headname").innerHTML = Rname;

  //console.log("join room ", room); //debug
}

function createPair(room1, room2) {
  var pair = [room1, room2];
  pair.sort();
  return String(pair[0]) + ":" + String(pair[1]);
}


function sendMessage() {
    var msg=document.getElementById("msgField").value;
    console.log(msg);
    
    socket.emit("sendMessage", {roomName:currentRoom,message:msg});
}