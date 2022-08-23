<template>
  <prime-dialog class="simulation-modal" v-model:visible="visible" @hide="onHide" @show="onShow" :closeOnEscape="false">
    <template #header>
      <div class="simulation-modal-header-icons">
        <div class="simulation-modal-header-text">
          <p>Step: {{ step }}</p>
          <p>Left: {{ targetIterations && targetStep ? targetIterations - targetStep : state.iterations }}</p>
        </div>
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
      <accordion class="simulation-modal-accordion">
        <accordion-tab header="Settings">
          <div class="simulation-modal-input">
            <label for="iterations">Iterations</label>
            <input-number
              id="iterations"
              :min="1"
              v-model="state.iterations"
              :disabled="isRunning || isPause"
            ></input-number>
          </div>

          <div class="simulation-modal-input">
            <label for="frameDuration">Frame duration</label>
            <div class="p-inputgroup">
              <input-number
                id="frameDuration"
                :min="0.05"
                v-model="state.frameDurationSec"
                :disabled="isRunning"
                mode="decimal"
                :max-fraction-digits="2"
              ></input-number>
              <span class="p-inputgroup-addon">s</span>
            </div>
          </div>

          <div v-if="false" class="simulation-modal-input">
            <label for="mode">Sync</label>
            <input-switch :disabled="isRunning || isPause" v-model="state.isAsync"></input-switch>
            <label for="mode">Async</label>
          </div>
        </accordion-tab>
      </accordion>

      <div class="simulation-modal-buttons">
        <prime-button
          v-tooltip.bottom="'Run one iteration'"
          class="p-button-sm"
          :icon="PrimeIcons.STEP_FORWARD"
          :disabled="isRunning"
          @click="runOneIteration"
        ></prime-button>
        <prime-button
          v-tooltip.bottom="'Run simulation'"
          class="p-button-sm"
          :icon="PrimeIcons.PLAY"
          :disabled="isRunning"
          @click="runSimulation"
        ></prime-button>
        <prime-button
          v-tooltip.bottom="'Run simulation and skip animation'"
          class="p-button-sm"
          :icon="PrimeIcons.FORWARD"
          :disabled="isRunning"
          @click="forwardSimulation"
        ></prime-button>
        <prime-button
          v-tooltip.bottom="'Pause simulation'"
          class="p-button-sm"
          :icon="PrimeIcons.PAUSE"
          :disabled="!isRunning || isPause || simulationMode === 'forward'"
          @click="pauseSimulation"
        ></prime-button>
        <prime-button
          v-tooltip.bottom="'Stop and clear simulation'"
          class="p-button-sm"
          :icon="PrimeIcons.STOP"
          @click="stopSimulation"
        ></prime-button>
      </div>
      <progress-bar v-if="isRunning || isPause" :value="simulationPercentage" :mode="progressBarMode">
        {{ targetStep }} / {{ state.iterations }} ({{ simulationPercentage }}%)
      </progress-bar>
    </div>
  </prime-dialog>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue';
import PrimeDialog from 'primevue/dialog';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import { PrimeIcons } from 'primevue/api';
import Tooltip from 'primevue/tooltip';
import { useSimulationStore } from '@/stores/simulation.store';
import { storeToRefs } from 'pinia';
import { useDialog } from '@/composables/useDialog';
import { useToastStore } from '@/stores/toast.store';
import { MAX_ANIMATION_ITERATIONS } from '@/helpers/defaults';

interface Props {
  modelValue: boolean;
}

interface Emits {
  (e: 'update:modelValue', modelValue: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const vTooltip = Tooltip;
const simulationStore = useSimulationStore();
const toastStore = useToastStore();
const { isRunning, isPause, step, targetStep, targetIterations, simulationMode } = storeToRefs(simulationStore);

const state = reactive({
  iterations: 100,
  frameDurationSec: 0.1,
  isAsync: false
});

const mode = computed(() => {
  return state.isAsync ? 'async' : 'sync';
});

const progressBarMode = computed(() => {
  return simulationMode.value === 'animation' ? 'determinate' : 'indeterminate';
});

const simulationPercentage = computed(() => {
  if (targetStep?.value && targetIterations?.value) {
    return Math.trunc((targetStep.value / targetIterations.value) * 100);
  } else return 0;
});

const runOneIteration = () => {
  simulationStore.runSimulation('animation', {
    iterations: 1,
    frameDurationSec: state.frameDurationSec,
    mode: mode.value
  });
};

const runSimulation = () => {
  if (state.iterations > MAX_ANIMATION_ITERATIONS) {
    state.iterations = Math.min(state.iterations, MAX_ANIMATION_ITERATIONS);
    toastStore.warning = {
      summary: 'Large number of iterations',
      detail: 'The maximum allowed number of iterations for animation was exceeded. The value has been reduced to 5000.'
    };
  }

  simulationStore.runSimulation('animation', {
    iterations: state.iterations,
    frameDurationSec: state.frameDurationSec,
    mode: mode.value
  });
};

const forwardSimulation = () => {
  if (state.iterations > MAX_ANIMATION_ITERATIONS) {
    toastStore.warning = {
      summary: 'Large number of iterations',
      detail: 'Note that charts may not be able to handle this amount of data. Charts will not be updated.'
    };
  }

  simulationStore.runSimulation('forward', { iterations: state.iterations, frameDurationSec: 0, mode: mode.value });
};
const pauseSimulation = simulationStore.pauseSimulation;
const stopSimulation = simulationStore.stopSimulation;

const { visible, onShow, onHide } = useDialog(props, emit);
</script>

<style scoped lang="scss">
.simulation-modal {
  &-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-content: center;
    align-items: flex-start;
    min-width: 15rem;
    padding: 0.5rem 0.75rem 0.75rem;

    .p-progressbar {
      width: 100%;
      margin: 0.5rem auto 0;

      :deep(.p-progressbar-label) {
        white-space: nowrap;
      }
    }
  }

  &-accordion {
    width: 100%;

    :deep(.p-accordion-header) {
      .p-accordion-header-link {
        padding: 0.5rem;

        .p-accordion-toggle-icon {
          font-size: 12px;
        }
      }
    }

    :deep(.p-accordion-content) {
      padding: 0.5rem;
      display: flex;
      flex-direction: column;
      row-gap: 0.35rem;
    }
  }

  &-input {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    text-align: left;
    width: 100%;

    :deep(.p-inputtext) {
      width: 4.5rem;
      height: 2rem;
    }

    :deep(.p-inputgroup) {
      width: min-content;

      .p-inputtext {
        width: 3rem;
        height: 2rem;
      }

      .p-inputgroup-addon {
        height: 2rem;
        width: 1.5rem;
        min-width: 0;
      }
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
    margin: 0.75rem auto 0;
  }
}
</style>

<style lang="scss">
.p-tooltip.p-component.simulation-modal-tooltip {
  font-size: 12px;
}

.simulation-modal.p-dialog {
  .p-dialog-header {
    padding: 0.5rem 0.5rem 0 0.75rem;

    :hover {
      cursor: pointer;
    }

    .simulation-modal-header-icons {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      text-align: center;
      align-content: center;
      align-items: center;
      width: 100%;

      p {
        font-weight: 500;
        padding: 0;
        margin: 0;
      }
    }

    .simulation-modal-header-text {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      text-align: left;
      align-content: center;
      align-items: center;
      width: 100%;
      column-gap: 0.5rem;
      font-size: 14px;
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
