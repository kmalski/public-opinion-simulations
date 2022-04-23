<template>
  <div class="local-majority-rule-model"></div>
</template>

<script setup lang="ts">
import { useSimulationStore } from '@/stores/simulation.store';
import { onMounted } from 'vue';

const simulationStore = useSimulationStore();

onMounted(() => {
  simulationStore.model = {};
});
</script>

<style scoped lang="scss">
.local-majority-rule-model {
  width: 90%;
  height: 100%;
}
</style>
