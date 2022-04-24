<template>
  <toast class="toast" position="bottom-right"></toast>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useToastStore } from '@/stores/toast.store';
import { ToastSeverity } from 'primevue/api';
import { useToast } from 'primevue/usetoast';

const toastService = useToast();
const toastStore = useToastStore();
const { error } = storeToRefs(toastStore);

watch(error, (newError) => {
  if (newError) {
    toastService.add({
      severity: ToastSeverity.ERROR,
      summary: newError.summary,
      detail: newError.detail,
      life: 10000
    });
  }
});
</script>

<style scoped>
.toast {
  position: absolute;
}
</style>
