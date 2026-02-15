<template>
  <div :class="GenerateModifiers('achivement-menu', {
    small: appStore.state.currentIndex > 0,
  })">
    <button
      class="achivement-menu__button"
      @click="actions.toggleMenu"
    >
      <span v-icon:trophy />
    </button>

    <div :class="GenerateModifiers('achivement-menu__circle', {
      open: isOpen,
    })">
      <AchivementList class="achivement-menu__list" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

import AchivementList from '@/components/Achievements/List.vue';

import { appStore } from '@/core/stores/appStore';

const isOpen = ref(false);

const actions = {
  toggleMenu() {
    isOpen.value = !isOpen.value;
  },
};
</script>

<style lang="scss" src="./Menu.scss">
</style>
