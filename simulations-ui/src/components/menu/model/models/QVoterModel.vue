<template>
  <div class="q-voter-model">
    <span class="p-float-label">
      <input-number :disabled="isRunning || isPause" id="q" v-model="state.q"></input-number>
      <label for="q">Q parameter</label>
    </span>
  </div>
</template>

<script setup lang="ts">
import { useModel } from '@/composables/useModel';
import { reactive } from 'vue';
import { useGraphStore } from '@/stores/graph.store';
import { useToastStore } from '@/stores/toast.store';

const graphStore = useGraphStore();
const toastStore = useToastStore();

const state = reactive({
  q: 3
});

const validateFunc = () => {
  if (state.q < 1) {
    toastStore.error = {
      summary: 'Invalid QVoter model params',
      detail: 'The Q parameter can not be smaller than 1'
    };
    return false;
  }

  if (state.q > graphStore.graph.order) {
    toastStore.error = {
      summary: 'Invalid QVoter model params',
      detail: 'The Q parameter can not be greater than the graph order'
    };
    return false;
  }

  return true;
};

const { isRunning, isPause } = useModel(state, validateFunc);
</script>

<style scoped lang="scss">
@use '../../../../styles/tab';
@use '../../../../styles/forms';

.q-voter-model {
  @include tab.opinion-model;
}
</style>
