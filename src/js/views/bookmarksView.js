import View from './view';
import previewView from './previewView';
import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errMsg = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _msg = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.renderData(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
