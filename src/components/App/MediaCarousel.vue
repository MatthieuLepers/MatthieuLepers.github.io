<template>
  <div :class="GenerateModifiers('app-media-carousel', { open: props.open })">
    <MaterialButton
      class="app-media-carousel__close"
      type="button"
      icon="icon-close"
      :modifiers="{ secondary: true }"
      @click="emit('close', $event)"
    />
    <Carousel
      v-model="state.currentIndex"
      :itemsToShow="1"
      slideEffect="fade"
      :wrapAround="true"
    >
      <Slide v-for="(media, i) in props.medias" :key="i">
        <img :src="media" alt="" />
      </Slide>

      <template #addons>
        <Navigation>
          <template #prev></template>
          <template #next></template>
        </Navigation>
      </template>
    </Carousel>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import { Carousel, Navigation,Slide } from 'vue3-carousel';

import MaterialButton from '@/components/Materials/Button/index.vue';

import 'vue3-carousel/carousel.css';

const emit = defineEmits<{
  close: [e: MouseEvent];
}>();

const props = withDefaults(defineProps<{
  open?: boolean;
  current?: number;
  medias?: Array<string>;
}>(), {
  open: false,
  current: 0,
  medias: () => [],
});

const state = reactive({
  currentIndex: props.current,
});

watch(() => props.current, (current) => {
  state.currentIndex = current;
});
</script>

<style lang="scss" src="./MediaCarousel.scss">
</style>
