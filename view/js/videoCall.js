let video = document.querySelector("#myVideo");
let peerVideo = document.getElementById("peerVideo");
let chatDisplay = document.querySelector("#chatdisplay");
let videoDisplay = document.querySelector("#videoDisplay");
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];

var offer = "";
let callerName = "";
let videoOn = true;
let audioOn = true;
let stream = null;
let constraints = {
    audio: audioOn,
    video: videoOn
};
  

async function startVideo() {
  await navigator.mediaDevices
    .getUserMedia(constraints)
    .then((mediaStream) => {
      stream = mediaStream;
      video.srcObject = mediaStream;
      video.onloadedmetadata = () => {
        console.log("started video")
        video.play();
      };
    })
    .catch((err) => {
      console.error(`${err.name}: ${err.message}`);
    });
}

async function videoOff() {
  console.log("video triggered", videoOn);

  if (!videoOn) {
    videoOn = true;
    stream.getTracks()[1].enabled =true;
    document.getElementById(
      "offVideo"
    ).innerHTML = `<span class="material-symbols-outlined ">videocam_off  </span>`;
  } else {
    videoOn = false;
    stream.getTracks()[1].enabled =false;
    document.getElementById(
      "offVideo"
    ).innerHTML = `<span class="material-symbols-outlined "> videocam </span>`;
  }
}
async function micOff() {
  console.log("mic triggered",audioOn);
  if (audioOn) {
    audioOn = false;
    stream.getTracks()[0].enabled =false;
    document.getElementById(
      "offMic"
    ).innerHTML = `<span class="material-symbols-outlined "> mic  </span>`;
  } else {
    audioOn = true;
    stream.getTracks()[0].enabled =true;
    document.getElementById(
      "offMic"
    ).innerHTML = `<span class="material-symbols-outlined "> mic_off</span>`;
  }
}
function cutCall() {
    socket.emit("leave", currentRoom);
    videoDisplay.style.display = "none";
    chatDisplay.style.display = "flex";
    callerName="";
    offer=""

  if (video.srcObject) {
    video.srcObject.getTracks()[0].stop();
    video.srcObject.getTracks()[1].stop();
  }

  if (peerVideo.srcObject) {
    peerVideo.srcObject.getTracks()[0].stop();
    peerVideo.srcObject.getTracks()[1].stop();
  }
  if (rtcPeerConnection) {
    rtcPeerConnection.ontrack = null;
    rtcPeerConnection.onicecandidate = null;
    rtcPeerConnection.close();
    rtcPeerConnection = null;
  }
  
}
//sender end call functions
async function startCall() {
  videoDisplay.style.display = "flex";
  chatDisplay.style.display = "none";
  await startVideo()
  rtcPeerConnection = new RTCPeerConnection(configuration);
  rtcPeerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("candidate", event.candidate, currentRoom);
    }
  };
  rtcPeerConnection.ontrack = ontrackEvent;
  console.log(stream.getTracks());
  rtcPeerConnection.addTrack(stream.getTracks()[0], stream);
  rtcPeerConnection.addTrack(stream.getTracks()[1], stream);
  rtcPeerConnection
    .createOffer()
    .then((offer) => {
      rtcPeerConnection.setLocalDescription(offer);
      console.log("my offer", offer)
      socket.emit("videoCall", {
        sender: currentUser,
        roomName: currentRoom,
        message: "videoCall",
        offer: offer,
      });
    })
    .catch((error) => {
      console.log("Error while creating offer", error);
    });
}
//receiver end call functions
function ringCall(callerName) {
  console.log("ring call triggered");
  document.getElementById("caller-name").innerHTML = callerName;
  modal.style.display = "block";
}
async function acceptCall() {
  console.log("call accepted");
  currentRoom =callerName;
  joinRoom(callerName)
  console.log(offer)
  modal.style.display = "none";
  videoDisplay.style.display = "flex";
  chatDisplay.style.display = "none";
  await startVideo()
  rtcPeerConnection = new RTCPeerConnection(configuration);
  rtcPeerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("candidate", event.candidate, callerName);
    }
  };
  rtcPeerConnection.ontrack = ontrackEvent;
  rtcPeerConnection.addTrack(stream.getTracks()[0], stream);
  rtcPeerConnection.addTrack(stream.getTracks()[1], stream);
  rtcPeerConnection.setRemoteDescription(offer);
  rtcPeerConnection
    .createAnswer()
    .then((answer) => {
      rtcPeerConnection.setLocalDescription(answer);
      socket.emit("answer", { answer: answer, roomName: callerName });
    })
    .catch((error) => {
      console.log("Error while creating answer", error);
    });
}
function declineCall() {
  console.log("decline call triggered");
  modal.style.display = "none";
  socket.emit("decline", { roomName: callerName });
  callerName = "";
  offer = "";
}

//socket part
socket.on("videoCall", (data) => {
  callerName = data.sender;
  
  offer = data.offer;
  console.log("offer", offer);
  ringCall(data.sender);
});
socket.on("decline", (data) => {
  alert("call declined");
  video.srcObject.getTracks()[0].stop();
  video.srcObject.getTracks()[1].stop();
  videoDisplay.style.display = "none";
  chatDisplay.style.display = "flex";
});
socket.on("answer", function (answer) {
  console.log("I am in answer::", answer);
  rtcPeerConnection.setRemoteDescription(answer);
});
socket.on("candidate", function (candidate) {
  var iceCandidate = new RTCIceCandidate(candidate);
  rtcPeerConnection.addIceCandidate(iceCandidate);
});

socket.on("leave", function () {
    videoDisplay.style.display = "none";
    chatDisplay.style.display = "flex";
    callerName="";
    offer=""
    if (video.srcObject) {
        video.srcObject.getTracks()[0].stop();
        video.srcObject.getTracks()[1].stop();
      }
    
    if (peerVideo.srcObject) {
      peerVideo.srcObject.getTracks()[0].stop();
      peerVideo.srcObject.getTracks()[1].stop();
    }
  
    if (rtcPeerConnection) {
      rtcPeerConnection.ontrack = null;
      rtcPeerConnection.onicecandidate = null;
      rtcPeerConnection.close();
      rtcPeerConnection = null;
    }
   
  });