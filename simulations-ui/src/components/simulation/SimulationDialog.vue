<template>
  <prime-dialog
    class="simulation-modal"
    v-model:visible="state.visible"
    @hide="onHide"
    @show="onShow"
    :closeOnEscape="false"
  >
    <template #header>
      <div class="simulation-modal-header-icons">
        <prime-button
          v-tooltip.top="{
            value: `Please use this panel to control the simulation. \
          You can grab it and position it anywhere on the screen.`,
            class: 'simulation-modal-tooltip'
          }"
          class="p-button-rounded p-dialog-header-icon p-link"
          :icon="PrimeIcons.QUESTION_CIRCLE"
        ></prime-button>
      </div>
    </template>

    <div class="simulation-modal-content">
      <span class="simulation-modal-input">
        <label for="iterations">Iterations</label>
        <input-number
          id="iterations"
          :min="1"
          :max="100"
          v-model="state.iterations"
          :disabled="isRunning"
        ></input-number>
      </span>

      <span class="simulation-modal-input">
        <label for="mode">Sync</label>
        <input-switch :disabled="isRunning" v-model="state.isAsync"></input-switch>
        <label for="mode">Async</label>
      </span>

      <div class="simulation-modal-buttons">
        <prime-button
          v-tooltip.bottom="'Run one iteration'"
          class="p-button-sm"
          :icon="PrimeIcons.STEP_FORWARD"
          :disabled="isRunning"
          @click="() => simulationStore.runSimulation(1, mode)"
        ></prime-button>
        <prime-button
          v-tooltip.bottom="'Run simulation'"
          class="p-button-sm"
          :icon="PrimeIcons.PLAY"
          :disabled="isRunning"
          @click="() => simulationStore.runSimulation(state.iterations, mode)"
        ></prime-button>
        <prime-button
          v-tooltip.bottom="'Stop simulation'"
          class="p-button-sm"
          :icon="PrimeIcons.STOP"
          :disabled="!isRunning"
          @click="simulationStore.stopSimulation()"
        ></prime-button>
      </div>
      <progress-bar v-if="isRunning" :value="simulationPercentage"></progress-bar>
    </div>
  </prime-dialog>
</template>

<script setup lang="ts">
import { reactive, watch, toRefs, computed } from 'vue';
import PrimeDialog from 'primevue/dialog';
import { PrimeIcons } from 'primevue/api';
import Tooltip from 'primevue/tooltip';
import { useSimulationStore } from '@/stores/simulation.store';
import { storeToRefs } from 'pinia';

interface Props {
  modelValue: boolean;
}

interface Emits {
  (e: 'update:modelValue', modelValue: boolean): void;
}

const props = defineProps<Props>();
const { modelValue } = toRefs(props);
const emit = defineEmits<Emits>();
const vTooltip = Tooltip;
const simulationStore = useSimulationStore();
const { isRunning, step } = storeToRefs(simulationStore);

const state = reactive({
  iterations: 10,
  isAsync: false,
  visible: false
});

watch(modelValue, (newModelValue) => {
  state.visible = newModelValue;
});

const mode = computed(() => {
  return state.isAsync ? 'async' : 'sync';
});

const simulationPercentage = computed(() => {
  if (step?.value && state.iterations) {
    return Math.trunc((step.value / state.iterations) * 100);
  } else return 0;
});

function onShow() {
  emit('update:modelValue', true);
}

function onHide() {
  emit('update:modelValue', false);
}
</script>

<style scoped lang="scss">
.simulation-modal {
  &-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-content: center;
    align-items: flex-start;
    width: 13rem;
    padding: 0 1rem 1rem;

    .p-progressbar {
      width: 100%;
      margin: 0.5rem auto 0;
    }
  }

  &-input {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin: 0.5rem auto;
    text-align: left;
    width: 100%;

    :deep(.p-inputtext) {
      width: 5rem;
      height: 2rem;
    }

    .p-selectbutton {
      height: 2rem;

      .p-button {
        height: 2rem;
      }
    }
  }

  &-buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin: 0.5rem auto;
  }
}
</style>

<style lang="scss">
.p-tooltip.p-component.simulation-modal-tooltip {
  font-size: 12px;
}

.simulation-modal.p-dialog {
  .p-dialog-header {
    padding: 0.5rem 0.5rem 0 0;

    :hover {
      cursor: pointer;
    }

    .simulation-modal-header-icons {
      display: flex;
      flex-direction: row-reverse;
      width: 100%;
    }

    .p-dialog-header-icons {
      display: flex;
      flex-direction: row-reverse;
    }
  }

  .p-dialog-content {
    padding: 0;
  }
}
</style>
