<template>
  <div class="sznajd-model"></div>
</template>

<script setup lang="ts">
import { useModel } from '@/composables/useModel';

const { isRunning } = useModel({});
</script>

<style scoped lang="scss">
@use '../../../../styles/tab';
@use '../../../../styles/forms';

.local-majority-rule-model {
  @include tab.opinion-model;
}
</style>
