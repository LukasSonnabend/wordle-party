<script setup lang="ts">
import {computed, ref} from "vue";
defineProps<{ status?: number, letter: string }>()

const keyClass = (status) => {
  if (status == 1) {
    return 'bg-slate-100 text-white'
  } else if (status == 2) {
    return 'bg-yellow-200 text-black'
  } else if (status == 3) {
    return 'bg-green-400 text-black'
  }
  return 'bg-slate-300 text-black'
}

</script>

<template>
<button :class="keyClass(status)" class="key cursor-pointer grow overflow-hidden text-center flex flex-col justify-center hover:bg-slate-200 rounded-md drop-shadow">
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