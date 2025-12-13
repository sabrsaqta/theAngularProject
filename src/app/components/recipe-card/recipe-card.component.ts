import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe, RecipeSearchResult } from '../../../models/recipe.model';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import * as RecipesActions from '../../state/recipes/recipes.actions';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css'
})
export class RecipeCardComponent {
  
  // принимает упрощенный объект рецепта из списка
  @Input({ required: true }) recipe!: Recipe | RecipeSearchResult;
  
  private store = inject(Store);

  //переход на страницу карточка
  viewDetails(id: string): void {
    // диспатчим Action, который будет перехвачен Effects, который загрузит полные детали
    this.store.dispatch(RecipesActions.loadRecipeDetails({ recipeId: id }));
  }

  // добавления/удаления из избранного (логику добавим позже)
  toggleFavorite(event: Event): void {
    // остановка события, чтобы не сработал viewDetails
    event.stopPropagation(); 
    const recipeId = this.recipe.id.toString();

    if (this.recipe.isFavorite) {
      this.store.dispatch(RecipesActions.removeFavorite({ recipeId }));
    } else {
      this.store.dispatch(RecipesActions.addFavorite({ recipeId }));
    }

    console.log('Toggle Favorite clicked for ID:', this.recipe.id);
  }
}