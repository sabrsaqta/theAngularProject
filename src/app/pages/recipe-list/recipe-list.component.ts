import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store'; 
import { RecipesState, RecipeSearchResult } from '../../../models/recipe.model';
import * as RecipesActions from '../../state/recipes/recipes.actions';
import * as RecipesSelectors from '../../state/recipes/recipes.selectors';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { RecipeCardComponent } from '../../components/recipe-card/recipe-card.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RecipeCardComponent], 
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css'
})
export class RecipeListComponent implements OnInit {
  
  private store = inject(Store<{ recipes: RecipesState }>);
  
  //форма поиска реакт
  searchControl = new FormControl(''); 
  

  searchResults$!: Observable<RecipeSearchResult[]>;
  isLoading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  ngOnInit(): void {
    // подписка на состояние из Store
    this.searchResults$ = this.store.select(RecipesSelectors.selectSearchResults);
    this.isLoading$ = this.store.select(RecipesSelectors.selectListLoading);
    this.error$ = this.store.select(RecipesSelectors.selectListError);

    // слушаем изменения в поле поиска и диспатчим Action
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(searchTerm => {
        // диспатчим Action только если запрос не пустой и длиннее 2
        if (searchTerm && searchTerm.length > 2) { 
          // диспатчим Action, перехвачен NgRx Effects (с debounceTime/switchMap)
          this.store.dispatch(RecipesActions.searchRecipes({ searchTerm }));
        }
      });
    
      //дефолтный поиск
    this.store.dispatch(RecipesActions.searchRecipes({ searchTerm: 'pasta' }));
  }
}