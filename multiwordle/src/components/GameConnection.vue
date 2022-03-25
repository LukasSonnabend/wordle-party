<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import Modal from "../components/meta/Modal.vue";
import { Ref, ref, onMounted, inject, computed } from "vue";
import { AdjustmentsIcon } from "@heroicons/vue/outline";
// import store from "../store";
import { stringifyStyle } from "@vue/shared";

const store = inject("store");
// let socket = ref(null);
// created
// onMounted(() => {
//   socket.value = io("http://ubuntu:3031", {
//     withCredentials: true,
//   });
// });

const showModal: Ref = ref(false);
const playerName: Ref = ref(store.state.playerName);
const roomId: Ref = ref(store.state.roomNumber);

//roomId.value = id;
//socket.value.emit("join_room", {id, name: store.state.playerName});

const toggleModal = () => {
  showModal.value = !showModal.value;
};

//computed
const saveable = computed(() => {
  return (
    playerName.value != "" &&
    roomId.value != null &&
    playerName.value !== store.state.playerName
  );
});


function joinRoom(roomId: string, playerName: string) {
   // collect data to send to the server
    var data = {
        gameId: roomId,
        playerName: playerName,
        socketId: store.state.socket.id
    };

    // Send the gameId and playerName to the server
    store.state.socket.emit('playerJoinGame', data);
    // Set the appropriate properties for the current player.
    // state.actions.role = 'Player';
    store.actions.setPlayerName(data.playerName);
    store.actions.setRoomId(data.gameId);

    toggleModal();
}

function setGameInfo(roomId: string, playerName: string) {
  // set game info
      var data = {
        gameId: roomId,
        playerName: playerName,
        playerId: store.state.socket.id
    };

        // Send the gameId and playerName to the server
    console.log("setting game Info")
    store.state.socket.emit('hostCreateNewGame', data);
    store.actions.setPlayerName(data.playerName);
    store.actions.setRoomId(data.gameId);

    // Set the appropriate properties for the current player.
    // state.actions.role = 'Player';
    // store.actions.setPlayerName(data.playerName);

  // fetch("http://ubuntu:3031/auth/enter_room", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     room: roomId,
  //     username: playerName,
  //   }),
  // })
  //   .then((response) => response.json())
  //   .then((res) => {
  //     // if (res.room_entered) {
  //     console.log("PlayerName: ", res);
  //     // TODO: Somethings fucked right here
  //     if (res.room_entered) {
  //       store.actions.setPlayerName(res.user.name);
  //       store.actions.setRoomId(res.room);
  //     }
  //     // }
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });

  toggleModal();
}
</script>

<template>
  <Modal v-model="showModal">
    <template v-slot:button>
      <button
        class="rounded-full bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-2 md:px-6 py-2 md:py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        type="button"
        v-on:click="toggleModal()"
      >
        <AdjustmentsIcon class="w-5 md:w-6 h-5 md:h-6" />
      </button>
    </template>
    <template v-slot:title>
      <h2>Welcome to MultiWordle</h2>
      <h2>Enter Name & Room</h2>
    </template>
    <template v-slot:body>
      <!-- Two inputs for Name and RoomId with lables-->
      <div class="form-group flex">
        <!-- <input type="text" class="block form-control" id="name" v-model="name"> -->
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="username"
          >
            Name
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            v-model="playerName"
            type="text"
            placeholder="Username"
          />
        </div>
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="roomId"
          >
            Room ID
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="roomId"
            v-model="roomId"
            type="text"
            placeholder="Room ID"
          />
        </div>
      </div>
    </template>
    <template v-slot:buttons>
      <button
        class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        @click="toggleModal()"
      >
        Close
      </button>
      <span>
        <button
          class="bg-blue-500 hover:bg-blue-700 disabled:bg-slate-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          :disabled="!saveable"
          @click="setGameInfo(roomId, playerName)"
        >
          Create Room
        </button>
        <button
          class="ml-2 bg-blue-500 hover:bg-blue-700 disabled:bg-slate-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          :disabled="!saveable"
          @click="joinRoom(roomId, playerName)"
        >
          Join Room
        </button>
      </span>
    </template>
  </Modal>
</template>

<style></style>
