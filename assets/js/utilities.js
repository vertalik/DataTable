'use strict';

function createHtmlElement(parent, elementName, elementTag, elementClassArr) {
  const el = document.createElement(elementTag);
  elementClassArr.forEach(classElement => {
    el.classList.add(classElement);
  });
  el.textContent = elementName;
  if (parent) {
    parent.appendChild(el);
  }
  return el;
}

function createTableRowHtml(post,index) {
  const tableRow = createHtmlElement('', '', 'tr', []);
  createHtmlElement(tableRow, index+1, 'td', []);
  createHtmlElement(tableRow, post.city, 'td', []);
  createHtmlElement(tableRow, post.name, 'td', []);

  return tableRow;
}

function removeChild(element, removeFromPosition) {
  while (element.children.length > removeFromPosition) {
    element.lastChild.remove();
 }
}

function changeSortArrow(element) {
  if (element.classList.contains('sort-arrow__down')) {
    element.classList.remove('sort-arrow__down');
    element.classList.add('sort-arrow__up');
    element.dataset.sort = 'up';
  } else if (element.classList.contains('sort-arrow__up')) {
    element.classList.remove('sort-arrow__up');
    element.classList.add('sort-arrow__down');
    element.dataset.sort = 'down';
  }
}

function sortByPosts(data) {
  const arrow = document.querySelector('strong');
  switch (arrow.dataset.sort) {
    case 'down': return data.sort((prev, next) => next.number - prev.number);
    case 'up': return data.sort((prev, next) => prev.number - next.number);
  }
}


