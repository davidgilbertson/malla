$.getJSON('http://localhost:8080/project/my-project/-KHsVe7tntzpJBp0p5zH.json', data => {
  $('[data-malla]').each((i, el) => {
    el.textContent = data[el.dataset.malla];
  });
});
