const configuration = {
    iceServers: [
      {
        urls: "stun:stun.services.mozilla.com",
      },
      {
        urls: "stun:stun1.l.google.com:19302",
      },
    ],
  };

  var rtcPeerConnection ;

  function onICECandidateEvent(event) {
    if (event.candidate) {
      socket.emit("candidate", event.candidate, roomName);
    }
  }
  
  function ontrackEvent(event) {
    peerVideo.srcObject = event.streams[0];
    peerVideo.onloadedmetadata = () => {
      peerVideo.play();
    };
  }
  