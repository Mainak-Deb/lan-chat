let socket = io.connect();
var currentUser = "";
var currentRoom = "";

var keyPairs;
var entryTime;
var chatHistory = new Chats();

var chatTimes = new Map();
var chatCounts = new Map();


empty();

function makeOnline() {
  var name = document.getElementById("name").value;
  var namebox = document.getElementById("namebox");
  var chatbox = document.getElementById("chatbox");
  currentUser = name;

  console.log(`${name} is online`);
  socket.emit("createRoom", {
    roomName: name,
    publicKey: publicKey,
  });
  namebox.style.display = "none";
  chatbox.style.display = "block";
  document.getElementById("username").innerHTML = name;
}
socket.on("connection", (socket) => {
  console.log(`${socket} is connected`);
});

socket.on("onlineUsers", function (data) {
  console.log(data.onlineUsers)
  keyPairs = data.onlineUsers;

  var chatNames = MapToChats(data);
  makeChatNames(chatNames)
  reloadNameBox()

  if (chatNames.length == 0) {
    empty();
  }
  console.log(chatNames);

 
});

socket.on("receiveMessage", (data) => {
  //console.log(data);
  newMessege = decryptRSA(privateKey, data.message);
  //alert(data.sender+" : "+data.message);
  chatHistory.insert(data.sender, newMessege, false);

  //console.log(data.sender+" received")
  if(data.sender != currentRoom) {
    //console.log(data.sender+" updated")
    chatCounts.set(data.sender, chatCounts.get(data.sender) + 1);
  }

  

  const d=new Date();
  chatTimes.set(data.sender,d.getTime());
  reloadNameBox()

  reloadChatSection();
});

function MapToChats(data) {
  var chatNames = [];
  for (let i of Object.keys(data.onlineUsers)) {
    if (i != currentUser) {
      chatNames.push(i);
    }
  }

  return chatNames;
}

function joinRoom(Rname) {
  document.getElementById("headname").innerHTML = Rname;
  document.getElementById("msgField").value = "";
  Notempty();
  currentRoom = Rname;
  chatCounts.set(currentRoom, 0);
  reloadNameBox()
  reloadChatSection();
}

function createPair(room1, room2) {
  var pair = [room1, room2];
  pair.sort();
  return String(pair[0]) + ":" + String(pair[1]);
}

function sendMessage() {
  var msg = document.getElementById("msgField").value;
  console.log(msg);
  publicKeyOfUser = keyPairs[currentRoom];
  //console.log("userkey",publicKeyOfUser)

  const encryptedMessage = encryptRSA(publicKeyOfUser, msg);
  socket.emit("sendMessage", {
    sender: currentUser,
    roomName: currentRoom,
    message: encryptedMessage,
  });
  chatHistory.insert(currentRoom, msg, true);

  const d=new Date();
  chatTimes.set(currentRoom,d.getTime());
  reloadNameBox()

  reloadChatSection();

  document.getElementById("msgField").value = "";
}

function empty() {
  document.getElementById("messegeBox").style.display = "none";
}

function Notempty() {
  document.getElementById("messegeBox").style.display = "block";
}

async function reloadChatSection() {
  document.getElementById("msgCenter").innerHTML =
    chatHistory.render(currentRoom);
}

var input = document.getElementById("msgField");
input.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
});



function makeChatNames(namelist){
    const d = new Date();

    for(var i of namelist){
      if(!chatTimes.has(i)){
        chatTimes.set(i,d.getTime());
      }
      chatCounts.set(i,0)
    }
    for(var i of chatTimes.keys()){
      if (! namelist.includes(i)){
        chatTimes.delete(i)
        console.log(i,i in namelist);
      }
    }

}

async function reloadNameBox() {

  //console.log(chatCounts);

  var chatNames = [];
  for (let i of chatTimes.keys()) {
    if (i != currentUser) {
      chatNames.push([i, parseInt(chatCounts.get(i)),parseInt(chatTimes.get(i))]);
    }
  }
  chatNames.sort(function (a, b) {
    return b[2] - a[2];
  });

  console.log(chatNames);
  

  var allusers = ``;
  var names = document.getElementById("chatNames");
  for (let i of chatNames) {
    if (i[0] != currentUser) {
      if (i[1] == 0) {
        allusers += `<div class="names" onclick="joinRoom('${i[0]}')" ><div>${i[0]} </div>  </div>`;
      } else {
        allusers += `<div class="names" onclick="joinRoom('${i[0]}')" ><div>${i[0]} </div> <div class="bubble">${i[1]}</div> </div>`;
      }
    }
  }
  names.innerHTML = allusers;
}
