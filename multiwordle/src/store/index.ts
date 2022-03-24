import { reactive, computed, readonly } from "vue";

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

let guessedChars = computed(() => {
  // const WORD_LENGTH = 5;
  let statusArray = Array(state.game.word.length).fill(0);
  if (state.game.guesses === undefined)
    return []

  for (let guessRound of state.game.guesses)
    for (let guesses of Object.keys(guessRound).filter((key) => guessRound[key].hasOwnProperty("guess")) )
      for (let i = 0 ; i < guessRound[guesses].guess.length; i++)
        if (guessRound[guesses].evaluation[i] === 3)
          statusArray[i] = guessRound[guesses].guess[i]
        else
          statusArray[i] =(false)

  return statusArray
});


export default {
  state: state,
  guessedChars: guessedChars,
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
      // state.keyStatus = game.keyStatus;
      state.gameId = game.gameId;
      localStorage.setItem("gameId", game.gameId);
      // state.playerName = game.playerName;
      state.guesses = game.guesses;
      //state.keyStatus = game.keyStatus;
      state.hintGiver = game.hintGiver;
      state.players = game.players;
      state.gameState = game.gameState;
    },
    setGuesses() {
      state.game.keyStatus = guessedChars;
      //state.game.guesses.push(guesses);
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

        state.guesses[state.guesses.length - 1][guessData.sender] = { guess: guessData.guess, evaluation: guessData.evaluation };
        console.log("guess set:", state.guesses[state.guesses.length - 1]);
        this.setGuesses()
    }
  }
};