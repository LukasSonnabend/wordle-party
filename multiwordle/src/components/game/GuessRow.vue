<script setup lang="ts">
import { inject, computed } from "vue";
import CharBox from "./CharBox.vue";

defineProps<{ game?: object; guess: string }>();

// const guessedChars = computed(() => {
//   // const WORD_LENGTH = 5;
//   const statusArray = [];
//   if (store.state.game.guesses === undefined)
//     return []

//   for (let guessRound of store.state.game.guesses)
//     for (let guesses of Object.keys(guessRound).filter((key) => guessRound[key].hasOwnProperty("guess")) )
//       for (let i = 0 ; i < guessRound[guesses].guess.length; i++)
//         if (guessRound[guesses].evaluation[i] === 3)
//           statusArray.push(guessRound[guesses].guess[i])
//         else
//           statusArray.push(false)

//   return statusArray
// });

const store = inject("store");

</script>
<template>
  <div>
    <span v-if="game.word" class="flex justify-center gap-1" v-for="row in [0]">
      <CharBox
        v-for="field in game.word.title.length"
        :key="field-1"
        :lockChar="store.guessedChars.value[field-1] !== 0 ? store.guessedChars.value[field-1] : false"
        :char="guess.length > field-1 ? guess[field-1] : ''"
      />
    </span>
  </div>
</template>
<style scoped></style>
