import View from './view';
import previewView from './previewView';
import icons from 'url:../../img/icons.svg';

class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errMsg = 'No recipes found for your query. Please try again!';
  _msg = '';

  _generateMarkup() {
    return this._data
      .map(rec => {
        return previewView.renderData(rec, false);
      })
      .join('');
  }
}

export default new ResultView();
