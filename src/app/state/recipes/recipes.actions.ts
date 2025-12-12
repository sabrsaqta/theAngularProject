import { createAction, props } from '@ngrx/store';
import { RecipeSearchResult, Recipe } from '../../../models/recipe.model';

//поиск
export const searchRecipes = createAction(
  '[Recipe Search] Search Recipes',
  props<{ searchTerm: string }>() // передаем поисковый запрос
);

export const searchRecipesSuccess = createAction(
  '[Recipe Search] Search Recipes Success',
  props<{ results: RecipeSearchResult[] }>()
);

export const searchRecipesFailure = createAction(
  '[Recipe Search] Search Recipes Failure',
  props<{ error: string }>()
);

//детали
export const loadRecipeDetails = createAction(
  '[Recipe Details] Load Recipe Details',
  props<{ recipeId: string }>()
);

export const loadRecipeDetailsSuccess = createAction(
  '[Recipe Details] Load Recipe Details Success',
  props<{ recipe: Recipe }>()
);

export const loadRecipeDetailsFailure = createAction(
  '[Recipe Details] Load Recipe Details Failure',
  props<{ error: string }>()
);


// запрос на добавление
export const addFavorite = createAction(
  '[Recipe] Add Favorite',
  props<{ recipeId: string }>()
);

// успех
export const addFavoriteSuccess = createAction(
  '[Recipe] Add Favorite Success'
);

// ошибка
export const addFavoriteFailure = createAction(
  '[Recipe] Add Favorite Failure',
  props<{ error: string }>()
);

// запрос на удаление
export const removeFavorite = createAction(
  '[Recipe] Remove Favorite',
  props<{ recipeId: string }>()
);

// успех
export const removeFavoriteSuccess = createAction(
  '[Recipe] Remove Favorite Success'
);

// ошибка
export const removeFavoriteFailure = createAction(
  '[Recipe] Remove Favorite Failure',
  props<{ error: string }>()
);
