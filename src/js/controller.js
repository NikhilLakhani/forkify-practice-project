import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import bookmarksView from './views/bookmarksView.js';
import searchPaginationView from './views/searchPaginationView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODAL_CLOSE_SEC } from './config.js';

// if (module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

async function searchAllRecipes() {
  try {
    resultView.renderSpinner();
    const text = searchView.getSearchText();
    if (!text) return;
    await model.loadAllRecipes(text);
    resultView.renderData(model.getSearchResultsPage());
    searchPaginationView.renderData(model.state.search);
  } catch (err) {
    console.error(err);
    resultView.renderError();
  }
}

function changesearchPagination(change) {
  if (change > 0) {
    model.state.search.currPage++;
  } else {
    model.state.search.currPage--;
  }
  resultView.renderData(
    model.getSearchResultsPage(model.state.search.currPage)
  );
  searchPaginationView.renderData(model.state.search);
}

async function getRecipeDetails() {
  try {
    const recipeId = window.location.hash.slice(1);
    if (!recipeId) return;
    recipeView.renderSpinner();
    resultView.update(model.getSearchResultsPage(model.state.search.currPage));
    await model.loadRecipeDetails(recipeId);
    recipeView.renderData(model.state.recipe);
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
}
function changeServings(newServings) {
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
}

function toggleBookmarkController() {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  recipeView.update(model.state.recipe);
  bookmarksView.renderData(model.state.bookmarks);
}

function renderInitBookmarks() {
  bookmarksView.renderData(model.state.bookmarks);
}

async function addRecipeController(newRecipe) {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    recipeView.renderData(model.state.recipe);
    addRecipeView.renderMessage();
    bookmarksView.renderData();
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
}

function init() {
  bookmarksView.addHandlerRender(renderInitBookmarks);
  recipeView.addHandelerRecipeDetails(getRecipeDetails);
  recipeView.addHandelerServings(changeServings);
  recipeView.addHandelerBookmark(toggleBookmarkController);
  searchView.addHandelerSearch(searchAllRecipes);
  searchPaginationView.addHandelerPagination(changesearchPagination);
  addRecipeView.addHandlerSubmit(addRecipeController);
}
init();
