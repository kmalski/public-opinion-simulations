<template>
  <div class="local-majority-rule-model">
    <span class="p-float-label">
      <input-number id="groupSize" v-model="state.groupSize"></input-number>
      <label for="groupSize">Size of local group</label>
    </span>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useModel } from '@/composables/useModel';

const state = reactive({
  groupSize: 5
});

useModel(state);
</script>

<style scoped lang="scss">
@use '../../../../styles/tab';
@use '../../../../styles/forms';

.local-majority-rule-model {
  @include tab.opinion-model;
}
</style>
