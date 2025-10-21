<template>
  <div class="todo-cards"
       @dragover.prevent @drop="(event) => { event.stopPropagation();
       emit('drop-list', props.type) }"
  >
    <a-card
      v-for="item in props.items"
      :key="item.id"
      class="todo-done-card-item"
      :bordered="false"
      style="width: 300px"
      draggable="true"
      @dragstart="() => emit('drag-start', item, props.type)"
    >
      <template #title>
        <div class="todo-card-title">
          <input type="checkbox"
                 class="todo-checkbox"
                 :checked="item.isDone === true"
                 @click="item.isDone = item.isDone !== true"
          />
          <span>{{ item.name }}</span>
          <button class="todo-delete-button" @click="emit('remove', item.id)">
            <img src="@/assets/icon.svg" alt="Удалить" class="icon" />
          </button>
        </div>
      </template>
      <p>{{ item.description }}</p>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface Todo {
  id: number
  name: string
  description: string
  isDone: boolean
}

const props = defineProps<{
  items: Todo[]
  type: 'available' | 'selected'
}>()

const emit = defineEmits<{
  (e: 'drag-start', item: Todo, type: 'available' | 'selected'): void
  (e: 'drop-list', type: 'available' | 'selected'): void
  (e: 'remove', id: number): void
}>()
</script>

<style scoped>
.todo-done-card-item {
  margin-bottom: 20px;
  border: 3px solid #da9d99;
}

.todo-card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.todo-delete-button {
  background: transparent;
  border: none;
  cursor: pointer;
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
