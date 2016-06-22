import store from '../data/store.js';

export function getCurrentProjectAndScreen(state) {
  // sometimes there will be no screen (e.g. bad URL)
  // in those cases return a well formed object, just with no values.
  const result = {
    currentProject: {
      key: null,
      val: null,
    },
    currentScreen: {
      key: null,
      val: null,
    },
  };

  const storeState = state || store.getState();
  result.currentScreen.key = storeState.currentScreenKey;
  result.currentScreen.val = storeState.screens[result.currentScreen.key];

  if (!result.currentScreen.val) return result;

  result.currentProject.key = result.currentScreen.val.projectKey;
  result.currentProject.val = storeState.projects[result.currentProject.key];

  return result;
}
