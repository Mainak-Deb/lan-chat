function http_server(app, port) {
  app.get("/home", (req, res) => {
    res.sendFile("view/index.html", { root: __dirname });
  });
}

module.exports = http_server;
