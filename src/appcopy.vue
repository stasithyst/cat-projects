<template>
  <section class="section-todo">
    <h1>TODO-list</h1>
    <div class="form-todo">
      <a-input type="text" class="todo-input" v-model:value="toDoNameInput" placeholder="input with clear icon" allow-clear/>
      <a-textarea type="text" class="todo-input" v-model:value="toDoDescriptionInput" allow-clear/>
      <div class="todo-button">
        <button
          @click="toDoItemAdd"
          :disabled="isDisabledButtonAdd"
          :class="{ disabled: isDisabledButtonAdd }"
        >
          Добавить
        </button>
        <button
          @click="resetForm"
          :disabled="isDisabledButtonReset"
          :class="{ disabled: isDisabledButtonReset }"
        >
          Очистить
        </button>
      </div>
      <div class="todo-list">
        <h2>Tasks in progress</h2>
        <div class="todo" v-for="item in progressList" :key="item.name">
          <input type="checkbox" v-model="item.isDone" class="todo-checkbox" />
          <!--          <button @click="deleteToDoItem(item)">Удалить</button>-->
          <div class="todo-name">
            {{ item.name }}
          </div>
          <div class="todo-description">
            {{ item.description }}
          </div>
        </div>
        <div class="todo-list">
          <h2>Done tasks</h2>
          <div class="todo" v-for="item in doneList" :key="item.name">
            <input type="checkbox" v-model="item.isDone" class="todo-checkbox" />
            <!--            <button @click="deleteToDoItem(item)">Удалить</button>-->
            <div class="todo-name">
              {{ item.name }}
            </div>
            <div class="todo-description">
              {{ item.description }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'

const toDoList = ref([
  {
    name: '12345',
    description: '742737',
    isDone: false,
  },
  {
    name: 'abc',
    description: '747',
    isDone: true,
  },
  {
    name: 'def',
    description: '737',
    isDone: true,
  },
])

const isDisabledButtonAdd = computed(
  () => toDoNameInput.value.length <= 2 || toDoDescriptionInput.value.length <= 2,
)
const toDoNameInput = ref<string>('')
const toDoDescriptionInput = ref<string>('')
const isDisabledButtonReset = ref(true)

const progressList = computed(() => toDoList.value.filter((item) => !item.isDone))
const doneList = computed(() => toDoList.value.filter((item) => item.isDone))

function toDoItemAdd() {
  toDoList.value.push({
    name: toDoNameInput.value,
    description: toDoDescriptionInput.value,
    isDone: false,
  })
  resetForm()

  console.log(toDoList)
}

function resetForm() {
  toDoNameInput.value = ''
  toDoDescriptionInput.value = ''
}

function observerInputs() {
  toDoNameInput.value.length !== 0 || toDoDescriptionInput.value.length !== 0
    ? (isDisabledButtonReset.value = false)
    : (isDisabledButtonReset.value = true)
}

// function deleteToDoItem(item) {
//   toDoList.value.filter()
// }
// watch(toDoNameInput, observerInputs)
// watch(toDoDescriptionInput, observerInputs)
watchEffect(observerInputs)
</script>

<style>
@import "assets/main.css";
</style>
