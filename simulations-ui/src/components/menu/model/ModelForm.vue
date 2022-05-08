<template>
  <div class="simulation-form">
    <p v-if="!modelComponentName" class="simulation-form-hint">
      The parameters will be available after selecting model
    </p>
    <component v-if="modelComponentName" :is="model"></component>
  </div>
</template>

<script setup lang="ts">
import { computed, DefineComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { useModelStore } from '@/stores/model.store';
import LocalMajorityRuleModel from '@/components/menu/model/models/LocalMajorityRuleModel.vue';

const modelStore = useModelStore();
const { modelComponentName } = storeToRefs(modelStore);

const nameToComponent = new Map([['local-majority-rule-model', LocalMajorityRuleModel]]) as Map<
  string,
  DefineComponent
>;

const model = computed(() => {
  if (modelComponentName?.value) {
    return nameToComponent.get(modelComponentName.value);
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
