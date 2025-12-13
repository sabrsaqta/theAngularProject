import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ApiService } from '../../services/api.service'; 
import * as RecipesActions from './recipes.actions';
import { catchError, debounceTime, filter, map, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { from, of } from 'rxjs';
import * as RecipesSelectors from './recipes.selectors';
import { RecipesState } from '../recipes/recipes.reducer';

import { tap } from 'rxjs/operators';
import { FavoritesService } from '../../services/favorites.service';
import { Store } from '@ngrx/store';


@Injectable()
export class RecipesEffects {
  
  private actions$ = inject(Actions);
  private apiService = inject(ApiService); 
  private favoritesService = inject(FavoritesService);
  private store = inject(Store<{ recipes: RecipesState }>);

  searchRecipes$ = createEffect(() =>
    this.actions$.pipe(
      // слушаем наш action поиска
      ofType(RecipesActions.searchRecipes), 
      
      debounceTime(300), 
      //отмена запроса при новом
      switchMap(({ searchTerm, offset }) => {
        console.log('--- API Call triggered for:', searchTerm);
        return this.apiService.searchRecipes(searchTerm, offset).pipe(
          // при успехе диспатчим Success
          map(data => 
            RecipesActions.searchRecipesSuccess({ results: data.results, totalResults: data.totalResults, currentOffset: offset })
          ), 
          
          // при ошибке диспатчим Failure
          catchError((error) => 
            of(RecipesActions.searchRecipesFailure({ error: 'Ошибка поиска рецептов.' }))
          )
        );
      })
    )
  );

  changePage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecipesActions.changePage),
      
      // запрос из стора
      withLatestFrom(this.store.select(RecipesSelectors.selectSearchTerm)), // Используем ваш существующий селектор
      
      // 0 - данные из changePage (offset), 1 - searchTerm
      map(([{ offset }, searchTerm]) => {
        if (!searchTerm) {
             // если нет поискового запроса, не запускаем поиск
             return RecipesActions.searchRecipesFailure({ error: 'Сначала введите поисковый запрос.'}); 
        }

        // диспатч фактический поиск (searchRecipes) с новым offset и старым query
        return RecipesActions.searchRecipes({ searchTerm, offset });
      })
    )
  );

  //загрузка деталей
  loadRecipeDetails$ = createEffect(() =>
    this.actions$.pipe(
      // слушаем action загрузки деталей
      ofType(RecipesActions.loadRecipeDetails),
      
      // отмена при быстром переключении страниц
      switchMap(({ recipeId }) => {
        return this.apiService.getRecipeDetails(recipeId).pipe(
          // при успехе диспатчим Success
          map(recipe => RecipesActions.loadRecipeDetailsSuccess({ recipe })),
          
          // при ошибке диспатчим Failure
          catchError((error) => 
            of(RecipesActions.loadRecipeDetailsFailure({ error: 'Ошибка загрузки деталей рецепта.' }))
          )
        );
      })
    )
  );


  toggleFavorite$ = createEffect(() =>
    this.actions$.pipe(
      // слушаем добавление/удаление
      ofType(RecipesActions.addFavorite, RecipesActions.removeFavorite),
      
      switchMap(action => {
        const isAdding = action.type === RecipesActions.addFavorite.type;
        const recipeId = action.recipeId;

        console.log(`Effect: Starting ${isAdding ? 'ADD' : 'REMOVE'} for ID: ${recipeId}`);
        const serviceCall = isAdding 
                            ? this.favoritesService.addFavorite(action.recipeId)
                            : this.favoritesService.removeFavorite(action.recipeId);

        return from(serviceCall).pipe(
          // успех - Firestore обновил данные
          map(() => {
            console.log(`Effect: Firestore operation SUCCESS for ID: ${recipeId}`);
            // диспатчим Action успеха, и затем перезапускаем поиск в компоненте.
            return isAdding 
              ? RecipesActions.addFavoriteSuccess() 
              : RecipesActions.removeFavoriteSuccess();
          }),
          // tap для перезапуска поиска
          // tap(() => {
          //   console.log('Effect: Re-dispatching search to update favorite list.');
          //    // для метки перезапуск поиска
          //    this.store.select(RecipesSelectors.selectRecipesState).pipe(
          //       map(state => state.searchTerm),
          //       filter((term): term is string => !!term),
          //       take(1)
          //    ).subscribe(searchTerm => {
          //       this.store.dispatch(RecipesActions.searchRecipes({ searchTerm }));
          //    });
          // }),
          tap(() => {
             this.store.select(RecipesSelectors.selectRecipesState).pipe(
                map(state => ({ 
                    searchTerm: state.searchTerm, 
                    currentOffset: state.currentOffset // Берем текущий offset
                })),
                filter((data): data is { searchTerm: string, currentOffset: number } => !!data.searchTerm),
                take(1)
             ).subscribe(({ searchTerm, currentOffset }) => {
                // Дипатчим поиск, сохраняя текущий offset
                this.store.dispatch(RecipesActions.searchRecipes({ searchTerm: searchTerm, offset: currentOffset }));
             });
          }),
          // при ошибке
          catchError((error) => {
            console.error(`Effect: Firestore operation FAILED for ID: ${recipeId}`, error);
            const errorMessage = 'Ошибка при работе с избранным.';
            return of(isAdding 
                      ? RecipesActions.addFavoriteFailure({ error: errorMessage }) 
                      : RecipesActions.removeFavoriteFailure({ error: errorMessage }));
          })
        );
      })
    )
    , { dispatch: true } // разрешаем диспатч Actions внутри эффекта
  );
}