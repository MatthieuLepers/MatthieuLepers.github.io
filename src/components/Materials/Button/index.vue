<template>
  <component
    :is="props.tag"
    :class="GenerateModifiers('m-button', {
      ...props.modifiers,
      disabled: props.disabled,
      iconed: !!props.icon,
      [`iconed-${props.iconSide}`]: true,
      iconOnly: !Object.keys(slots).length,
    })"
    :type="props.type"
    :disabled="props.disabled"
  >
    <span v-if="props.icon" class="m-button__icon" :class="props.icon"></span>
    <slot />
  </component>
</template>

<script setup lang="ts">
import { useSlots } from 'vue';

defineOptions({ name: 'MButton' });

const slots = useSlots();

defineSlots<{
  default(): void;
}>();

type Modifiers = 'success' | 'secondary' | 'warning' | 'danger' | 'cancel' | 'inverted' | 'squared';

const props = withDefaults(defineProps<{
  tag?: string;
  type?: HTMLButtonElement['type'];
  disabled?: boolean;
  icon?: string;
  iconSide?: 'left' | 'right';
  modifiers?: Partial<Record<Modifiers, boolean>>;
}>(), {
  tag: 'button',
  type: 'button',
  disabled: false,
  iconSide: 'left',
  modifiers: () => ({}),
});
</script>

<style lang="scss" src="./index.scss">
</style>
