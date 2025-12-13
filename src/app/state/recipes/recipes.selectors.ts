import { createFeatureSelector, createSelector } from '@ngrx/store';

import { RecipesState } from '../../../models/recipe.model'; 


export const selectRecipesState = createFeatureSelector<RecipesState>('recipes');


export const selectSearchResults = createSelector(
  selectRecipesState,
  (state: RecipesState) => state.searchResults 
);
//для запроса
export const selectSearchTerm = createSelector(
  selectRecipesState,
  (state: RecipesState) => state.searchTerm // берем строку из стейта
);
//для пагинации
export const selectCurrentOffset = createSelector(
  selectRecipesState,
  (state: RecipesState) => state.currentOffset
);

export const selectTotalResults = createSelector(
  selectRecipesState,
  (state: RecipesState) => state.totalResults
);
export const selectResultsPerPage = createSelector(
  selectRecipesState,
  (state: RecipesState) => state.resultsPerPage
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
