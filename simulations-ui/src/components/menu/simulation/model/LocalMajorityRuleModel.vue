<template>
  <div class="local-majority-rule-model"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import OpinionModel from '@/components/menu/simulation/model/OpinionModel.vue';

export default defineComponent({
  name: 'LocalMajorityRuleModel',
  extends: OpinionModel,
  methods: {
    runSimulation() {
      console.log('Run LocalMajorityRuleModel');
    }
  }
});
</script>

<style scoped lang="scss">
.local-majority-rule-model {
  width: 90%;
  height: 100%;
}
</style>
