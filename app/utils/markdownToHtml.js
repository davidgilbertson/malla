const md = require('markdown-it')();

md.use(require('markdown-it-sup'));
md.use(require('markdown-it-sub'));

export function markdownToHtml(markdown) {
  let html = md.render(markdown);

  // the markdown engine wraps an inline bit of text in a <p> which is dumb
  // so if the only top-level thing is a <p>, just return its contents
  const testDom = document.createElement('div');
  testDom.innerHTML = html;

  if (testDom.childElementCount === 1 && testDom.children[0].nodeName.toLowerCase() === 'p') {
    html = testDom.children[0].innerHTML;
  }
  
  return html;
}
