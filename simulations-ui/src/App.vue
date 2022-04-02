<template>
  <div class="container">
    <graph-card class="graph-card"></graph-card>
    <menu-card class="menu-card"></menu-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import GraphCard from '@/components/GraphCard.vue';
import MenuCard from '@/components/MenuCard.vue';

export default defineComponent({
  components: { MenuCard, GraphCard }
});
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 1rem;
  height: 100vh;
  width: 100vw;
  background-color: #eff3f8;
}

.container {
  display: grid;
  grid-template-columns: 7fr 3fr;
  column-gap: 1rem;
  place-content: stretch;
  place-items: stretch;
  width: 100%;
  height: 100%;
}

.graph-card {
  grid-column: 1;
}

.menu-card {
  grid-column: 2;
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
