import { ref, toRefs, watch } from 'vue';
import { noop } from '@/helpers/utils';

export interface Props {
  modelValue: boolean;
}

export interface Emits {
  (e: 'update:modelValue', modelValue: boolean): void;
}

export function useDialog(props: Props, emit: Emits, customOnShow: () => void = noop, customOnHide: () => void = noop) {
  const { modelValue } = toRefs(props);

  const visible = ref(false);

  watch(modelValue, (newModelValue) => {
    visible.value = newModelValue;
  });

  function onShow() {
    customOnShow();
    emit('update:modelValue', true);
  }

  function onHide() {
    customOnHide();
    emit('update:modelValue', false);
  }

  return { visible, onShow, onHide };
}
