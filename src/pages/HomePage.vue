<template>
  <div class="wrapper">
    <div class="sidebar">
      <a-form class="todo-form" :model="formState" v-bind="formItemLayout">
        <h1>ToDo-list</h1>
        <a-form-item class="input-label" label="Name">
          <form-input v-model="formState.nameInput" placeholder="cool name" />
        </a-form-item>
        <a-form-item class="input-label" label="Description">
          <form-input v-model="formState.descriptionInput" placeholder="cool description" />
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
        <div class="search-block">
          <input type="text" placeholder="search tasks" v-model="input" class="todo-search" />
          <button class="todo-filter-button" @click="isFilterOpen">
            <img src="@/assets/search.svg" alt="filter" class="todo-filter-icon" />
          </button>
        </div>
        <a-select
          v-model:value="type"
          v-show="open"
          class="todo-filter custom"
          placeholder="search tasks"
        >
          <a-select-option value="name" class="todo-filter-option">по названию</a-select-option>
          <a-select-option value="description" class="todo-filter-option"
            >по описанию</a-select-option
          >
          <a-select-option value="all" class="todo-filter-option"
            >по названию и описанию</a-select-option
          >
        </a-select>
        <ul class="todo-list-search">
          <li v-for="item in filteredList" :key="item.id" class="todo-list-item">
            <input
              type="checkbox"
              class="todo-checkbox"
              v-model="item.isDone"
              @change="() => onDropList(item.isDone ? 'selected' : 'available')"
            />
            <div class="todo-name">{{ item.name }}</div>
            <div class="todo-description">{{ item.description }}</div>
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
        @change="changeCheck"
      />
      <button class="other-page-button">
        <router-link to="/gallery">тут коты</router-link>
      </button>
    </div>
    <div class="todo-list-done">
      <h2>Done tasks</h2>
      <todo-cards
        :items="filter.doneList"
        type="selected"
        @drag-start="onDragStart"
        @drop-list="onDropList"
        @remove="deleteCard"
        @change="changeCheck"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import type { UnwrapRef } from 'vue'
import type { Todo } from '../types/Todo'
import FormInput from '../components/FormInput.vue'
import TodoCards from '../components/TodoCards.vue'
import { watch } from 'vue'

const toDoList = ref<Todo[]>([
  {
    id: 0,
    name: 'добавить крутые картинки',
    description: 'смешные звери уже тут',
    isDone: true,
    image: '/images/card0.jpg'
  },
  {
    id: 1,
    name: 'купить электрическую прикольную штуку чтобы делать шашлык',
    description: 'ура шашлык!!',
    isDone: false,
    image: '/images/card1.jpg'
  },
  {
    id: 2,
    name: 'связать шарф для пушистого кота',
    description: 'уже месяц лежит',
    isDone: false,
    image: '/images/card2.jpg'
  },
  {
    id: 3,
    name: 'сделать тысячу заказов в золотом яблоке',
    description: 'пока только 999',
    isDone: false,
    image: '/images/card5.jpg'
  },
  {
    id: 4,
    name: 'купить увлажнитель воздуха',
    description: 'отопление убивает',
    isDone: false,
    image: '/images/card3.jpg'
  },
  {
    id: 5,
    name: 'пройти heavy rain',
    description: 'а что мне её зря купили что ли',
    isDone: false,
    image: '/images/card4.jpg'
  },
])

const filter = computed(() => ({
  progressList: toDoList.value.filter(t => !t.isDone),
  doneList: toDoList.value.filter(t => t.isDone),
}))

const open = ref(false)

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

function isFilterOpen() {
  open.value = !open.value
}

let todoId = toDoList.value.length + 1
function toDoItemAdd() {
  const imageIndex = todoId % 6
  toDoList.value.push({
    id: todoId++,
    name: formState.nameInput,
    description: formState.descriptionInput,
    isDone: false,
    image: `/images/card${imageIndex}.jpg`
  })
  formState.nameInput = ''
  formState.descriptionInput = ''
}

const isDisabledButtonAdd = computed(
  () => formState.nameInput.length <= 2 || formState.descriptionInput.length <= 2,
)

const type = ref('all')
const input = ref("");
const filteredList = computed(() => {
  const search = input.value.toLowerCase().trim()
  if (!search) return []
  return toDoList.value.filter(t => {
    const todoName = t.name.toLowerCase().includes(search)
    const todoDescription = t.description.toLowerCase().includes(search)
    if(type.value === 'name') {
      return todoName
    }
    if(type.value === 'description') {
      return todoDescription
    }
    return todoName || todoDescription
  })
})

function changeCheck(id: number, isDone: boolean) {
  const check = toDoList.value.find((item) => item.id === id)
  if(check) check.isDone = isDone
}

interface FormState {
  nameInput: string
  descriptionInput: string
}

const formState: UnwrapRef<FormState> = reactive({
  nameInput: '',
  descriptionInput: '',
})

const formItemLayout = computed(() => ({
  labelCol: { span: 6 },
  wrapperCol: { span: 16, offset: 2 },
}))

const buttonItemLayout = computed(() => ({
  wrapperCol: { offset: 4 }
}))

function deleteCard(id: number) {
  toDoList.value = toDoList.value.filter(item => item.id !== id)
}

watch(toDoList, (val) => {
  localStorage.setItem('toDoList', JSON.stringify(val))
},
  { deep: true })

onMounted(() => {
  const saved = localStorage.getItem('toDoList')
  if (saved) {
    toDoList.value = JSON.parse(saved)
  }
})
</script>

<style lang="css">
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

.search-block {
  display: flex;
  align-items: center;
  gap: 8px;
}

.todo-search {
  font-family: 'Shantell Sans', cursive;
  font-weight: 700;
  background-color: transparent;
  border: 3px solid #da9d99;
  border-radius: 6px;
  width: 260px;
  height: 30px;
  color: #da9d99;
  transition: all 0.2s;
  margin-bottom: 16px;
  padding: 4px 11px;
}

.todo-search:hover,
.todo-search:focus {
  background-color: transparent;
  color: #da9d99;
  border: none;
  box-shadow: 0 3px 0 #da9d99;
  outline: none;
}

.todo-search::placeholder {
  color: rgba(218, 157, 153, 0.51);
}

.todo-filter-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: transparent;
  border: none;
  border-radius: 50%;
  color: #da9d99;
  cursor: pointer;
  margin-bottom: 15px;
}

.todo-filter-button:hover {
  background-color: rgba(218, 157, 153, 0.11);
  transition: all 0.2s;
}

.todo-filter-icon {
  width: 18px;
}

.todo-filter .ant-select-selector .ant-select-selection-item {
  font-weight: 700 !important;
}

.todo-filter .ant-select-selector {
  color: #da9d99 !important;
  border: none !important;
  box-shadow: none !important;
  background-color: transparent !important;
}

.todo-filter .ant-select-selector:hover {
  border: none !important;
  box-shadow: none !important;
  background-color: transparent !important;
}

.todo-filter .ant-select-arrow {
  color: #da9d99 !important;
}

.custom {
  color: #da9d99 !important;
  background: transparent;
  border-radius: 6px;
}

.custom:hover {
  background: rgba(218, 157, 153, 0.11) !important;
}

.todo-filter-option {
  font-weight: 700;
  background-color: transparent !important;
  border-radius: 6px;
  padding: 8px;
  height: 40px;
  color: #da9d99 !important;
  outline: none;
  cursor: pointer;
}

.todo-filter-option:hover {
  font-weight: 700;
  background: rgba(218, 157, 153, 0.11) !important;
  border-radius: 6px;
  padding: 8px;
  height: 40px;
  color: #da9d99;
  outline: none;
  cursor: pointer;
}

.todo-name,
.todo-description {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 8px;
  word-break: break-word;
  white-space: normal;
  width: 150px;
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

.todo-checkbox {
  flex-shrink: 0;
}

.todo-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  justify-content: center;
  margin-left: 400px;
  padding: 40px;
}

.todo-list-progress,
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
  gap: 24px;
  list-style: none;
  margin-top: 24px;
  padding: 0;
}

.todo-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

a,
a:hover,
a:focus,
a:active {
  text-decoration: none !important;
  color: #da9d99;
}

.other-page-button {
  font-size: 14px;
  font-weight: 700;
  background-color: transparent;
  border: 3px solid #da9d99;
  cursor: pointer;
  border-radius: 10px;
  width: 300px;
  height: 40px;
  text-decoration: none;
}
.other-page-button:hover {
  border: none;
  box-shadow: 0 3px 0 #da9d99;
  transition: all 0.2s;
}
</style>
