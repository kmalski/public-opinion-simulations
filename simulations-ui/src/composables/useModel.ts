import { onMounted, Ref, unref } from 'vue';
import { useModelStore } from '@/stores/model.store';

export function useModel(model: Ref<object> | object) {
  const modelStore = useModelStore();
  onMounted(() => {
    modelStore.model = unref(model);
  });
}
