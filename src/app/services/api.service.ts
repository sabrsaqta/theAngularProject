import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, of, withLatestFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { FavoritesService } from './favorites.service';
import { Recipe, RecipeSearchResult } from '../../models/recipe.model';



@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http: HttpClient = inject(HttpClient);
  private favoritesService = inject(FavoritesService); //инъекция сервиса избранных
  private baseUrl: string = environment.externalApiUrl; 
  private apiKey: string = '7147e83ebb654303badd627c54c51e73';
  constructor() { }

  searchRecipes(query: string): Observable<{ results: RecipeSearchResult[]; totalResults: number }> {
    if (!query || query.length < 2) {
        return of({ results: [], totalResults: 0 });
    }

    const params = new HttpParams()
        .set("query", query)
        .set("number", "5")
        .set("apiKey", this.apiKey);

    return this.http.get<{ results: RecipeSearchResult[]; totalResults: number }>(
        `${this.baseUrl}recipes/complexSearch`,
        { params }
    );
}

  getRecipeDetails(id: string): Observable<Recipe> {
    const params = new HttpParams()
      .set('apiKey', this.apiKey)

    return this.http.get<Recipe>(
        `${this.baseUrl}recipes/${id}/information`, 
        { params }
    ).pipe(
        withLatestFrom(this.favoritesService.favorites$),
        
        map(([recipe, favoriteIds]) => {
            const favs: string[] = favoriteIds || []; 

            const fullRecipe: Recipe = {
                ...recipe,
                isFavorite: favs.includes(recipe.id.toString())
            };
            return fullRecipe;
        })
    );
  }
}
