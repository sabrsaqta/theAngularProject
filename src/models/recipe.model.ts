// export interface Recipe {
//     id: string;
//     title: string;
//     image: string;
//     summary: string;
//     readyInMinutes: number;
//     servings: number;
//     spoonacularScore: number;
//     pricePerServing: number;
//     dishTypes: string[];
// }
export interface Recipe {
    id: string;
    title: string;
    image: string;
    instructions: string;
    ingredients: string[];
    summary: string;
    isFavorite?: boolean;
    dishTypes?: string[];
    pricePerServing?: number;
    readyInMinutes?: number;
    servings?: number;
}

export interface RecipeSearchResult {
    id: number;
    title: string;
    image: string;
    isFavorite: boolean;
}


export interface Ingredient {
    name: string;
    amount: number;
    unit: string;
}

export interface RecipesState {
    searchResults: RecipeSearchResult[];
    selectedRecipe: Recipe | null;
    listLoading: boolean;
    listError: string | null;
    searchTerm: string | null;   // текущее поисковое слово
    detailsLoading: boolean;
    detailsError: string | null;
    currentOffset: number;    
  totalResults: number;     
  resultsPerPage: number;
}

export const initialRecipesState: RecipesState = {
  searchResults: [],
  listLoading: false,
  listError: null,

  selectedRecipe: null,
  detailsLoading: false,
  detailsError: null,
  searchTerm: null,

  currentOffset: 0,   
  totalResults: 0,    
  resultsPerPage: 3,
};