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
}

export const initialState: RecipesState = {
  searchResults: [],
  selectedRecipe: null,
  listLoading: false,
  detailsLoading: false,
  listError: null,
  detailsError: null,
  searchTerm: null,
};

export const recipesReducer = createReducer(
  initialState,

  //загрузка списка
  on(RecipesActions.searchRecipes, (state, { searchTerm }) => ({
    ...state, 
    listLoading: true, // включаем спиннер
    listError: null,     // сброс ошибку
    searchResults: [], // очищаем старые результаты
    searchTerm: searchTerm, // сохраняем поисковый запрос
  })),

  //успешное получение результатов
  on(RecipesActions.searchRecipesSuccess, (state, { results }) => ({
    ...state,
    searchResults: results, // записываем полученный список
    listLoading: false,       // выключаем спиннер
    listError: null,
  })),

  on(RecipesActions.searchRecipesFailure, (state, { error }) => ({
    ...state,
    listLoading: false,
    listError: error, // записываем сообщение об ошибке
    searchResults: [], 
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