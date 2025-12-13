import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store'; 
import { RecipesState, RecipeSearchResult } from '../../../models/recipe.model';
import * as RecipesActions from '../../state/recipes/recipes.actions';
import * as RecipesSelectors from '../../state/recipes/recipes.selectors';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { RecipeCardComponent } from '../../components/recipe-card/recipe-card.component';
import { debounceTime, distinctUntilChanged, map, take } from 'rxjs/operators';


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

  currentOffset$!: Observable<number>;
  totalResults$!: Observable<number>;
  resultsPerPage$!: Observable<number>;

  canGoBack$!: Observable<boolean>;
  canGoForward$!: Observable<boolean>;
  currentPage$!: Observable<number>;

  ngOnInit(): void {
    // подписка на состояние из Store
    this.searchResults$ = this.store.select(RecipesSelectors.selectSearchResults);
    this.isLoading$ = this.store.select(RecipesSelectors.selectListLoading);
    this.error$ = this.store.select(RecipesSelectors.selectListError);

    this.currentOffset$ = this.store.select(RecipesSelectors.selectCurrentOffset);
    this.totalResults$ = this.store.select(RecipesSelectors.selectTotalResults);
    this.resultsPerPage$ = this.store.select(RecipesSelectors.selectResultsPerPage);

    const paginationData$ = combineLatest([
      this.currentOffset$,
      this.totalResults$,
      this.resultsPerPage$
    ]);

    this.canGoBack$ = this.currentOffset$.pipe(
      map(offset => offset > 0)
    );

    this.canGoForward$ = paginationData$.pipe(
      map(([offset, total, perPage]) => (offset + perPage) < total)
    );
    
    this.currentPage$ = paginationData$.pipe(
        map(([offset, total, perPage]) => Math.floor(offset / perPage) + 1)
    );

    // слушаем изменения в поле поиска и диспатчим Action
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(searchTerm => {
        if (searchTerm && searchTerm.length > 2) { 
          this.store.dispatch(RecipesActions.searchRecipes({ searchTerm, offset: 0 }));
        }
      });
    
      //дефолтный поиск
    this.store.dispatch(RecipesActions.searchRecipes({ searchTerm: 'pasta', offset: 0 }));
  }

  goToPage(direction: 'next' | 'prev'): void {
    // take(1), чтобы получить текущие значения и сразу отписаться
    combineLatest([this.currentOffset$, this.resultsPerPage$])
      .pipe(map(([offset, perPage]) => ({ offset, perPage })), take(1))
      .subscribe(({ offset, perPage }) => {
        let newOffset = offset;

        if (direction === 'next') {
          newOffset += perPage;
        } else if (direction === 'prev') {
          newOffset = Math.max(0, offset - perPage);
        }
        
        // диспатчим Action changePage, который эффект превратит в searchRecipes
        if (newOffset !== offset) {
          this.store.dispatch(RecipesActions.changePage({ offset: newOffset }));
        }
      });
  }
}