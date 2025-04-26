<template>
  <div :class="GenerateModifiers('achievement', {
    popup: props.acquire,
    'popup-in': props.acquire && state.visible,
    acquired: props.achievement.isAcquired,
  })">
    <img
      :src="props.achievement.image"
      alt=""
    />
    <div class="achievement__infos">
      <span class="achievement__name">
        {{ props.achievement.name }}
      </span>
      <span class="achievement__description">
        {{ props.achievement.isAcquired ? props.achievement.description : props.achievement.clue }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';

import { appStore } from '@/core/stores/appStore';
import type { Achievement } from '@/core/Achievement';

defineOptions({ name: 'Achievement' });

const props = withDefaults(defineProps<{
  achievement: Achievement;
  acquire?: boolean;
}>(), {
  acquire: false,
});

const state = reactive({
  visible: true,
});

onMounted(() => {
  if (props.acquire) {
    setTimeout(() => {
      state.visible = false;
      setTimeout(() => {
        appStore.state.achievementList.splice(appStore.state.achievementList.indexOf(props.achievement), 1);
      }, 1000);
    }, 5000);
  }
});
</script>

<style lang="scss" src="./Item.scss">
</style>
