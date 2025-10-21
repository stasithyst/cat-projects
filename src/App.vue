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
        <a-form-item class="input-label" label="Name">
          <form-input v-model="formState.nameInput" placeholder="cool name"/>
        </a-form-item>
        <a-form-item class="input-label" label="Description">
          <form-input v-model="formState.descriptionInput" placeholder="cool description"/>
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
              Add
            </a-button>
          </a-form-item>
        </div>
        <input type="text" placeholder="search tasks" v-model="input" class="todo-search" />
        <ul class="todo-list-search">
          <li
            v-for="item in filteredList"
            :key="item.id"
            class="todo-list-item"
          >
            <input
              type="checkbox"
              class="todo-checkbox"
              v-model="item.isDone"
              @change="() => onDropList(item.isDone ? 'selected' : 'available')"
            />
            <div class="todo-name">{{ item.name }}</div>
            <div class="todo-description">{{ item.description }}</div>
            <button class="todo-delete-button" @click="deleteCard(item.id)">
              <img src="@/assets/icon.svg" alt="Удалить" class="icon" />
            </button>
          </li>
        </ul>
      </a-form>
    </div>
  </div>
  <div class="todo-list">
    <div class="todo-list-progress">
      <h2>Tasks in progress</h2>
      <todo-cards
        :items="filter.progressList"
        type="available"
        @drag-start="onDragStart"
        @drop-list="onDropList"
        @remove="deleteCard"
      />
    </div>
    <div class="todo-list-done">
      <h2>Done tasks</h2>
      <todo-cards
        :items="filter.doneList"
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

const toDoList = ref<Todo[]>([
  {
    id: 0,
    name: '12345',
    description: '742737',
    isDone: false,
  },
  {
    id: 1,
    name: 'abc',
    description: '747',
    isDone: false,
  },
  {
    id: 2,
    name: 'def',
    description: '737',
    isDone: false,
  },
])

const filter = computed(() => ({
  progressList: toDoList.value.filter(t => !t.isDone),
  doneList: toDoList.value.filter(t => t.isDone),
}))

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

  toDoList.value[index].isDone = targetList === 'selected'

  dragItem.value = null
}

let todoId = toDoList.value.length + 1
function toDoItemAdd() {
  if (formState.nameInput && formState.descriptionInput) {
    toDoList.value.push({
      id: todoId++,
      name: formState.nameInput,
      description: formState.descriptionInput,
      isDone: false,
    })
    formState.nameInput = ''
    formState.descriptionInput = ''
  }
}

const isDisabledButtonAdd = computed(
  () => formState.nameInput.length <= 2 || formState.descriptionInput.length <= 2,
)

const input = ref("");
const filteredList = computed(() => {
  const search = input.value.toLowerCase().trim()
  if (!search) return []
  return toDoList.value.filter(t => t.name.toLowerCase().includes(search) || t.description.toLowerCase().includes(search)
  )
})

interface FormState {
  layout: 'horizontal'
  nameInput: string
  descriptionInput: string
}

const formState: UnwrapRef<FormState> = reactive({
  layout: 'horizontal',
  nameInput: '',
  descriptionInput: '',
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

.todo-search {
  font-family: "Shantell Sans", cursive;
  font-weight: 700;
  background-color: transparent;
  border: 3px solid #DA9D99;
  border-radius: 6px;
  width: 260px;
  height: 30px;
  color: #DA9D99;
  transition: all 0.2s;
  margin-bottom: 16px;
  padding: 4px 11px;
}

.todo-search:hover, .todo-search:focus {
  background-color: transparent;
  color: #DA9D99;
  border: none;
  box-shadow: 0 3px 0 #DA9D99;
  outline: none;
}

.todo-search::placeholder {
  color: rgba(218, 157, 153, 0.51);
}

.todo-delete-button {
  background: transparent;
  border: none;
  cursor: pointer;
}

.todo-name,
.todo-description {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 700;
  height: 50px;
}

.todo-checkbox {
  appearance: none;
  width: 20px;
  height: 20px;
  background: #f4e5e5;
  border-radius: 5px;
  border: 2px solid #da9d99;
  cursor: pointer;
}

.todo-checkbox::after {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='20' viewBox='0 -960 960 960' width='20' stroke='%23DA9D99' stroke-width='20' fill='%23DA9D99'%3E%3Cpath d='M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
}

.todo-checkbox:checked::after {
  width: 30px;
  height: 30px;
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

.todo-item-button.disabled {
  cursor: default;
  opacity: 0.7;
}

.todo-list-search {
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
}

.todo-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
