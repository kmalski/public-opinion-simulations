<template>
  <div class="voter-model"></div>
</template>

<script setup lang="ts">
import { useModel } from '@/composables/useModel';

const { isRunning } = useModel({});
</script>

<style scoped lang="scss">
@use '../../../../styles/tab';
@use '../../../../styles/forms';

.voter-model {
  @include tab.opinion-model;
}
</style>
