<template>
  <div class="app">
    <toast-listener></toast-listener>
    <graph-card class="graph-card"></graph-card>
    <menu-card class="menu-card"></menu-card>
  </div>
</template>

<script setup lang="ts">
import GraphCard from '@/components/graph/GraphCard.vue';
import MenuCard from '@/components/menu/MenuCard.vue';
import ToastListener from '@/components/primevue/ToastListener.vue';
</script>

<style lang="scss">
.app {
  display: grid;
  grid-template-columns: 7fr 3fr;
  column-gap: 1rem;
  place-content: stretch;
  place-items: stretch;
  width: 100%;
  height: 100%;

  .graph-card {
    grid-column: 1;
  }

  .menu-card {
    grid-column: 2;
  }
}

body {
  margin: 0;
  padding: 1rem;
  height: 100vh;
  width: 100vw;
  background-color: #eff3f8;

  .p-toast {
    width: calc(30vw - 1.5rem);
    min-width: 20rem;
    font-size: 0.8rem;

    &-top-left {
      top: 1.2rem;
      left: 1.2rem;
    }
  }
}

#app {
  width: 100%;
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
