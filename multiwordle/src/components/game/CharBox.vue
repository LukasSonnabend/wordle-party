<script setup lang="ts">
import { defineProps } from "vue";

defineProps<{ char?: string, status?: number}>()
const boxStatusClass = (status: number) => {
  if (status === 1)
    return "bg-gray-400";
  else if (status === 2)
    return "bg-yellow-500";
  else if (status === 3)
    return "bg-green-500";
  else
    return "bg-black"
}
</script>

<template>
  <div class="select-none table h-16 w-16 lg:h-18 lg:w-18 border-2 border-indigo-500 rounded-lg">
    <div class="text-5xl text-slate-500 text-center table-cell align-middle">
      {{ char }}
    </div>
  </div>
</template>
<style scoped>
.key {
  width: 58px!important;
}
</style>