<template>
  <div :class="GenerateModifiers('achievement', {
    popup: props.acquire,
    'popup-in': props.acquire && state.visible,
    acquired: isAcquired,
  })">
    <img
      :src="props.achievement.image"
      alt=""
    />
    <div class="achievement__infos">
      <span class="achievement__name">
        {{ props.achievement.name[locale] }}
      </span>
      <span class="achievement__description">
        {{
          isAcquired
            ? props.achievement.description[locale]
            : props.achievement.clue[locale]
        }}
      </span>

      <button
        v-if="isAcquired"
        :title="t('Achievements.resetAchievement', [props.achievement.name[locale]])"
        @click.prevent.stop="achievementsStore.actions.remove(props.achievement)"
      >
        <span v-icon:trash />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

import { achievementsStore } from '@/core/entities/achievement/store';
import type { IAchievement } from '@/core/entities/achievement/i';

defineOptions({ name: 'Achievement' });

const { t, locale } = useI18n();

const props = withDefaults(defineProps<{
  achievement: IAchievement;
  acquire?: boolean;
}>(), {
  acquire: false,
});

const state = reactive({
  visible: true,
});

const isAcquired = computed(() => achievementsStore.actions.isAcquired(props.achievement.id));

onMounted(() => {
  if (props.acquire) {
    setTimeout(() => {
      state.visible = false;
      setTimeout(() => {
        achievementsStore.actions.acquire(props.achievement);
      }, 1000);
    }, 5000);
  }
});
</script>

<style lang="scss" src="./Item.scss">
</style>
