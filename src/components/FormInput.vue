<template>
  <a-input
    class ="todo-input"
    :value="props.modelValue"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>

<script setup lang ="ts">
const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<style>
.todo-input {
  font-family: "Shantell Sans", cursive;
  font-weight: 700;
  background-color: transparent;
  border: 3px solid #DA9D99;
  height: 40px;
  color: #DA9D99;
}

.todo-input:hover, .todo-input:focus {
  background-color: transparent;
  color: #DA9D99;
  border: none;
  box-shadow: 0 3px 0 #DA9D99;
}

.todo-input::placeholder {
  color: rgba(218, 157, 153, 0.51);
}
</style>
