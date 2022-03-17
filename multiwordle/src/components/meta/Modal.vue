<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup

// new ref
// import { ref } from '@vue/composition-api'
import { Ref, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])
function toggleModal() {
  console.log("here")
  emit('update:modelValue', false)
}

// function toggleModal() {
//   console.log('toggleModal')
//   showModal.value = !showModal.value
//   Object.assign(showModal, { value: !showModal.value })
// }

</script>

<template>
  <div>
    <slot name="button"></slot>
    <div v-if="modelValue" class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
      <div class="relative w-auto my-6 mx-auto max-w-4xl">
        <!--content-->
        <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          <!--header-->
          <div class="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
            <h3 class="w-full text-3xl font-semibold text-gray-700">
              <slot name="title"></slot>
            </h3>
            <button class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none" v-on:click="toggleModal()">
              <span class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                ×
              </span>
            </button>
          </div>
          <!--body-->
          <div class="relative p-6 flex-auto">
            <p class="my-4 text-blueGray-500 text-lg leading-relaxed">
              <slot name="body"></slot>
            </p>
          </div>
          <!--footer-->
          <div class="flex items-center justify-between p-6 border-t border-solid border-blueGray-200 rounded-b">
            <slot name="buttons" :modalOpen="'bar'"></slot>
            <!-- <button class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" v-on:click="toggleModal()">
              Close
            </button>
            <button class="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" v-on:click="toggleModal()">
              Save Changes
            </button> -->
          </div>
        </div>
      </div>
    </div>
    <div v-if="modelValue" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
  </div>
</template>

<style>

</style>
