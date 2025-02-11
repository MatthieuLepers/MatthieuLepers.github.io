import { reactive } from 'vue';

const useAppStore = () => {
  const state = reactive({
    theme: 'Default',
  });

  return {
    state,
  };
};

export const appStore = useAppStore();
