<script setup lang="ts">
import { inject, computed } from "vue";
import CharBox from "./CharBox.vue";

defineProps<{ game?: object; guess: string }>();

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
