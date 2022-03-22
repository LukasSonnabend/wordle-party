<script setup lang="ts">
defineProps<{ char?: string, lockChar?: string, status?: number}>()
const boxStatusClass = () => {
  if (lockChar !== false)
    return "bg-green-400 text-black";
  else
    return ""
}
</script>

<template>
  <div :class="lockChar != '' ? 'border-gray-800' : 'border-indigo-500'" class="select-none table h-16 w-16 lg:h-18 lg:w-18 border-2 rounded-lg">
    <div :class="lockChar !='' && 'bg-green-400 text-black'" class="text-5xl text-slate-500 text-center table-cell align-middle">
      {{ lockChar != '' ? lockChar : char }}
    </div>
  </div>
</template>
<style scoped>
.key {
  width: 58px!important;
}
</style>