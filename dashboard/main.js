const getEl = (selector) => document.querySelector(selector);

const makeEl = (tagName = 'div', text, className) => {
  const el = document.createElement(tagName);

  if (text) el.appendChild(document.createTextNode(text));

  if (className) el.className = className;

  return el;
};

function makeUserDom(users) {
  const tableEl = makeEl('table', null, 'user-table');

  const headerRowEl = makeEl('tr', null, 'user-table-header');
  headerRowEl.appendChild(makeEl('th', 'Name'));
  headerRowEl.appendChild(makeEl('th', 'Key'));
  headerRowEl.appendChild(makeEl('th', 'Boxes'));
  headerRowEl.appendChild(makeEl('th', 'Last sign in (local)'));
  tableEl.appendChild(headerRowEl);

  users.forEach(user => {
    const rowEl = makeEl('tr', null, 'user-row');
    rowEl.appendChild(makeEl('td', user.name));
    rowEl.appendChild(makeEl('td', user.key));
    rowEl.appendChild(makeEl('td', user.boxCount));
    rowEl.appendChild(makeEl('td', new Date(user.lastSignIn).toLocaleString()));

    tableEl.appendChild(rowEl);
  });

  return Promise.resolve(tableEl);
}

function getUsers() {
  return fetch('/data')
  .then(response => response.json())
  .then(data => {
    return Promise.resolve(data);
  });
}

function render() {
  getUsers()
  .then(makeUserDom)
  .then(userDom => {
    getEl('.user-wrapper').appendChild(userDom);
  })
  .catch(err => {
    console.log('Error fetching data:', err);
  });
}

render();
