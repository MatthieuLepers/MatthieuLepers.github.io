<template>
  <div :class="GenerateModifiers('m-form-toggle', {
    focus: state.focused,
    disabled: props.disabled,
    [props.variant]: !!props.variant,
    [props.direction]: !!props.direction,
  })">
    <input
      type="checkbox"
      :id="props.id || `formToggle${$uid}`"
      :checked="modelValue"
      :name="props.name"
      :disabled="props.disabled"
      @input="modelValue = ($event.target as HTMLInputElement)?.checked"
      @focus="actions.handleFocus('focus', true)"
      @blur="actions.handleFocus('blur', false)"
    />
    <label class="m-form-toggle__label" :for="props.id || `formToggle${$uid}`">
      <slot>{{ props.label }}</slot>
    </label>
  </div>
</template>

<script setup lang="ts">
import { reactive, getCurrentInstance } from 'vue';

defineOptions({ name: 'FormToggle' });

const emit = defineEmits<{
  focus: [state: boolean];
  blur: [state: boolean];
}>();
const $uid = getCurrentInstance()?.uid;

const modelValue = defineModel<boolean>({ default: false });

defineSlots<{
  default(): void;
}>();

const props = withDefaults(defineProps<{
  id?: string;
  name?: string;
  label: string;
  disabled?: boolean;
  variant?: 'default';
  direction?: 'left' | 'right';
}>(), {
  disabled: false,
  variant: 'default',
  direction: 'left',
});

const state = reactive<{
  focused: boolean;
}>({
  focused: false,
});

const actions = {
  handleFocus(type: 'focus' | 'blur', value: boolean) {
    state.focused = value;
    emit(type as ('focus' & 'blur'), state.focused);
  },
};
</script>

<style lang="scss" src="./Toggle.scss">
</style>
