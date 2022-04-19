<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions } from 'pinia';
import { useSimulationStore } from '@/stores/simulation.store';

export interface OpinionModel {
  runSimulation(): void;
  setModel(model: OpinionModel): void;
}

export default defineComponent({
  name: 'OpinionModel',
  mounted() {
    this.setModel(this);
  },
  methods: {
    ...mapActions(useSimulationStore, ['setModel'])
  }
});
</script>
