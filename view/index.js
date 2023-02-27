let socket = io.connect();
var currentUser = "";

function makeOnline() {
    var name = document.getElementById("name").value;
    var namebox = document.getElementById("namebox");
    var chatbox = document.getElementById("chatbox");
    currentUser = name

    console.log(`${name} is online`);
    socket.emit("createRoom", {
        roomName: name,
    });
    namebox.style.display = "none";
    chatbox.style.display = "block";
}

socket.on("onlineUsers", function (data) {
    console.log(data.onlineUsers);
    var allusers = ``;
    var names = document.getElementById("chatNames");
    for (var i = 0; i < data.onlineUsers.length; i++) {
        if (data.onlineUsers[i] != currentUser) {
            allusers += `<div class="names"><span>${data.onlineUsers[i]} </span></div>`;
        }


    }
    names.innerHTML = allusers;


});
