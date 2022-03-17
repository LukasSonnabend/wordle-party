<template>
  <div>
    <!-- <canvas
      ref="game"
      width="640"
      height="480"
      style="border: 1px solid black"
    ></canvas>
    <p>
      <button v-on:click="move('right')">Right</button>
      <button v-on:click="move('left')">Left</button>
      <button v-on:click="move('up')">Up</button>
      <button v-on:click="move('down')">Down</button>
    </p>
    <p>
      <button v-on:click="joinRoom(0)">Room 0</button>
      <button v-on:click="joinRoom(1)">Room 1</button>
      <button v-on:click="joinRoom(2)">Room 2</button>
    </p> -->
    <div class="flex justify-center" v-for="row in [0,1,2,3,4, 5]">
      <CharBox v-for="field in [0,1,2,3,4]" :char="guess.length > field ? guess[field] : ''" />
    </div>
    <div>
      <div class="card">
        <ul>
          <li v-for="(player, index) in gameData.players">
            <p :class="player.name == store.state.playerName && 'font-bold'">{{ player.name }} {{ player.name == store.state.playerName ? '(You 😁)' : ''}}</p>
          </li>
        </ul>
      </div>
    </div>
    <div class="flex justify-center">
      <Keyboard @letter-event="(e) => setGuess(e)" @send-guess="sendGuess" />
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
import store from "../store";
import Keyboard from "./game/Keyboard.vue"
import CharBox from "./game/CharBox.vue"
export default {
  name: "BlockGame",
  components: {
    Keyboard,
    CharBox
  },
  data() {
    return {
      guess: "",
      gameData: {},
      roomNumber: 0,
      socket: {},
      context: {},
      position: {
        x: 0,
        y: 0,
      },
    };
  },
    inject: ['store'],
  created() {
    this.socket = io("http://localhost:3030", {
      withCredentials: true,
    });
    this.socket.on("connect", () => {
      console.log(this.socket.id);
      //https://www.youtube.com/watch?v=ZKEqqIO7n-k
    });
    this.socket.emit("join_room", {id: store.state.roomNumber, name: store.state.playerName});
  },
  mounted() {
    // this.context = this.$refs.game.getContext("2d");
    this.socket.on("game_update", (data) => {
      console.log(data)
      this.gameData = data;
      // if (this.gameData.players.sss.guesses.length > 0) {
      //   this.guess = this.gameData.players.sss.guesses[this.gameData.players.sss.guesses.length - 1];
      // }
    // console.log(data);
      // this.position = data;
      // this.context.clearRect(
      //   0,
      //   0,
      //   this.$refs.game.width,
      //   this.$refs.game.height
      // );
      // this.context.fillStyle = "#FFFFFF";
      // this.context.fillRect(0, 0, this.$refs.game.width, this.$refs.game.width);
      // this.context.fillStyle = "#000000";
      // this.context.fillRect(this.position.x, this.position.y, 20, 20);
    });
  },
  methods: {
    setGuess(letter) {
      console.log(letter)
      if (letter === 'DELET'){
        this.guess = this.guess.slice(0, -1);
      } else if (this.guess.length < 5) {
        this.guess += letter;
      }
      // this.socket.emit("letter_event", letter);
    },
    move(direction) {
      this.socket.emit("move", {
        room: store.state.roomNumber,
        direction: direction,
      });
    },
    sendGuess() {
      //TODO: show error while guess to short
      if (this.guess.length < 5) {
        return;
      }
      this.socket.emit("guess", {
        room: store.state.roomNumber,
        guess: this.guess
      });
    },
  },
};
</script>

<style scoped></style>
