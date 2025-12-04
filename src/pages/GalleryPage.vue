<template>
  <div class="gallery-page">
    <div class="gallery-content">
      <div
        class="gallery-item"
        v-for="image in images"
        :key="image.id"
        @click="openModal(image.id)"
      >
        <img :src="image.src" alt="image" class="card-image" />
      </div>
      <button @click="backToHome" class="card-button">Назад</button>
    </div>
    <div v-if="visible" class="overlay" @click="close">
      <div class="modal-content" @click.stop>
        <img
          :src="images[currentImage].src"
          :key="images[currentImage].id"
          alt="image"
          class="image"
        />
        <button @click="close" class="button">Закрыть</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter();

const visible = ref(false);
const currentImage = ref(0);

const images = [
  { id: 0, src: './images/gallery0.jpg' },
  { id: 1, src: './images/gallery1.jpg' },
  { id: 2, src: './images/gallery2.jpg' },
  { id: 3, src: './images/gallery3.jpg' },
  { id: 4, src: './images/gallery4.jpg' },
  { id: 5, src: './images/gallery5.jpg' },
];

function openModal(id: number) {
  currentImage.value = id;
  visible.value = true;
  router.push(`/gallery/${id}`);
}

function close() {
  currentImage.value = null;
  visible.value = false;
  router.push('/gallery');
}

function backToHome() {
  router.push('/');
}
</script>

<style scoped>
.gallery-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  align-items: center;
  justify-items: center;
}

.card-image {
  display: block;
  width: 400px;
  height: 400px;
  object-fit: cover;
  object-position: center;
  border-radius: 6px;
  cursor: pointer;
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

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 6px;
  position: relative;
  width: 500px;
  height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image {
  width: 400px;
  height: 400px;
  object-fit: cover;
  border-radius: 6px;
}

.button {
  margin-top: 20px;
  font-size: 14px;
  font-weight: 700;
  background-color: transparent;
  color: #da9d99;
  border: 3px solid #da9d99;
  cursor: pointer;
  border-radius: 10px;
  width: 100px;
  height: 40px;
}

.button:hover {
  border: none;
  box-shadow: 0 3px 0 #da9d99;
}
</style>
