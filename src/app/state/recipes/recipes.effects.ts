import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ApiService } from '../../services/api.service'; 
import * as RecipesActions from './recipes.actions';
import { catchError, debounceTime, filter, map, switchMap, take } from 'rxjs/operators';
import { from, of } from 'rxjs';
import * as RecipesSelectors from './recipes.selectors';


import { tap } from 'rxjs/operators';
import { FavoritesService } from '../../services/favorites.service';
import { Store } from '@ngrx/store';


@Injectable()
export class RecipesEffects {
  
  private actions$ = inject(Actions);
  private apiService = inject(ApiService); 
  private favoritesService = inject(FavoritesService);
  private store = inject(Store);

  searchRecipes$ = createEffect(() =>
    this.actions$.pipe(
      // слушаем наш action поиска
      ofType(RecipesActions.searchRecipes), 
      
      // debounceTime(300), 
      //отмена запроса при новом
      switchMap(({ searchTerm }) => {
        console.log('--- API Call triggered for:', searchTerm);
        return this.apiService.searchRecipes(searchTerm).pipe(
          // при успехе диспатчим Success
          map(data => 
            RecipesActions.searchRecipesSuccess({ results: data.results })
          ), 
          
          // при ошибке диспатчим Failure
          catchError((error) => 
            of(RecipesActions.searchRecipesFailure({ error: 'Ошибка поиска рецептов.' }))
          )
        );
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
        const serviceCall = isAdding 
                            ? this.favoritesService.addFavorite(action.recipeId)
                            : this.favoritesService.removeFavorite(action.recipeId);

        return from(serviceCall).pipe(
          // успех - Firestore обновил данные
          map(() => {
            // диспатчим Action успеха, и затем перезапускаем поиск в компоненте.
            return isAdding 
              ? RecipesActions.addFavoriteSuccess() 
              : RecipesActions.removeFavoriteSuccess();
          }),
          // tap для перезапуска поиска
          tap(() => {
             // для метки перезапуск поиска
             this.store.select(RecipesSelectors.selectRecipesState).pipe(
                map(state => state.searchTerm),
                filter((term): term is string => !!term),
                take(1)
             ).subscribe(searchTerm => {
                this.store.dispatch(RecipesActions.searchRecipes({ searchTerm }));
             });
          }),
          // при ошибке
          catchError((error) => {
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