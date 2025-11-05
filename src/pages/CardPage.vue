<template>
  <div class="card-page" v-if="item">
    <div class="page-content">
      <div class="image-block">
        <img :src="item.image" alt="image" class="card-image" />
      </div>
      <div class="card-content">
        <h1>{{ item.name }}</h1>
        <p>{{ item.description }}</p>
      </div>
      <button @click="backToHome" class="card-button">Назад</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Todo } from '../types/Todo'

const route = useRoute()
const router = useRouter()

const item = ref<Todo | null>(null)

onMounted(() => {
  const toDoList: Todo[] = JSON.parse(localStorage.getItem('toDoList') || '[]')
  const found = toDoList.find((t) => t.id === Number(route.params.id))
  if (found) item.value = found
})

function backToHome() {
  router.push('/')
}
</script>

<style scoped>
.card-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  min-height: 100vh;
}

.page-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  align-items: center;
  justify-items: center;
}

.image-block {
  width: 300px;
  border: 3px solid #DA9D99;
  border-radius: 6px;
}

.card-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 6px;
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: flex-start;
  width: 400px;
}

h1 {
  font-size: 24px;
}

.card-button {
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

.card-button:hover {
  border: none;
  box-shadow: 0 3px 0 #da9d99;
}
</style>
