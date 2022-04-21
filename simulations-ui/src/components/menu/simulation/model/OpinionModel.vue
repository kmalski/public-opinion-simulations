<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions } from 'pinia';
import { useSimulationStore } from '@/stores/simulation.store';

export interface OpinionModelComponent {
  pushModelToStore(): void;
  setModelComponent(modelComponent: OpinionModelComponent): void;
  setModel(model: any): void;
}

export default defineComponent({
  name: 'OpinionModel',
  mounted() {
    this.setModelComponent(this as unknown as OpinionModelComponent);
  },
  methods: {
    ...mapActions(useSimulationStore, ['setModelComponent', 'setModel'])
  }
});
</script>
