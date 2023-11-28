import { async } from 'regenerator-runtime';
import { ajaxRequest } from './helper';
import { API_KEY, API_URL, RESULTS_PRE_PAGE } from './config';
export const state = {
  recipe: {},
  search: {
    text: '',
    result: [],
    currPage: 1,
  },
  bookmarks: [],
};

function createRecipeObj(responseJson) {
  const { recipe } = responseJson.data;
  return {
    id: recipe.id,
    imageUrl: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    cookingTime: recipe.cooking_time,
    ...(recipe.key && { key: recipe.key }),
  };
}

export async function loadRecipeDetails(recipeId) {
  try {
    const responseJson = await ajaxRequest(
      `${API_URL}${recipeId}?key=${API_KEY}`
    );
    if (!responseJson) return;
    state.recipe = createRecipeObj(responseJson);

    if (state.bookmarks.some(bookmark => bookmark.id === recipeId)) {
      state.recipe.bookmarked = true;
    } else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
}

export async function loadAllRecipes(searchText) {
  try {
    state.search.text = searchText;
    const responseJson = await ajaxRequest(
      `${API_URL}?search=${searchText}&key=${API_KEY}`
    );
    if (!responseJson) return;
    state.search.result = responseJson.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        imageUrl: recipe.image_url,
        publisher: recipe.publisher,
        title: recipe.title,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    state.search.currPage = 1;
  } catch (err) {
    throw err;
  }
}

export function getSearchResultsPage(page = state.search.currPage) {
  state.search.currPage = page;
  const start = (page - 1) * RESULTS_PRE_PAGE;
  const end = page * RESULTS_PRE_PAGE;
  return state.search.result.slice(start, end);
}

export function updateServings(newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity *= newServings / state.recipe.servings;
  });
  state.recipe.servings = newServings;
}

function persistBookmarks() {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export function addBookmark(recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
}

export function deleteBookmark(id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }
  persistBookmarks();
}

export async function uploadRecipe(newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(entry => {
        const ingArr = entry[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3) throw new Error('Wrong ingredient format!');
        const [quantity, unit, description] = ingArr;

        return {
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
      servings: +newRecipe.servings,
      publisher: newRecipe.publisher,
    };

    const data = await ajaxRequest(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObj(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
}

function init() {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
}
init();
