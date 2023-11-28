import { RESULTS_PRE_PAGE } from '../config';
import View from './view';
import icons from 'url:../../img/icons.svg';

class SearchPaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandelerPagination(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('button');
      if (!btn) return;
      if (btn.classList.contains('pagination__btn--next')) handler(1);
      else handler(-1);
      // handler();
    });
  }

  _generateMarkup() {
    const numOfPages = Math.ceil(this._data.result.length / RESULTS_PRE_PAGE);
    const currPage = this._data.currPage;

    const prevButton = `
      <button class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>  
      <span>Page ${currPage - 1}</span>
      </button>`;
    const nextButton = `
      <button class="btn--inline pagination__btn--next">
        <span>Page ${currPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>`;

    if (currPage === 1 && numOfPages > 1) {
      return nextButton;
    }
    if (currPage === 1) {
      return ``;
    }
    if (currPage < numOfPages) {
      return prevButton + nextButton;
    }
    if (currPage === numOfPages) {
      return prevButton;
    }
  }
}

export default new SearchPaginationView();
