// import the necessary modules
const express = require("express");
const socket = require("socket.io");
const websocket_server=require("./ws-server");
const http_server=require("./http-server");


//global variables
const app = express();
const port = 3000;
var server = app.listen(port, () => {
  console.clear();
  console.log(`Example app listening on port ${port}`);
});
var io = socket(server);

//middlewares
app.use(express.static("view"));


//http server
http_server(app);


//websocket server
websocket_server(io);









