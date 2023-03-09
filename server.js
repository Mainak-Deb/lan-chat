// import the necessary modules
const express = require("express");
const socket = require("socket.io");
const websocket_server=require("./ws-server");
const http_server=require("./http-server");
const https = require("https");
const fs = require("fs");

const options = {
  key: fs.readFileSync("./config/cert.key"),
  cert: fs.readFileSync("./config/cert.crt"),
};

//global variables
const app = express();
const port = 3000;
var server =  https.createServer(options, app).listen(port, () => {
  console.log(`HTTPS server started on port `+port);
});
var io = socket(server,{
  cors: {
          origin: "https://localhost:3000",
          methods: ["GET", "POST"],
          credentials: true,
          transports: ['websocket', 'polling'],
  },
  allowEIO3: true
  });

//middlewares
app.use(express.static("view"));


//http server
http_server(app);


//websocket server
websocket_server(io);









