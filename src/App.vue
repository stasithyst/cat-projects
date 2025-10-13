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
          <form-input v-model="formState.fieldA" placeholder="cool name"/>
        </a-form-item>
        <a-form-item class="input-label" label="Description">
          <form-input v-model="formState.fieldB" placeholder="cool description"/>
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
        <div class="todo-all-tasks">
          <h2>Tasks</h2>
          <input type="text" placeholder="search tasks" v-model="input" class="todo-search" />
          <div class="todo" v-for="item in filteredList" :key="item.id">
              <input type="checkbox"
                     class="todo-checkbox"
                     :checked="item.isDone === 'true'"
                     @click="item.isDone = item.isDone === 'true' ? 'false' : 'true'"
              />
              <div class="todo-name">
                {{ item.name }}
              </div>
              <div class="todo-description">
                {{ item.description }}
              </div>
              <button class="todo-item-button" @click="moveTask(item.id, 'false')">Progress</button>
          </div>
          <div class="item-error" v-if="input && !filteredList.length">
            <p>No results found</p>
          </div>
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
  isDone: 'true' | 'false' | 'joint'
}

const toDoList = ref<Todo[]>([
  {
    id: 0,
    name: '12345',
    description: '742737',
    isDone: 'joint',
  },
  {
    id: 1,
    name: 'abc',
    description: '747',
    isDone: 'joint',
  },
  {
    id: 2,
    name: 'def',
    description: '737',
    isDone: 'joint',
  },
])

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

  toDoList.value[index].isDone = targetList === 'selected' ? 'true' : 'false'

  dragItem.value = null
}

let todoId = toDoList.value.length + 1
function toDoItemAdd() {
  if (formState.fieldA && formState.fieldB) {
    toDoList.value.push({
      id: todoId++,
      name: formState.fieldA,
      description: formState.fieldB,
      isDone: 'joint',
    })
    formState.fieldA = ''
    formState.fieldB = ''
  }
}

const isDisabledButtonAdd = computed(
  () => formState.fieldA.length <= 2 || formState.fieldB.length <= 2,
)

const progressList = computed(() => toDoList.value.filter((task) => task.isDone === 'false'))
const doneList = computed(() => toDoList.value.filter((task) => task.isDone === 'true'))

function moveTask(id: number, isDone: 'true' | 'false' | 'joint') {
  const index = toDoList.value.findIndex(item => item.id === id)
  if (index !== -1) {
    toDoList.value[index].isDone = isDone
  }
}

const input = ref("");
const filteredList = computed(() => toDoList.value.filter((t) =>
  t.name.toLowerCase().includes(input.value.toLowerCase())))

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

.todo {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.todo-name,
.todo-description {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  font-weight: 700;
  height: 50px;
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

</style>
