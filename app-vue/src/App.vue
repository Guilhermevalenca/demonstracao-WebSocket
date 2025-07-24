<script setup lang="ts">
import { ref, onMounted } from 'vue';
import socket from './plugins/socket';

interface IMessage {
  message: string;
  name: string;
}

const message = ref<IMessage>({
  message: '',
  name: ''
});
const allMessages = ref<IMessage[]>([]);

async function submit() {
  if(message.value.message && message.value.name) {
    socket.emit('chat', message.value);
    message.value.message = '';
  }
}

onMounted(() => {
  socket.on('chat', (data: IMessage) => {
    allMessages.value.push(data);
  });

  socket.on('all-messages', (data: IMessage[]) => {
    allMessages.value = data;
    setTimeout(() => {
      const elementMessages = document.querySelector('.messages');
      if(elementMessages) {
        elementMessages.scrollTop = elementMessages.scrollHeight;
      }
    }, 100);
  });

  socket.emit('all-messages');
});
</script>

<template>
  <main>
    <section>
      <div>
        <h1>Chat App in Vue</h1>
      </div>
      <form @submit.prevent="submit">
        <label>
          Name
          <input type="text" v-model="message.name" />
        </label>
        <label>
          Message
          <input type="text" v-model="message.message" />
        </label>
        <button type="submit">Submit</button>
      </form>
    </section>
    <section v-show="allMessages.length > 0">
      <div class="messages">
        <ul>
          <li v-for="message in allMessages" :key="message.message">
            <strong>{{ message.name }}: </strong>
            <span>{{ message.message }}</span>
          </li>
        </ul>
      </div>
    </section>
  </main>
</template>

<style scoped>
main {
  display: flex;
  gap: 10rem;
}

form {
  display: flex;
  flex-direction: column;

  justify-content: start;
  justify-items: start;
}

label {
  display: grid;
  text-align: start;
  margin-bottom: 0.5rem;

  & input {
    width: 100%;
  }
}

.messages {
  border: 1px solid black;
  padding: 1.5rem;
  height: 50vh;
  overflow-y: scroll;

  text-align: start;
}
</style>
