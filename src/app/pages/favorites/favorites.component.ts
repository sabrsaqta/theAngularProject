import { Component, inject } from '@angular/core';
import { FavoritesService } from '../../services/favorites.service';
import { ApiService } from '../../services/api.service';
import { Recipe } from '../../../models/recipe.model';
import { Observable, switchMap, map, of, forkJoin, catchError } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RecipeCardComponent } from '../../components/recipe-card/recipe-card.component';

@Component({
  selector: 'app-favorites',
  imports: [CommonModule, RouterModule, AsyncPipe, RecipeCardComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent {
  private favoritesService = inject(FavoritesService);
  private apiService = inject(ApiService);

  public favoriteRecipes$: Observable<Recipe[]>;
  public isLoading: boolean = true;

  constructor() {
    this.favoriteRecipes$ = this.favoritesService.favorites$.pipe(
      // гет массив с айди из firestore
      switchMap(recipeIds => {
        console.log('FavoritesComponent (Data Check): IDs received from service:', recipeIds);
        this.isLoading = true;
        
        if (!recipeIds || recipeIds.length === 0) {
          this.isLoading = false;
          return of([]); 
        }
        const uniqueRecipeIds = [...new Set(recipeIds)];
        console.log(`FavoritesComponent (Data Check): Original IDs count: ${recipeIds.length}, Unique IDs count: ${uniqueRecipeIds.length}`);


        // для каждого айди создаем поток, который загружает детали
        const detailRequests = uniqueRecipeIds.map(id => 
          this.apiService.getRecipeDetails(id).pipe(
            // если запрос деталей одного рецепта падает, возвращаем null, чтобы не сломать весь поток
            catchError(error => {
              console.error(`Failed to load details for recipe ID: ${id}`, error);
              return of(null); 
            })
          )
        );

        // forkJoin, чтобы дождаться завершения всех запросов
        return forkJoin(detailRequests).pipe(
          // фильтруем все неудачные запросы и устанавливаем флаг isFavorite
          map(recipes => {
            this.isLoading = false;
            const finalRecipes = recipes
                    .filter((recipe): recipe is Recipe => !!recipe)
                    .map(recipe => ({ 
                      ...recipe, 
                      isFavorite: true // устанавливаем isFavorite true, т.к этот рецепт в списке избранного
                    }));
            console.log('FavoritesComponent (Data Check): Final Recipe array COUNT:', finalRecipes.length, 'Items:', finalRecipes.map(r => r.id));
            return finalRecipes;
          })
        );
      }),
      // обработка ошибки всего потока
      catchError(error => {
        console.error('Failed to load favorites stream.', error);
        this.isLoading = false;
        return of([]); 
      })
    );
  }

  trackByRecipeId(index: number, recipe: Recipe): string {
    return recipe.id;
  }
}
