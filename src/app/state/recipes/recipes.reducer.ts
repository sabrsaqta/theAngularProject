import { createReducer, on } from '@ngrx/store';
import { Recipe, RecipeSearchResult } from '../../../models/recipe.model';
import * as RecipesActions from './recipes.actions';


export interface RecipesState {
  searchResults: RecipeSearchResult[];          // список рецептов, отображаемый в ItemsListComponent
  selectedRecipe: Recipe | null; // выбранный рецепт (для ItemDetailsComponent)
  listLoading: boolean;     // флаг: идет ли загрузка списка
  detailsLoading: boolean;  // флаг: идет ли загрузка детали
  listError: string | null;   // сообщение об ошибке при загрузке списка
  detailsError: string | null; // при загрузке детали
  searchTerm: string | null;

  currentOffset: number;    // текущее смещение
  totalResults: number;  // Общее количество результато
  resultsPerPage: number; //Количество результатов на страницу
}

export const initialState: RecipesState = {
  searchResults: [],
  selectedRecipe: null,
  listLoading: false,
  detailsLoading: false,
  listError: null,
  detailsError: null,
  searchTerm: null,

  currentOffset: 0,
  totalResults: 0,
  resultsPerPage: 3,
};

export const recipesReducer = createReducer(
  initialState,

  //загрузка списка
  on(RecipesActions.searchRecipes, (state, { searchTerm, offset }) => ({
    ...state, 
    listLoading: true, // включаем спиннер
    listError: null,     // сброс ошибку
    // searchResults: [], // очищаем старые результаты
    // searchTerm: searchTerm, // сохраняем поисковый запрос
    searchResults: searchTerm === state.searchTerm ? state.searchResults : [], // очищаем, только если новый запрос
    searchTerm: searchTerm, // сохраняем поисковый запрос
    currentOffset: offset,
  })),

  //успешное получение результатов
  on(RecipesActions.searchRecipesSuccess, (state, { results, totalResults, currentOffset }) => ({
    ...state,
    searchResults: results, // записываем полученный список
    listLoading: false,       // выключаем спиннер
    listError: null,

    totalResults: totalResults, // сохраняем общее количество
    currentOffset: currentOffset,
  })),

  on(RecipesActions.searchRecipesFailure, (state, { error }) => ({
    ...state,
    listLoading: false,
    listError: error, // записываем сообщение об ошибке
    searchResults: [], 
  })),
  on(RecipesActions.changePage, (state, { offset }) => ({
      ...state,
      listLoading: true, // включаем спиннер
      listError: null,
      currentOffset: offset, // новый offset
  })),




  // инициирование загрузки деталей
  on(RecipesActions.loadRecipeDetails, (state) => ({
    ...state,
    detailsLoading: true,
    detailsError: null,
    selectedRecipe: null, // очищаем старые детали
  })),

  // успешное получение деталей
  on(RecipesActions.loadRecipeDetailsSuccess, (state, { recipe }) => ({
    ...state,
    selectedRecipe: recipe, // записываем выбранный рецепт
    detailsLoading: false,
    detailsError: null,
  })),

  on(RecipesActions.loadRecipeDetailsFailure, (state, { error }) => ({
    ...state,
    detailsLoading: false,
    detailsError: error,
    selectedRecipe: null,
  }))

)