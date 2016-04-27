export default () => {
  if (typeof window.performance === 'undefined') {
    return false;
  }

  if (typeof window.requestAnimationFrame === 'undefined') {
    return false;
  }

  return true;
};
