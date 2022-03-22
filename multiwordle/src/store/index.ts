import { reactive, readonly } from "vue";

const state = reactive({
  keyStatus: [],
  gameId: localStorage.getItem("gameId"),
  playerName: localStorage.getItem("playerName"),
  guesses: [],
  gameState: "",
  hintGiver: null,
  game: {},
  socket: null,
  players: [],
  playerScore: 0,
});

export default {
  state: state,
  actions: {
    setPlayerName(name) {
      state.playerName = name;
      localStorage.setItem("playerName", name);
    },
    setRoomId(roomId) {
      state.game.gameId = roomId;
      localStorage.setItem("gameId", roomId);
    },
    setSocket(socket) {
      state.socket = socket;
    },
    addPlayer(player) {
      state.game.players.push(player);
    },
    removePlayer(player) {
      state.game.players = state.game.players.filter(
        (p) => p.socketId !== player.socketId
      );
    },
    setGame(game) {
      state.game = game;
      state.keyStatus = game.keyStatus;
      state.gameId = game.gameId;
      localStorage.setItem("gameId", game.gameId);
      // state.playerName = game.playerName;
      state.guesses = game.guesses;
      state.keyStatus = game.keyStatus
      state.hintGiver = game.hintGiver;
      state.players = game.players;
      state.gameState = game.gameState;
    },
    setGuesses(guesses) {
      state.game.guesses.push(guesses);
    },
    setGuess(guessData) {
      if (state.guesses.length === 0) {
        console.log("guess set:", guessData)
        console.log("guesses:", state.game.guesses.value)
        const roundGuesses = { [guessData.sender]: guessData.guess };
        console.log("guess set:", roundGuesses)
        state.guesses.push(roundGuesses);
        console.log(state.guesses[state.guesses.length - 1])
      }
      // if (Object.keys(state.guesses[state.guesses.length - 1]).length == state.game.players.length - 1) {
      //   //evalGuessHiere
      //   console.log("All guesses Received")
      // } else {
        state.guesses[state.guesses.length - 1][guessData.sender] = guessData.guess;
      // }
    }
  }
};