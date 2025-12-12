import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ParamMap, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';


import * as RecipesActions from '../../state/recipes/recipes.actions';
import * as RecipesSelectors from '../../state/recipes/recipes.selectors';
import { Recipe, RecipesState } from '../../../models/recipe.model';

@Component({
  selector: 'app-recipe-details',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './recipe-details.component.html',
  styleUrl: './recipe-details.component.css'
})
export class RecipeDetailsComponent implements OnInit {
  
  private store = inject(Store<{ recipes: RecipesState }>);
  private route = inject(ActivatedRoute);

  selectedRecipe$!: Observable<Recipe | null>;
  isLoading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  ngOnInit(): void {
    
    // подписка на селекторы для получения состояния
    this.selectedRecipe$ = this.store.select(RecipesSelectors.selectSelectedRecipe);
    this.isLoading$ = this.store.select(RecipesSelectors.selectDetailsLoading);
    this.error$ = this.store.select(RecipesSelectors.selectDetailsError);

    // извлечение id из url и диспатч Action
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const recipeId = params.get('id'); 
        if (recipeId) {
          this.store.dispatch(RecipesActions.loadRecipeDetails({ recipeId })); 
        }
        return new Observable(); 
      })
    ).subscribe();
  }

  toggleFavorite(recipeId: string): void {
    console.log(`Toggling favorite status for recipe: ${recipeId}`);
  }
}