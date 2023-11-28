import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  /**
   * Render the recieved object to the DOM in the parent element specified by the child class
   * @param {Object|Object[]} data The data to be rendered
   * @param {boolean} [render=true] If false returns the markup string
   * @returns {undefined|string}
   * @this {Object} View instance
   */
  renderData(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDom.querySelectorAll('*'));
    const currElements = Array.from(this._parentElement.querySelectorAll('*'));
    newElements.forEach((newEle, i) => {
      const currEle = currElements[i];
      if (
        !newEle.isEqualNode(currEle) &&
        newEle.firstChild?.nodeValue.trim() !== ''
      ) {
        currEle.textContent = newEle.textContent;
      }

      if (!newEle.isEqualNode(currEle)) {
        Array.from(newEle.attributes).forEach((newAttr, i) => {
          currEle.setAttribute(newAttr.name, newAttr.value);
        });
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }
  renderSpinner() {
    this._clear();
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>`;
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(errMsg = this._errMsg) {
    const markup = `
      <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${errMsg}</p>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(msg = this._msg) {
    const markup = `
      <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${msg}</p>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
