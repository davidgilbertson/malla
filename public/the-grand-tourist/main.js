$.getJSON('http://www.malla.io/project/my-project/-KHsXeM-W6ZJmLE_HN5f.json', data => {
  $('[data-malla]').each((i, el) => {
    el.textContent = data[el.dataset.malla];
  });
});
