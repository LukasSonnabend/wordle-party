const express = require("express");
const { Server } = require("socket.io");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(express.urlencoded())
const helmet = require("helmet");
const server = require("http").createServer(app);
const cors = require("cors");
const authRouter = require("./routers/authRouter");
const io = new Server(server, {
  cors: {
    origin: "http://ubuntu:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const mwGame = require("./mwgame");

app.use(helmet());
app.use(cors({
  origin: "http://ubuntu:3000",
  credentials: true,
}));

app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.json("hi");
});

// build crazy dict with all words



io.sockets.on('connection', socket => {
  console.log('client connected: ', socket.id);
  mwGame.initGame(io, socket);
});

server.listen(3031, () => {
  console.log("Server started on port 3031");
});
