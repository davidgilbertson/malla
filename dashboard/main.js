const getEl = (selector) => document.querySelector(selector);

const makeEl = (tagName = 'div', text, className) => {
  const el = document.createElement(tagName);

  if (text) el.appendChild(document.createTextNode(text));

  if (className) el.className = className;

  return el;
};

const fetchJson = url => fetch(url).then(response => response.json());

function makeFeedbackDom(feedback) {
  feedback.sort((a, b) => {
    const aDate = +new Date(a.date);
    const bDate = +new Date(b.date);
    return bDate - aDate;
  });

  const tableEl = makeEl('table', null, 'user-table');

  const headerRowEl = makeEl('tr', null, 'user-table-header');
  headerRowEl.appendChild(makeEl('th', 'Comment'));
  headerRowEl.appendChild(makeEl('th', 'User'));
  headerRowEl.appendChild(makeEl('th', 'Date'));
  tableEl.appendChild(headerRowEl);

  feedback.forEach(comment => {
    const rowEl = makeEl('tr', null, 'comment-row');
    rowEl.appendChild(makeEl('td', comment.comment));
    rowEl.appendChild(makeEl('td', comment.user.name));
    rowEl.appendChild(makeEl('td', new Date(comment.date).toLocaleString()));

    tableEl.appendChild(rowEl);
  });

  return Promise.resolve(tableEl);
}

function makeUserDom(users) {
  users.sort((a, b) => {
    const aDate = +new Date(a.lastSignIn);
    const bDate = +new Date(b.lastSignIn);
    return bDate - aDate;
  });

  const tableEl = makeEl('table', null, 'user-table');

  const headerRowEl = makeEl('tr', null, 'user-table-header');
  headerRowEl.appendChild(makeEl('th', `Name (${users.length})`));
  headerRowEl.appendChild(makeEl('th', 'Boxes'));
  headerRowEl.appendChild(makeEl('th', 'Screens'));
  headerRowEl.appendChild(makeEl('th', 'Last sign in (local)'));
  headerRowEl.appendChild(makeEl('th', 'Key'));
  tableEl.appendChild(headerRowEl);

  users.forEach(user => {
    const rowEl = makeEl('tr', null, 'user-row');
    rowEl.appendChild(makeEl('td', user.name));
    rowEl.appendChild(makeEl('td', user.boxCount));
    rowEl.appendChild(makeEl('td', user.screenCount));
    rowEl.appendChild(makeEl('td', new Date(user.lastSignIn).toLocaleString()));
    rowEl.appendChild(makeEl('td', user.key));

    tableEl.appendChild(rowEl);
  });

  return Promise.resolve(tableEl);
}

function renderFeedback() {
  fetchJson('/metadata/feedback')
    .then(makeFeedbackDom)
    .then(dom => {
      getEl('.feedback-wrapper').appendChild(dom);
    })
    .catch(err => {
      console.log('Error fetching data:', err);
    });
}

function renderUsers() {
  fetchJson('/users')
    .then(makeUserDom)
    .then(dom => {
      getEl('.user-wrapper').appendChild(dom);
    })
    .catch(err => {
      console.log('Error fetching data:', err);
    });
}

renderFeedback();
renderUsers();
