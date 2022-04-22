<template>
  <toast class="toast" position="bottom-right"></toast>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'pinia';
import { useToastStore } from '@/stores/toast.store';
import { ToastSeverity } from 'primevue/api';

export default defineComponent({
  name: 'ToastListener',
  computed: {
    ...mapState(useToastStore, ['error'])
  },
  watch: {
    error(newError) {
      if (newError) {
        this.$toast.add({
          severity: ToastSeverity.ERROR,
          summary: newError.summary,
          detail: newError.detail,
          life: 10000
        });
      }
    }
  }
});
</script>

<style scoped>
.toast {
  position: absolute;
}
</style>
