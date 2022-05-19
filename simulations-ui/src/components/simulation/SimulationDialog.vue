<template>
  <prime-dialog class="simulation-modal" v-model:visible="visible" @hide="onHide" @show="onShow" :closeOnEscape="false">
    <template #header>
      <div class="simulation-modal-header-icons">
        <div>
          <p>Step: {{ step }}</p>
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
          <span class="simulation-modal-input">
            <label for="iterations">Iterations</label>
            <input-number
              id="iterations"
              :min="1"
              :max="100"
              v-model="state.iterations"
              :disabled="isRunning || isPause"
            ></input-number>
          </span>

          <span class="simulation-modal-input">
            <label for="frameDuration">Frame duration</label>
            <div class="col-12 md:col-4">
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
          </span>

          <span class="simulation-modal-input">
            <label for="mode">Sync</label>
            <input-switch :disabled="isRunning" v-model="state.isAsync"></input-switch>
            <label for="mode">Async</label>
          </span>
        </accordion-tab>
      </accordion>

      <div class="simulation-modal-buttons">
        <prime-button
          v-tooltip.bottom="'Run one iteration'"
          class="p-button-sm"
          :icon="PrimeIcons.STEP_FORWARD"
          :disabled="isRunning"
          @click="() => simulationStore.runSimulation(1, 1, mode)"
        ></prime-button>
        <prime-button
          v-tooltip.bottom="'Run simulation'"
          class="p-button-sm"
          :icon="PrimeIcons.PLAY"
          :disabled="isRunning"
          @click="() => simulationStore.runSimulation(state.iterations, state.frameDurationSec, mode)"
        ></prime-button>
        <prime-button
          v-tooltip.bottom="'Forward to simulation end'"
          class="p-button-sm"
          :icon="PrimeIcons.FORWARD"
          :disabled="isRunning"
          @click="() => simulationStore.runSimulation(state.iterations, 0, mode)"
        ></prime-button>
        <prime-button
          v-tooltip.bottom="'Pause simulation'"
          class="p-button-sm"
          :icon="PrimeIcons.PAUSE"
          :disabled="!isRunning || isPause"
          @click="simulationStore.pauseSimulation()"
        ></prime-button>
        <prime-button
          v-tooltip.bottom="'Stop and clear simulation'"
          class="p-button-sm"
          :icon="PrimeIcons.STOP"
          @click="simulationStore.stopSimulation()"
        ></prime-button>
      </div>
      <progress-bar v-if="isRunning || isPause" :value="simulationPercentage">
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
const { isRunning, isPause, step, targetStep, targetIterations } = storeToRefs(simulationStore);

const state = reactive({
  iterations: 10,
  frameDurationSec: 1,
  isAsync: false
});

const mode = computed(() => {
  return state.isAsync ? 'async' : 'sync';
});

const simulationPercentage = computed(() => {
  if (targetStep?.value && targetIterations?.value) {
    return Math.trunc((targetStep.value / targetIterations.value) * 100);
  } else return 0;
});

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
    width: 15rem;
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
          font-size: 13px;
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
        font-weight: bold;
        padding: 0;
        margin: 0;
      }
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
