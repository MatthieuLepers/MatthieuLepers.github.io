<template>
  <div class="project-card">
    <div class="project-card__scene">
      <Teleport to="body" v-if="props.project.scene && state.fullscreen">
        <component
          :is="props.project.scene"
          :fullscreen="state.fullscreen"
          @fullscreen="state.fullscreen = !state.fullscreen"
        />
      </Teleport>
      <component
        v-else-if="props.project.scene && !state.fullscreen"
        :is="props.project.scene"
        :fullscreen="state.fullscreen"
        @fullscreen="state.fullscreen = !state.fullscreen"
      />

      <div class="scene" v-else>
        <img :src="props.project.image" alt="" />
      </div>
    </div>

    <div class="project-card__infos">
      <h2>
        {{ props.project.name }}
      </h2>

      <p>
        {{ props.project.description }}
      </p>

      <div class="project-card__actions">
        <MaterialButton
          v-if="props.project.link"
          tag="a"
          target="_blank"
          class="project-card__link"
          :href="props.project.link"
          :modifiers="{ secondary: true }"
        >
          Tester
        </MaterialButton>
        <MaterialButton
          v-if="props.project.github"
          tag="a"
          target="_blank"
          icon="icon-github"
          :href="props.project.github"
          :modifiers="{ secondary: true }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, type Component } from 'vue';

import MaterialButton from '@/components/Materials/Button/index.vue';

interface IProject {
  name: string;
  description: string;
  link?: string;
  github?: string;
  image?: string;
  scene?: Component;
}

const props = defineProps<{
  project: IProject;
}>();

const state = reactive({
  fullscreen: false,
});
</script>

<style lang="scss">
@import '~styles/utilities';
@import '../Scenes/Scene';

.project-card {
  background-color: color(grey900);
  padding: rem(16px);
  border-radius: 32px;
  display: flex;
  flex-direction: column;
  gap: rem(16px);

  h2 {
    @include set-font-scale(l);
    text-shadow: 0 0 5px color(secondary200);
    font-weight: 700;
  }

  p {
    @include set-font-scale(s);
    min-height: 72px;
  }

  &__scene {
    width: 100%;
  }

  &__actions {
    margin-top: rem(16px);
    display: flex;
    gap: rem(8px);
    justify-content: center;
  }

  &__link {
    width: 66.666%;
  }
}
</style>
