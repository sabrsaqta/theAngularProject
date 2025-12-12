import { createFeatureSelector, createSelector } from '@ngrx/store';

import { RecipesState } from '../../../models/recipe.model'; 


export const selectRecipesState = createFeatureSelector<RecipesState>('recipes');


export const selectSearchResults = createSelector(
  selectRecipesState,
  (state: RecipesState) => state.searchResults 
);

// получаем флаг загрузки списка
export const selectListLoading = createSelector(
  selectRecipesState,
  (state: RecipesState) => state.listLoading
);

// получаем сообщение об ошибке списка
export const selectListError = createSelector(
  selectRecipesState,
  (state: RecipesState) => state.listError
);

// детали
export const selectSelectedRecipe = createSelector(
  selectRecipesState,
  (state: RecipesState) => state.selectedRecipe
);

// получаем флаг загрузки детали
export const selectDetailsLoading = createSelector(
  selectRecipesState,
  (state: RecipesState) => state.detailsLoading
);

// получаем сообщение об ошибке детали
export const selectDetailsError = createSelector(
  selectRecipesState,
  (state: RecipesState) => state.detailsError
);