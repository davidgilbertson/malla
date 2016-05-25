export function getEventDims(e) {
  const dims = e.touches ? e.touches[0] : e;

  return {
    x: dims.pageX,
    y: dims.pageY,
  };
}
