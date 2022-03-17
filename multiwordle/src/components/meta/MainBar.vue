<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { Ref, ref, inject } from "vue";
import GameConnection from "../GameConnection.vue";
const showMenu = ref(false);
const store = inject("store");

function toggleNavbar() {
  showMenu.value = !showMenu.value;
}
</script>

<template>
  <nav class="relative flex flex-wrap items-center justify-between px-2 py-3 bg-gray-800 mb-3">
    <div class="container px-4 mx-auto flex flex-wrap items-center justify-between">
      <div class="w-full relative flex flex-wrap justify-between  md:px-4 text-white">
      <!-- <div class="w-full relative flex justify-between lg:w-auto  px-4 lg:static lg:block lg:justify-start text-white"> -->
        <!-- <a class="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white" href="#pablo">
          MultiWordle
        </a> -->
        <div>
        <b>
          PlayerName: {{ store.state.playerName }}
        </b>
        </div>
         <div>
        <b>
          RoomId: {{ store.state.roomNumber }}
        </b>
        </div>
        <GameConnection />
      </div>
      <!-- <div v-bind:class="{'hidden': !showMenu, 'flex': showMenu}" class="lg:flex lg:flex-grow items-center">
        <ul class="flex flex-col lg:flex-row list-none ml-auto">
          <li class="nav-item">
            <a class="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75" href="#pablo">
              <i class="fab fa-facebook-square text-lg leading-lg text-white opacity-75" /><span class="ml-2">Share</span>
            </a>
          </li>
          <li class="nav-item">
            <a class="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75" href="#pablo">
              <i class="fab fa-twitter text-lg leading-lg text-white opacity-75" /><span class="ml-2">Tweet</span>
            </a>
          </li>
          <li class="nav-item">
            <a class="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75" href="#pablo">
              <i class="fab fa-pinterest text-lg leading-lg text-white opacity-75" /><span class="ml-2">Pin</span>
            </a>
          </li>
        </ul>
      </div> -->
    </div>
  </nav>
</template>