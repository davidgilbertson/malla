$.getJSON('https://www.malla.io/api/-KKutKrEc6WI4rLE8j3D.json', data => {
  $('[data-malla]').each((i, el) => {
    el.innerHTML = data[el.dataset.malla];
  });
});
