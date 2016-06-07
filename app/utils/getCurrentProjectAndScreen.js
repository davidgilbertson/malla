export function getCurrentProjectAndScreen(storeState) {
  const currentScreenKey = storeState.currentScreenKey;
  const currentScreen = storeState.screens[currentScreenKey];
  const currentProjectKey = currentScreen.projectKey;
  const currentProject = storeState.projects[currentProjectKey];

  return {
    currentProject: {
      key: currentProjectKey,
      val: currentProject,
    },
    currentScreen: {
      key: currentScreenKey,
      val: currentScreen,
    },
  };
}
