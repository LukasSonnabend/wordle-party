const Express = require("express")();
const Http = require("http").Server(Express);
const cors = require("cors");

const channels = [];

const Socketio = require("socket.io")(Http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

let gameArchive = {};
// TODO: Wie Game saven am besten players als Object mit keys sind namen ids egal?


var position = {
  x: 200,
  y: 200,
};

Http.listen(3030, () => {
  console.log("Listening at :3030...");
});

// joining leaving
// https://www.semicolonworld.com/question/47305/socket-io-how-to-correctly-join-and-leave-rooms

Socketio.on("connection", (socket) => {
  socket.emit("position", position);

  socket.on("join_room", (room) => {
    // hier player muss sich neu "registrieren" im game ggf. wird alter Stand geladen
    console.log("joined room " + room.id);
    socket.join(room.id);

    if (gameArchive.hasOwnProperty(room.id)) {
      if (
        !gameArchive[room.id].players.find(
          (player) => player.id === socket.id || player.name === room.name
        )
      )
        gameArchive[room.id].players.push({ id: socket.id, name: room.name, guesses: [] });

      // check if there is already a player with same socket id
      // if not, add it to the players array
    } else
      gameArchive[room.id] = {
        room: room.id,
        roundActive: true,
        players: [{ id: socket.id, name: room.name, guesses: [] }],
      };
    console.log(room.id);

    Socketio.in(room.id).emit("game_update", gameArchive[room.id]);
  });

  socket.on("message", ({ room, message }) => {
    console.log(room);
    console.log(message);
    if (room) Socketio.to(room).emit("position", message);
    else Socketio.emit("position", message);
  });

  socket.on("guess", ({ room, guess }) => {
    console.log("guessing");
    console.log(gameArchive[room])
    if (gameArchive[room]) {
    // add guess to player guess array
      gameArchive[room].players.find((player) => player.id === socket.id).guesses.push(guess);
      if (room) Socketio.in(room).emit("game_update", gameArchive[room]);
      else Socketio.emit("position", gameArchive[room]);
    }
  });

  socket.on("move", (data) => {
    console.log(data.room + "<-" + data.direction);
    switch (data.direction) {
      case "left":
        position.x -= 5;
        Socketio.in(data.room).emit("position", position);
        // console.log("updating", gameArchive[data.room]);
        Socketio.in(data.room).emit("game_update", gameArchive[data.room]);
        break;
      case "right":
        position.x += 5;
        Socketio.in(data.room).emit("position", position);
        break;
      case "up":
        position.y -= 5;
        Socketio.in(data.room).emit("position", position);
        break;
      case "down":
        position.y += 5;
        Socketio.in(data.room).emit("position", position);
        break;
    }
  });

  // leave

  socket.on("disconnecting", () => {
    //console.log("room", [...socket.rooms][1]);
     // remove player from players array ! aber persist til end of round?
    const room = [...socket.rooms][1];
    if (room) {
      console.log("leaving room " + room);
      socket.leave(room);
      gameArchive[room].players = gameArchive[room].players.filter(
        (player) => player.id !== socket.id
      );
      Socketio.in(room).emit("game_update", gameArchive[room]);
    }
  });

  socket.on("disconnect", () => {
    // update room
  });
});
