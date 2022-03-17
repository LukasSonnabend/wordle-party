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
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(helmet());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.json("hi");
});

io.on("connect", (socket) => {});

server.listen(3030, () => {
  console.log("Server started on port 3030");
});
