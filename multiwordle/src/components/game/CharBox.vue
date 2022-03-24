<script setup lang="ts">
defineProps<{ char?: string, lockChar?: string | boolean, status?: number}>()
const boxStatusClass = (lockChar) => {
  if (lockChar !== 0)
    return "bg-green-400 text-black";
  else
    return "text-slate-500"
}
</script>

<template>
  <div :class="lockChar != '' ? 'border-gray-800' : 'border-indigo-500'" class="select-none table h-16 w-16 lg:h-18 lg:w-18 border-2 rounded-lg">
    <div :class="boxStatusClass(lockChar)" class="font-merriweather uppercase text-5xl text-center table-cell align-middle">
      {{ lockChar !== 0 ? lockChar : char }}
    </div>
  </div>
</template>
<style scoped>
.key {
  width: 58px!important;
}
.font-merriweather {
  font-family: 'Merriweather', serif;
  font-weight: bold;
}
</style>