<script setup lang="ts">
import { defineProps } from "vue";

defineProps<{ classPass?: string, status?: number, letter: string }>()

</script>

<template>
<button class="key cursor-pointer grow overflow-hidden text-center flex flex-col justify-center bg-slate-300 hover:bg-slate-200 text-black rounded-md">
  <span>
    {{ letter }}
</span>
  </button>
</template>
<style scoped>
.key {
  width: 58px!important;
}
</style>