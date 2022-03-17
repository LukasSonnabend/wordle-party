<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import Modal from "../components/meta/Modal.vue";
import { Ref, ref, onMounted} from "vue";
import { AdjustmentsIcon } from "@heroicons/vue/outline";
import store from "../store";
import io from "socket.io-client";

let socket = ref(null);
// created
onMounted(() => {
  socket.value = io("http://localhost:3030", {
    withCredentials: true,
  });
});

const showModal: Ref = ref(false);
const playerName: Ref = ref(store.state.playerName);
const roomId: Ref = ref(store.state.roomNumber);

//roomId.value = id;
//socket.value.emit("join_room", {id, name: store.state.playerName});

const toggleModal = () => {
  showModal.value = !showModal.value;
};

function setGameInfo(roomId: string, playerName: string) {
  // set game info
  fetch("http://localhost:3030/auth/enter_room", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      room: roomId,
      username: playerName,
    }),
  }).then(response => response.json()).then((res) => {
    // if (res.room_entered) {
      console.log(res.user.name)
      // TODO: Somethings fucked right here
      store.actions.setPlayerName(res.user.name);
      store.actions.setRoomId(res.room);
    // }
  });

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
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        :disabled="playerName === '' || roomId === null"
        @click="setGameInfo(roomId, playerName)"
      >
        Save
      </button>
    </template>
  </Modal>
</template>

<style></style>
