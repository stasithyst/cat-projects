<template>
  <div class="wrapper">
    <div class="sidebar">
      <a-form
        class="todo-form"
        :layout="formState.layout"
        :model="formState"
        v-bind="formItemLayout"
      >
        <h1>ToDo-list</h1>
        <a-form-item class="input-label" label="Название">
          <form-input v-model="formState.fieldA" />
        </a-form-item>
        <a-form-item class="input-label" label="Описание">
          <form-input v-model="formState.fieldB" />
        </a-form-item>

        <div class="todo-button-group">
          <a-form-item :wrapper-col="buttonItemLayout">
            <a-button
              type="primary"
              class="todo-item-button"
              @click="toDoItemAdd"
              :disabled="isDisabledButtonAdd"
              :class="{ disabled: isDisabledButtonAdd }"
            >
              Добавить
            </a-button>
          </a-form-item>
        </div>
      </a-form>
    </div>
  </div>
  <div class="todo-list">
    <div class="todo-list-progress">
      <h2>Tasks in progress</h2>
      <todo-cards
        :items="progressList"
        type="available"
        @drag-start="onDragStart"
        @drop-list="onDropList"
        @remove="deleteCard"
      />
    </div>
    <div class="todo-list-done">
      <h2>Done tasks</h2>
      <todo-cards
        :items="doneList"
        type="selected"
        @drag-start="onDragStart"
        @drop-list="onDropList"
        @remove="deleteCard"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import type { UnwrapRef } from 'vue'
import FormInput from './components/FormInput.vue'
import TodoCards from './components/TodoCards.vue'

interface Todo {
  id: number
  name: string
  description: string
  isDone: boolean
}

const toDoList = ref<Todo[]>([])
const dragItem = ref<Todo | null>(null)

function onDragStart(item: Todo) {
  dragItem.value = item
}

function onDropList(targetList: 'available' | 'selected') {
  if (!dragItem.value) return

  const index = toDoList.value.findIndex((t) => t.id === dragItem.value!.id)
  if (index === -1) {
    dragItem.value = null
    return
  }

  toDoList[index].isDone = targetList === 'selected'

  dragItem.value = null
}

let todoId = 0
function toDoItemAdd() {
  if (formState.fieldA && formState.fieldB) {
    toDoList.value.push({
      id: todoId++,
      name: formState.fieldA,
      description: formState.fieldB,
      isDone: false,
    })
    formState.fieldA = ''
    formState.fieldB = ''
  }
}

const isDisabledButtonAdd = computed(
  () => formState.fieldA.length <= 2 || formState.fieldB.length <= 2,
)

const progressList = computed(() => toDoList.value.filter((item) => !item.isDone))
const doneList = computed(() => toDoList.value.filter((item) => item.isDone))

interface FormState {
  layout: 'horizontal'
  fieldA: string
  fieldB: string
}
const formState: UnwrapRef<FormState> = reactive({
  layout: 'horizontal',
  fieldA: '',
  fieldB: '',
})
const formItemLayout = computed(() => {
  const { layout } = formState
  return layout === 'horizontal'
    ? {
        labelCol: { span: 6 },
        wrapperCol: { span: 16, offset: 2 },
      }
    : {}
})
const buttonItemLayout = computed(() => {
  const { layout } = formState
  return layout === 'horizontal'
})

function deleteCard(id: number) {
  toDoList.value = toDoList.value.filter(item => item.id !== id)
}
</script>

<style>
* {
  font-family: 'Shantell Sans', cursive;
}

h1 {
  display: flex;
  justify-content: center;
  color: #da9d99;
  font-size: 40px;
}

h2 {
  color: #da9d99;
}

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 400px;
  height: 100%;
  background: #fff;
  border-right: 1px solid #eee;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  padding: 24px;
  display: flex;
  flex-direction: column;
  overflow: scroll;
}

.input-label .ant-form-item-label > label {
  display: flex;
  justify-content: start;
  font-size: 14px;
  font-weight: 700;
  color: #da9d99;
}

.todo-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-bottom: 16px;
}

.todo-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  justify-content: center;
  margin-left: 400px;
  padding: 40px;
}

.todo-list-progress ,
.todo-list-done {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.todo-button-group {
  display: flex;
  justify-content: flex-start;
  gap: 8px;
}

.todo-item-button {
  font-size: 14px;
  font-weight: 700;
  background-color: transparent;
  color: #da9d99;
  border: 3px solid #da9d99;
  cursor: pointer;
  border-radius: 10px;
  width: 100px;
  height: 40px;
  box-shadow: none;
}

.todo-item-button:not(:disabled):hover {
  background-color: transparent;
  color: #da9d99;
  border: none;
  box-shadow: 0 3px 0 #da9d99;
}

.todo-input {
  font-family: 'Shantell Sans', cursive;
  font-weight: 700;
  background-color: transparent;
  border: 3px solid #da9d99;
  height: 40px;
  color: #da9d99;
}

.todo-input:hover,
.todo-input:focus {
  background-color: transparent;
  color: #da9d99;
  border: none;
  box-shadow: 0 3px 0 #da9d99;
}

.todo-input::placeholder {
  color: rgba(218, 157, 153, 0.51);
}

.todo-item-button.disabled {
  cursor: default;
  opacity: 0.7;
}
</style>
