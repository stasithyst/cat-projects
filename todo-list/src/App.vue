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
          <a-input class ="todo-input" v-model:value="formState.fieldA" placeholder="input placeholder" />
        </a-form-item>
        <a-form-item class="input-label" label="Описание">
          <a-input class ="todo-input" v-model:value="formState.fieldB" placeholder="input placeholder" />
        </a-form-item>
        <div class="todo-button-group">
        <a-form-item :wrapper-col="buttonItemLayout.wrapperCol">
          <a-button type="primary" class="todo-item-button" @click="toDoItemAdd">Добавить</a-button>
        </a-form-item>
        <a-form-item :wrapper-col="buttonItemLayout.wrapperCol">
          <a-button type="primary" class="todo-item-button" @click="resetForm">Удалить</a-button>
        </a-form-item>
        </div>
      </a-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, reactive } from 'vue';
import type { UnwrapRef } from 'vue';

interface Todo {
  name: string;
  description: string;
  isDone: boolean;
}

const toDoList = reactive<Todo[]>([])

function toDoItemAdd() {
  if(formState.fieldA && formState.fieldB) {
    toDoList.push({
      name: formState.fieldA,
      description: formState.fieldB,
      isDone: false,
      }
    );
    formState.fieldA = '';
    formState.fieldB = '';
  }
}

function resetForm() {
  formState.fieldA = '';
  formState.fieldB = '';
}

interface FormState {
  layout: 'horizontal';
  fieldA: string;
  fieldB: string;
}
const formState: UnwrapRef<FormState> = reactive({
  layout: 'horizontal',
  fieldA: '',
  fieldB: '',
});
const formItemLayout = computed(() => {
  const { layout } = formState;
  return layout === 'horizontal'
    ? {
      labelCol: { span: 6 },
      wrapperCol: { span: 16, offset: 2 },
    }
    : {};
});
const buttonItemLayout = computed(() => {
  const { layout } = formState;
  return layout === 'horizontal'
    ? {
      wrapperCol: { span: 16, offset: 10 },
    }
    : {};
});
</script>

<style>
* {
  font-family: "Shantell Sans", cursive;
}

h1 {
  display: flex;
  justify-content: center;
  color: #cf6098;
  font-size: 40px;
}

.wrapper {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 300px;
  height: 100vh;
  background: #fff;
  border-right: 1px solid #eee;
  box-shadow: 2px 0 8px rgba(0,0,0,0.05);
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.input-label .ant-form-item-label > label {
  color: #cf6098;
}

.todo-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.todo-button-group {
  display: flex;
  gap: 8px;
  margin-top: auto;
  margin-bottom: 16px;
}

.todo-item-button {
  font-size: 14px;
  font-weight: 700;
  background-color: transparent;
  color: #cf6098;
  border: 3px solid #cf6098;
  cursor: pointer;
  border-radius: 10px;
  width: 100px;
  height: 40px;
  box-shadow: none;
}

.todo-input {
  background-color: transparent;
  border: 3px solid #cf6098;
  height: 40px;
  color: #cf6098;
}

.todo-input:hover, .todo-input:focus {
  background-color: transparent;
  color: #cf6098;
  border: none;
  box-shadow: 0 3px 0 #cf6098;
  }

.todo-button-group .todo-item-button:hover {
  background-color: transparent;
  color: #cf6098;
  border: none;
  box-shadow: 0 3px 0 #cf6098;
}
</style>


