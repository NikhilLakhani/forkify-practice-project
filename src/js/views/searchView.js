class SearchView {
  _parentElement = document.querySelector('.search');

  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }
  addHandelerSearch(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }

  getSearchText() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }
}

export default new SearchView();
