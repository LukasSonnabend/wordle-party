var io;
var gameSocket;
const {QueryNoco} = require('./graphql/GraphClient')

const gameObject = () => {
  return {
    gameId: "",
    players: [],
    gameState: "waiting",
    guesses: [],
    hintGiver: ''
  }
}

// const activeGames = {};

// inspo https://github.com/ericterpstra/anagrammatix/blob/master/agxgame.js
/**
 * This function is called by index.js to initialize a new game instance.
 *
 * @param sio The Socket.IO library
 * @param socket The socket object for the connected client.
 */
exports.initGame = function (sio, socket) {
  io = sio;
  gameSocket = socket;

  gameSocket.emit('connected', { message: "You are connected!", yourId: gameSocket.id });

  // Host Events
  gameSocket.on('hostCreateNewGame', hostCreateNewGame);
  gameSocket.on('hostUpdate', hostUpdate);
  gameSocket.on('hostStartGame', hostStartGame);
  gameSocket.on('hostGetNewWord', hostGetNewWord);
  // gameSocket.on('hostRoomFull', hostPrepareGame);
  // gameSocket.on('hostCountdownFinished', hostStartGame);
  // gameSocket.on('hostNextRound', hostNextRound);

  // Player Events
  gameSocket.on('playerJoinGame', playerJoinGame);
  gameSocket.on('playerAnswer', playerAnswer);
  // gameSocket.on('playerAnswer', playerAnswer);
  // gameSocket.on('playerRestart', playerRestart);

   gameSocket.on("disconnecting", () => {
    console.log(socket.rooms); // the Set contains at least the socket ID
    // loop over set
    for (const room of socket.rooms) {
      io.sockets.in(room).emit('playerLeft', { playerSocket: socket.id, mySocketId: this.id });
    }
  });

  gameSocket.on("disconnect", (data) => {
    io.sockets.in(data.room).emit('playerLeft', { playerSocket: socket.id });
  });
}

/**
 * The 'START' button was clicked and 'hostCreateNewGame' event occurred.
 *  * @param data Contains data entered via player's input - playerName and gameId.
 */
function hostCreateNewGame(data) {
  // Create a unique Socket.IO Room
  //console.log("DATA", data)
  if (io.sockets.adapter.rooms.get(data.gameId)) {
    console.log("Trying to create existing room")
    playerJoinGame(data);
    return
  }
  const newGame = createNewGame(data, data.gameId);
  console.log("Socket rooms: ", gameSocket.rooms)

  gameSocket.join(data.gameId);
  console.log("Socket rooms: ", gameSocket.rooms)
  // gameSocket.emit('newGameCreated', {...activeGames[data.gameId], mySocketId: this.id});
  console.log("Emitting New game to : ", data.gameId)
  // Nur host bekommt das objekt zurück
  io.sockets.in(data.playerId).emit('newGameCreated', { ...newGame, mySocketId: this.id });
  //gameSocket.emit('newGameCreated', { ...newGame, mySocketId: this.id });
};

function createNewGame(data, hostId) {
  const newGame = gameObject();
  //console.log("adding Player to game: ", data.playerName)
  newGame.players.push({ playerName: data.playerName, socketId: hostId })
  newGame.roomId = hostId;
  newGame.gameId = data.gameId;
  newGame.keyStatus = [];
  newGame.gameState = "waiting";
  // Join the Room and wait for the players
  return newGame
}

async function playerAnswer(data) {



  const clients = io.sockets.adapter.rooms.get(data.gameId);
  // const numClients = clients ? clients.size : 0

  io.sockets.in(data.game.mySocketId).emit('guess2Host', { sender: data.playerName, guess: data.guess });

  console.log("Sending: ", data.playerName, " guess: ", data.guess)
}

async function hostUpdate(data) {
  console.log("hostUpdate: ", data)
  //console.log(io.adapter.rooms)
  await io.in(data.gameId).emit('gameUpdate', { game: data.game });
}


/**
 * A player clicked the 'START GAME' button.
 * Attempt to connect them to the room that matches
 * the gameId entered by the player.
 * @param data Contains data entered via player's input - playerName and gameId.
 */
async function playerJoinGame(data) {
  ////console.log('Player ' + data.playerName + 'attempting to join game: ' + data.gameId );
  // TOOD: joinRoom sendet an leute im room aber nicht an joiner
  // A reference to the player's Socket.IO socket object
  var sock = gameSocket;
  console.log("Rooms: ", gameSocket.rooms)

  console.log("gameId:", data.gameId)
  var room = gameSocket.rooms.has(data.gameId);
  // If the room exists...
  if (room != undefined) {
    //console.log("room exists")
    // attach the socket id to the data object.
    data.mySocketId = sock.id;
    console.log(data.gameId)
    // Join the room
    console.log("Socket rooms: ", sock.rooms)

    let roomUsers = await io.in(data.gameId).fetchSockets()

    sock.join(data.gameId);



    console.log("roomUsers: ", roomUsers)
    console.log("Socket rooms: ", sock.rooms)
    console.log("joining room: ", data.gameId)
    io.in(data.gameId).emit('playerJoinedRoom', { playerName: data.playerName, playerSocket: data.socketId });

  } else {
    this.emit('error', { message: "This room does not exist." });
  }
}

// TODO: hostStartGame
async function hostStartGame(data) {

  const game = data.game
  game.gameState = "inProgress";
  // Emit an event notifying the clients that the game has started.
  const wordId = await QueryNoco()
  console.log("Query: ", wordId)
  game.word = wordId.QuestionsList[0];

  await io.sockets.in(game.gameId).emit('gameUpdate', { game: game });
}

async function hostGetNewWord(data) {
  const wordId = await QueryNoco()
  const incGame = data.game
  incGame.guesses = []
  incGame.word = wordId.QuestionsList[Math.round(Math.random() * wordId.QuestionsList.length)];
  console.log("Query: ", incGame.word)
  // erstmal random#
  // add new empty object to guesses
  await io.sockets.in(incGame.gameId).emit('gameUpdate', { game: incGame });
}

