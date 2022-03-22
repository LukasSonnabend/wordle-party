<script setup lang="ts">
import {inject, computed} from "vue";
import Key from "./Key.vue";

const store = inject("store");

// computed property
const keyStatus = computed(() => {
  const statusObject = {};
  if (!store.state.game.guesses) {
    return {}
  }
  for (let guessRound of store.state.game.guesses) {
    for (let guesses of Object.keys(guessRound) ) {
      // guesser has evaluation: object and guess: string
      for (let i = 0 ; i < guessRound[guesses].guess.length || 0; i++) {
        statusObject[guessRound[guesses].guess[i]] = guessRound[guesses].evaluation[i];
      }
    }
  }
  return statusObject;
});


defineProps<{ class: string; status: number; letter: string }>();
// array with all letters us keyboard arragement
const letters = [
  "q",
  "w",
  "e",
  "r",
  "t",
  "z",
  "u",
  "i",
  "o",
  "p",
  "a",
  "s",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "y",
  "x",
  "c",
  "v",
  "b",
  "n",
  "m",
];
</script>

<template>
  <div class="keyboard w-screen max-w-sm mt-2 h-full">
    <div class="flex justify-end w-full gap-0.5 h-1/4 lg:gap-1">
      <Key
        v-for="letter in letters.slice(0, 10)"
        :letter="letter"
        :status="keyStatus[letter] || 0"
        @click="$emit('letterEvent', letter)"
        :key="letter"
      />
    </div>
    <div
      className="flex justify-end w-full my-2 h-1/4 gap-0.5 lg:gap-1 basis-auto"
    >
      <span className="half-key" />
      <Key
        v-for="letter in letters.slice(10, 19)"
        :letter="letter"
        :status="keyStatus[letter] || 0"
        @click="$emit('letterEvent', letter)"
        :key="letter"
      />
      <span className="half-key" />
    </div>
    <div className="flex justify-center w-full gap-0.5 lg:gap-1 h-1/4">
      <Key letter="ENTER" @click="$emit('sendGuess')" />
      <Key
        v-for="letter in letters.slice(19, 30)"
        :letter="letter"
        :status="keyStatus[letter] || 0"
        @click="$emit('letterEvent', letter)"
        :key="letter"
      />
      <Key
        letter="DELET"
        classPass="min-w-12"
        @click="$emit('letterEvent', 'DELET')"
      />
    </div>
  </div>
</template>
<style scoped>
.half-key {
  width: 10px;
}
.keyboard {
  height: 200px;
}
</style>
