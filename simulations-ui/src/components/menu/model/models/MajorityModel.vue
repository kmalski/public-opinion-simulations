<template>
  <div class="local-majority-rule-model">
    <span class="p-float-label">
      <input-number :disabled="isRunning || isPause" id="groupSize" v-model="state.groupSize"></input-number>
      <label for="groupSize">Size of a local group</label>
    </span>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useModel } from '@/composables/useModel';
import { useGraphStore } from '@/stores/graph.store';
import { useToastStore } from '@/stores/toast.store';

const graphStore = useGraphStore();
const toastStore = useToastStore();

const state = reactive({
  groupSize: 5
});

const validateFunc = () => {
  if (state.groupSize < 1) {
    toastStore.error = {
      summary: 'Invalid Majority model params',
      detail: 'The size of a local group can not be smaller than 1'
    };
    return false;
  }

  if (state.groupSize > graphStore.graph.order) {
    toastStore.error = {
      summary: 'Invalid Majority model params',
      detail: 'The size of a local group can not be greater than the graph order'
    };
    return false;
  }

  if (!graphStore.graph.isComplete()) {
    toastStore.error = {
      summary: 'Invalid Majority model params',
      detail: 'Majority model can only be used with a complete graph'
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

.local-majority-rule-model {
  @include tab.opinion-model;
}
</style>
