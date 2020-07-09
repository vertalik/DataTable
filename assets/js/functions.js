'use strict';

async function initApp() {
  createTableHead(table);
  await api(DEFAULT_LIMIT, 0);
  createTableFooter();
}

function api(limit = DEFAULT_LIMIT, skip = 0, page=1) {
  removeChild(table, 1);
  const loader = createHtmlElement('', '', 'div', ['lds-dual-ring']);
  table.insertAdjacentElement('afterend', loader);
  fetch(`${BASE_URL}?limit=${limit}&skip=${skip}&order_by=number&order=desc`)
    .then((response) => {
      if (response.ok) {
        loader.remove();
        return response.json();
      } else {
        throw new Error('Something wrong!');
      }
    })
    .then(content => {
      totalPosts = Number(content.total);
      const sorted = sortByPosts(content.data);
      return sorted;
    })
    .then((sortedData) => {
      sortedData.forEach((post, index) => {
        fragment.appendChild(createTableRowHtml(post, index + skip));
      });
      table.appendChild(fragment);
      createPagination(page);
    })
    .catch((err) => console.log(err));
}

function createTableHead(parent) {
  const tableHead = createHtmlElement(parent, '', 'tr', ['main-table__head']);
  const tableNumber = createHtmlElement(tableHead, '№', 'th', ['main-table__number']);
  const tableCity = createHtmlElement(tableHead, 'City', 'th', ['main-table__city']);
  const tableName = createHtmlElement(tableHead, 'Post', 'th', ['main-table__post']);
  const arrowPosts = createHtmlElement(tableName, '', 'strong', ['sort-arrow__down']);
  arrowPosts.dataset.sort = 'down';
  arrowPosts.addEventListener('click', e => {
    changeSortArrow(e.target);
    const getLimit = document.querySelector('.limit__input');
    api(Number(getLimit.value));
  })
}

function createTableFooter() {
  let currerntLimit = DEFAULT_LIMIT;
  const footer = createHtmlElement(app, '', 'div', ['footer__wrapper']);
  const label = createHtmlElement(footer, 'Limits:', 'label', ['limits__label']);
  const limitSet = createHtmlElement(label, '', 'select', ['limit__input']);
  for (let i = DEFAULT_LIMIT; i <= MAX_LIMIT; i += DEFAULT_LIMIT) {
    createHtmlElement(limitSet, i, 'option', []);
  }
  limitSet.addEventListener('change', (e) => {
    currerntLimit = Number(e.target.value);
    api(currerntLimit);
  });
  const paginationBlock = createHtmlElement(footer, '', 'div', ['pagination__wrapper']);
  paginationBlock.addEventListener('click', (e) => {
    
    if (e.target.classList.contains('page__btn')) {
      const selectedPage = Number(e.target.dataset.page);
      const skip = selectedPage * currerntLimit - currerntLimit;
      api(currerntLimit, skip,selectedPage);
    }
    if (e.target.classList.contains('other__btn')) {
      const allPaginationBtn = document.querySelectorAll('.page__btn');
      for (let page of allPaginationBtn) {
        if (page.classList.contains('hide__btn')) {
          page.classList.remove('hide__btn');
        }
      }
      e.target.remove();
    }
  });
}

function createPagination(numberActivePage = 1) {
  const pagination = document.querySelector('.pagination__wrapper');
  const limits = Number(document.querySelector('.limit__input').value);
  removeChild(pagination, 0);
  for (let page = 1; page <= Math.ceil(totalPosts / limits); page++) {
    if (page <= 10 ) {
      const pageBtn = createHtmlElement(pagination, page, 'button', ['page__btn']);
      pageBtn.dataset.page = page;
      if (numberActivePage === page) {
        pageBtn.classList.add('active-page');
      }
    } else if (page > 10 && page <= Math.floor(totalPosts / limits)) {
      const pageBtn = createHtmlElement(pagination, page, 'button', ['page__btn','hide__btn']);
      pageBtn.dataset.page = page;
      if (numberActivePage === page) {
        pageBtn.classList.add('active-page');
      }
    } 
  }
  const dots = createHtmlElement(pagination, '...', 'button', ['other__btn']);
  if (numberActivePage > 10) {
    dots.classList.add('active-page');
  }
}
