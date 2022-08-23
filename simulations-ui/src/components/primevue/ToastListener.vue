<template>
  <toast class="toast" position="top-left"></toast>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useToastStore } from '@/stores/toast.store';
import { ToastSeverity } from 'primevue/api';
import { useToast } from 'primevue/usetoast';

const toastService = useToast();
const toastStore = useToastStore();
const { error, warning, success } = storeToRefs(toastStore);

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

watch(warning, (newWarning) => {
  if (newWarning) {
    toastService.add({
      severity: ToastSeverity.WARN,
      summary: newWarning.summary,
      detail: newWarning.detail,
      life: 10000
    });
  }
});

watch(success, (newSuccess) => {
  if (newSuccess) {
    toastService.add({
      severity: ToastSeverity.SUCCESS,
      summary: newSuccess.summary,
      detail: newSuccess.detail,
      life: 3000
    });
  }
});
</script>

<style scoped>
.toast {
  position: absolute;
}
</style>
