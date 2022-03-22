<template>
  <div>
    <div v-if="store.state.game.gameState == 'waiting'">
      <div class="row">
        <div class="col-md-12">
          <h1>Multiwordle</h1>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <h2>Waiting for players</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <h3>{{ store.state.game.players.length }} players joined</h3>
        </div>
        <li v-for="(player, index) in store.state.game.players">
          <p
            :class="player.playerName == store.state.playerName && 'font-bold'"
          >
            {{ index === 0 ? "🔰" : "" }} {{ player.playerName }}
            {{ player.playerName == store.state.playerName ? "(You 😁)" : "" }}
          </p>
        </li>
      </div>
      <div class="row">
        <div class="col-md-12">
          <button
            v-if="gameHost"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            v-on:click="startGame()"
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
    <div v-else class="grid grid-cols-1 grid-rows-3 h-screen">
     <div>
      <div v-if="gameHost">
        {{
          store.state.game.guesses && JSON.stringify(store.state.game.guesses)
        }}
      <h3>Ratewort: <b>{{ store.state.game.word.title }}</b></h3>
        {{ store.state.game.gameState }}
      </div>
        <GuessRow :game="store.state.game" :guess="guess" />
      </div>
      <div>
        <div class="card grow">
          <ul v-if="store.state.game">
            <li v-for="(player, index) in store.state.game.players">
              <p
                :class="
                  player.playerName == store.state.playerName && 'font-bold'
                "
              >
                {{ index === 0 ? "🔰" : "" }} {{ player.playerName }}
                {{
                  player.playerName == store.state.playerName ? "(You 😁)" : ""
                }}
              </p>
            </li>
          </ul>
        </div>
      </div>
      <div class="flex justify-center">
        <Keyboard @letter-event="(e) => setGuess(e)" @send-guess="sendGuess" />
      </div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
import store from "../store";
import Keyboard from "./game/Keyboard.vue";
import GuessRow from "./game/GuessRow.vue";
import validateGuess from "./functions.ts";
export default {
  name: "BlockGame",
  components: {
    Keyboard,
    GuessRow,
  },
  data() {
    return {
      guess: "",
      guessLocked: false,
      // players: [],
      // gameData: {},
      connectedSocketId: null,
      roomNumber: 0,
      socket: {},
      context: {},
      // position: {
      //   x: 0,
      //   y: 0,
      // },
    };
  },
  inject: ["store"],
  computed: {
    currentGame() {
      return this.store.state.game;
    },
    gameHost() {
      if (!store.state.game.players) return false;
      return store.state.game.players[0].playerName == store.state.playerName;
    },
    allGuesses() {
      if (!store.state.guesses.length > 0) return false;
      return (
        Object.keys(store.state.game.guesses[store.state.guesses.length - 1])
          .length ==
        store.state.game.players.length - 1
      );
    },
  },
  created() {
    this.socket = io("http://ubuntu:3031", {
      withCredentials: true,
    });
    store.actions.setSocket(this.socket);

    this.socket.on("connect", () => {
      this.connectedSocketId = this.socket.id;
      //https://www.youtube.com/watch?v=ZKEqqIO7n-k
    });
  },
  watch: {
    allGuesses(inc) {
      if (inc) {
        console.log(inc);
        this.evaluateGuesses(store.state.game.guesses);
      }
    },
  },
  mounted() {
    this.socket.on("connected", (data) => {
      console.log(data);
      store.actions.setRoomId(data.gameId);
    });

    this.socket.on("newGameCreated", (data) => {
      console.log(data);
      store.actions.setGame(data);
      // this.gameData = data;
    });

    this.socket.on("playerLeft", (data) => {
      console.log("PlayerLeft: ", data);
      if (this.gameHost) {
        store.actions.removePlayer(data);
        this.socket.emit("hostUpdate", {
          gameId: store.state.game.gameId,
          game: store.state.game,
        });
      }
    });

    this.socket.on("playerJoinedRoom", (data) => {
      // console.log(store.state.game.players[0].playerName == store.state.playerName)
      if (this.gameHost) {
        store.actions.addPlayer(data);
        console.log("host Update");
        // this is the host update all connected players
        this.socket.emit("hostUpdate", {
          gameId: store.state.game.gameId,
          game: store.state.game,
        });
      }
    });

    this.socket.on("gameUpdate", (data) => {
      console.log("receiving update");
      console.log(data);
      store.actions.setGame(data.game);
    });

    this.socket.on("guess2Host", (data) => {
      if (this.gameHost) {
        console.log("playerAnswer", data);
        store.actions.setGuess(data);
      }
    });

    this.socket.on("playerAnswer", (data) => {});
  },
  methods: {
    evaluateGuesses() {
      if (!this.gameHost) return;
      const guessesObject =
        store.state.game.guesses[store.state.guesses.length - 1];
      Object.keys(guessesObject).forEach((guess) => {
        const ans = validateGuess(
          store.state.game.guesses[store.state.game.guesses.length - 1][guess],
          1,
          store.state.game.word.title
        );

        //updateGuess Evaludation Data for each client and send out to room
        console.log(ans);
        store.state.game.roundWon = ans.roundWon;
        guessesObject[guess] = { guess: guessesObject[guess], evaluation: ans.validation };
        this.socket.emit("hostUpdate", {
          gameId: store.state.game.gameId,
          game: store.state.game,
        });
      });

      store.actions.setGuesses(guessesObject);
      //emit update
      console.log(store.state.game.guesses);
      // this.socket.emit("guessEvaluation", {
      //   gameId: store.state.game.gameId,
      //   game: store.state.game,
      // });
    },
    startGame() {
      console.log("hostStartGame");
      store.state.game.gameState = "inProgress";
      this.socket.emit("hostStartGame", {
        gameId: store.state.game.gameId,
        game: store.state.game,
      });
      // this.socket.emit("hostUpdate", {
      //   gameId: store.state.game.gameId,
      //   game: store.state.game,
      // });
    },
    setGuess(letter) {
      if (letter === "DELET") {
        this.guess = this.guess.slice(0, -1);
      } else if (this.guess.length < store.state.game.word.title.length) {
        // skip feste letters
        this.guess += letter;
      }
    },
    move(direction) {
      this.socket.emit("move", {
        room: store.state.roomNumber,
        direction: direction,
      });
    },
    onDestroy() {
      this.socket.emit("disconnect", {
        room: store.state.roomNumber,
        playerName: store.state.playerName,
      });
    },
    sendGuess() {
      //TODO: show error while guess to short
      if (this.guess.length < store.state.game.word.title.length && this.guessLocked) {
        return;
      }
      this.guessLocked = true;

      this.socket.emit("playerAnswer", {
        playerName: store.state.playerName,
        gameId: store.state.game.gameId,
        game: store.state.game,
        guess: this.guess,
      });
    },
  },
};
</script>

<style scoped></style>
