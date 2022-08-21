<template>
  <div class="q-voter-model">
    <span class="p-float-label">
      <input-number :min="1" :disabled="isRunning || isPause" id="q" v-model="state.q"></input-number>
      <label for="q">Q parameter</label>
    </span>
  </div>
</template>

<script setup lang="ts">
import { useModel } from '@/composables/useModel';
import { reactive } from 'vue';

const state = reactive({
  q: 3
});

const { isRunning, isPause } = useModel(state);
</script>

<style scoped lang="scss">
@use '../../../../styles/tab';
@use '../../../../styles/forms';

.q-voter-model {
  @include tab.opinion-model;
}
</style>
