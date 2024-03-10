const express = require("express");
const path = require("path");
const fs = require("fs");
const Client = require("ssh2").Client;

const app = express();
const sshClient = new Client();
const PORT = 4000;

app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));
const privateKeyPath = path.join(__dirname, "id_rsa.pub");

app.get("/terminal", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/", (req, res) => {
  res.send("hello from server");
});

const connectionParams = {
  host: "localhost",
  username: "karnativr",
  port: "2200",
  password: "karnativr",
  privateKeyPath: fs.readFileSync(privateKeyPath),
};
const server = app.listen(PORT, () => {
  console.log("server is running");
  sshClient.connect(connectionParams);
});
sshClient.on("ready", () => {
  console.log("connected via SSH");
  sshClient.exec("ls", (err, stream) => {
    if (err) console.log(err);
    stream
      .on("close", (code, signal) => {
        console.log("connection closed");
      })
      .on("data", (data) => {
        console.log(data.toString());
      })
      .stderr.on("data", (data) => {
        console.log(data.toString());
      });
  });
});
const io = require("socket.io")(server, {
  cors: {
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);
  console.log("socket is connected");
});
