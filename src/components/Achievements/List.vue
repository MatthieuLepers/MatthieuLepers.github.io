<template>
  <div class="achievement-list">
    <h2>Succès</h2>
    <ul class="achievement-list__category-list">
      <li
        v-for="(achivementList, projectName) in achievementsStore.achivementsByProject.value"
        :key="projectName"
      >
        <h3>
          {{ projectName }} - {{ achievementsStore.actions.countAcquiredByProject(projectName) }} / {{ achivementList.length }}

          <button
            v-if="achievementsStore.actions.countAcquiredByProject(projectName) > 0"
            :title='`Réinitialiser les succès du projet "${projectName}"`'
            @click.prevent.stop="actions.handleRemoveProgressForProject(projectName)"
          >
            <span v-icon:trash />
          </button>
        </h3>
        <ul>
          <li
            v-for="(achievement, achivementId) in achivementList"
            :key="achivementId"
          >
            <Achievement :achievement="achievement" />
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import Achievement from '@/components/Achievements/Item.vue';

import { achievementsStore } from '@/core/entities/achievement/store';

defineOptions({ name: 'AchievementList' });

const actions = {
  handleRemoveProgressForProject(projectName: string) {
    achievementsStore.achivementsByProject.value[projectName].forEach((achievement) => {
      if (achievementsStore.actions.isAcquired(achievement.id)) {
        achievementsStore.actions.remove(achievement);
      }
    });
  },
};
</script>

<style lang="scss" src="./List.scss">
</style>
