import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, withLatestFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { FavoritesService } from './favorites.service';
import { Recipe, RecipeSearchResult } from '../../models/recipe.model';
// import { query } from 'firebase/firestore';


// interface SearchResultWithFav extends RecipeSearchResult {
//   isFavorite?: boolean;
// }

// interface RecipeWithFav extends Recipe {
//   isFavorite?: boolean;
// }


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http: HttpClient = inject(HttpClient);
  private favoritesService = inject(FavoritesService); //инъекция сервиса избранных
  private baseUrl: string = environment.externalApiUrl; 
  private apiKey: string = '549afaa39c5b4a19a8cd58ee9c703449';
  constructor() { }

  searchRecipes(query: string): Observable<any> {
    if (!query || query.length < 2) {
      return new Observable(subscriber => {
        subscriber.next({ results: [], totalResults: 0 });
        subscriber.complete();
      });
    }

    const params = new HttpParams()
      .set('query', query)
      .set('number', '5')
      .set('apiKey', this.apiKey); 

    // return this.http.get<any>(`${this.baseUrl}recipes/complexSearch`, { params });
    // return this.http.get<{ results: RecipeSearchResult[], totalResults: number }>(
    //     `${this.baseUrl}recipes/complexSearch`, 
    //     { params }
    // ).pipe(
    //     // объединение результатов http-запроса с последним списком избранных id
    //     withLatestFrom(this.favoritesService.favorites$),
        
    //     // обрабатываем и объединяем данные
    //     map(([data, favoriteIds]) => {
    //         // favorites$ возвращает массив id или пустой массив
    //         const favs: string[] = favoriteIds || []; 

    //         // проходим по каждому и добавляем статус
    //         const resultsWithFavStatus: RecipeSearchResult] = data.results.map(recipe => ({
    //             ...recipe,
    //             // проверка, есть ли ID этого рецепта в массиве избранных
    //             isFavorite: favs.includes(recipe.id.toString()) 
    //         }));

    //         // возвращаем обновленный объект
    //         return { 
    //             results: resultsWithFavStatus, 
    //             totalResults: data.totalResults 
    //         };
    //     })
    // );
    return this.http.get<{ results: RecipeSearchResult[], totalResults: number }>(
        `${this.baseUrl}recipes/complexSearch`, 
        { params }
    ).pipe(
        // объединяем поток search$ с потоком favorites$
        withLatestFrom(this.favoritesService.favorites$),
        
        map(([data, favoriteIds]: [{ results: RecipeSearchResult[], totalResults: number }, string[]]) => {
            const favs: string[] = favoriteIds || []; 

            const resultsWithFavStatus: RecipeSearchResult[] = data.results.map(recipe => ({
                ...recipe,
                isFavorite: favs.includes(recipe.id.toString()) 
            }));

            return { 
                results: resultsWithFavStatus, 
                totalResults: data.totalResults 
            };
        })
    );
  }
  // getRecipeDetails(id: string): Observable<any> {
  //   const params = new HttpParams()
  //     .set('apiKey', this.apiKey)
  //     .set('includeNutrition', 'false');

  //   return this.http.get<any>(`${this.baseUrl}recipes/${id}/information`, { params }); //https://api.spoonacular.com/recipes/12345/information?apiKey=
  // }

  // getRecipeDetails(id: string): Observable<Recipe> {
  //   const params = new HttpParams()
  //     .set('apiKey', this.apiKey)
  //     .set('query', query)
  //     .set('number', '10');
  //     // .set('includeNutrition', 'false');

  //   return this.http.get<Recipe>(
  //       `${this.baseUrl}recipes/${id}/information`, 
  //       { params }
  //   ).pipe(
  //       // объединяем детали рецепта с последним списком избранных ID
  //       withLatestFrom(this.favoritesService.favorites$),
        
  //       // обрабатываем и добавляем статус
  //       map(([recipe, favoriteIds]) => {
  //           const favs: string[] = favoriteIds || []; 

  //           // создаем и возвращаем полный объект рецепта с флагом isFavorite
  //           const fullRecipe: Recipe = {
  //               ...recipe,
  //               // проверяем, есть ли ID этого рецепта в массиве избранных
  //               isFavorite: favs.includes(recipe.id.toString())
  //           };
  //           return fullRecipe;
  //       })
  //   );
  getRecipeDetails(id: string): Observable<Recipe> {
    const params = new HttpParams()
      .set('apiKey', this.apiKey)
      // .set('includeNutrition', 'false'); // Опционально

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
