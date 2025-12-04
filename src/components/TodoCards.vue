<template>
  <div class="todo-cards"
       @dragenter="emit('drag-enter', props.type)"
       @dragleave="emit('drag-leave', props.type)"
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
      @click="openCard(item.id)"
    >
      <template #title>
        <div class="todo-card-title">
          <input type="checkbox"
                 class="todo-checkbox"
                 :checked="item.isDone === true"
                 @click.stop="emit('change', item.id, !item.isDone)"
          />
          <span>{{ item.name }}</span>
          <button class="todo-delete-button" @click.stop="emit('remove', item.id)">
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
import { useRouter } from 'vue-router'
import type { Todo } from '../types/Todo'

const props = defineProps<{
  items: Todo[]
  type: 'available' | 'selected'
}>()

const emit = defineEmits<{
  (e: 'drag-start', item: Todo, type: 'available' | 'selected'): void
  (e: 'drop-list', type: 'available' | 'selected'): void
  (e: 'drag-enter', type: 'available' | 'selected'): void
  (e: 'drag-leave', type: 'available' | 'selected'): void
  (e: 'remove', id: number): void
  (e: 'change', id: number, isDone: boolean) : void
}>()

const router = useRouter()

function openCard(id: number) {
  router.push(`/card/${id}`)
}
</script>

<style scoped>
.todo-done-card-item {
  margin-bottom: 20px;
  border: 3px solid #da9d99;
  overflow: hidden;
  word-break: break-word;
  cursor: pointer;
}

.todo-done-card-item:hover {
  background-color: rgba(218, 157, 153, 0.11);
}

.todo-card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: nowrap;
}

.todo-card-title span {
  flex: 1;
  font-weight: 700;
  color: #333;
  word-break: break-word;
  white-space: normal;
  overflow-wrap: anywhere;
  line-height: 1.3;
  padding: 8px;
}

.todo-done-card-item p {
  margin-top: 8px;
  font-weight: 400;
  color: #666;
  word-break: break-word;
  white-space: normal;
  overflow-wrap: anywhere;
}

.todo-delete-button {
  background: transparent;
  border: none;
  cursor: pointer;
}

.todo-checkbox,
.todo-delete-button {
  flex-shrink: 0;
}

.todo-checkbox {
  position: relative;
  top: 0;
  appearance: none;
  width: 20px;
  height: 20px;
  background: #f4e5e5;
  border-radius: 5px;
  border: 2px solid #da9d99;
  cursor: pointer;
  vertical-align: middle;
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
