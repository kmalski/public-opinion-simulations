<template>
  <div class="simulation-form">
    <span v-if="modelComponentName" class="p-float-label">
      <input-number :disabled="true" id="iterations" v-model="iterations" mode="decimal"></input-number>
      <label for="iterations">Number of simulation iterations</label>
    </span>
    <p v-if="!modelComponentName" class="simulation-form-hint">
      The parameters will be available after selecting model
    </p>
    <component v-if="modelComponentName" :is="modelComponentName"></component>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapState } from 'pinia';
import { useSimulationStore } from '@/stores/simulation.store';
import LocalMajorityRuleModel from '@/components/menu/simulation/model/LocalMajorityRuleModel.vue';

export default defineComponent({
  name: 'SimulationModelForm',
  components: {
    LocalMajorityRuleModel
  },
  data() {
    return {
      iterations: 100
    };
  },
  watch: {
    iterations(newIterations) {
      this.setIterations(newIterations);
    }
  },
  computed: {
    ...mapState(useSimulationStore, ['modelComponentName', 'isRunning'])
  },
  methods: {
    ...mapActions(useSimulationStore, ['setIterations'])
  }
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
    width: 100%;
    margin: 0;
    text-align: left;
  }
}
</style>
