export function getUrlForScreenKey(store, screenKey) {
  const storeState = store.getState();
  const screen = storeState.screens[screenKey];
  const projectSlug = storeState.projects[screen.projectKey].slug;

  return `/s/${screenKey}/${projectSlug}/${screen.slug}`;
}
