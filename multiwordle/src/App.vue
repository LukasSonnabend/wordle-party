<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import WelcomeScreen from "./components/WelcomeScreen.vue";
import Gametest from "./components/Gametest.vue";
import GameConnection from "./components/GameConnection.vue";
import MainBar from "./components/meta/MainBar.vue";
</script>

<template>
  <div class="flex flex-col items-center min-h-full overflow-y-hidden absolute inset-0">
    <MainBar />
    <Gametest class="flex-grow"/>
  </div>
</template>

<style>
@font-face {
  font-family: 'Merriweather';
  src: url("./Merriweather-Bold.ttf");
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100vh;
}

html,
body {
  height: 100vh;
  background-color: var(--color-background);
  margin: 0;
  padding: 0;
  overflow-y: scroll;
}
</style>
