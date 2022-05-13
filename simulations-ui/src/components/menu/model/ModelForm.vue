<template>
  <div class="simulation-form">
    <p v-if="!modelName" class="simulation-form-hint">The parameters will be available after selecting model</p>
    <component v-if="modelName" :is="model"></component>
  </div>
</template>

<script setup lang="ts">
import { computed, DefineComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { useModelStore } from '@/stores/model.store';
import { ModelName } from '@/composables/useModel';
import LocalMajorityRuleModel from '@/components/menu/model/models/LocalMajorityRuleModel.vue';

const modelStore = useModelStore();
const { modelName } = storeToRefs(modelStore);

const nameToComponent = new Map([['local-majority-rule-model', LocalMajorityRuleModel]]) as Map<
  ModelName,
  DefineComponent
>;

const model = computed(() => {
  if (modelName?.value) {
    return nameToComponent.get(modelName.value);
  }
  return undefined;
});
</script>

<style scoped lang="scss">
@use '../../../styles/forms';

.simulation-form {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
  height: 100%;
  width: 90%;
  margin: 0 auto;
  overflow: auto;

  &-hint {
    @include forms.hint;
  }
}
</style>
