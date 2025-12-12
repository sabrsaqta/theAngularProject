import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { RecipeListComponent } from './pages/recipe-list/recipe-list.component';
import { RecipeDetailsComponent } from './pages/recipe-details/recipe-details.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },

  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  { path: 'recipes', component: RecipeListComponent }, // Items List
  { path: 'recipe/:id', component: RecipeDetailsComponent }, // Item Details

  { path: 'favorites', component: FavoritesComponent, canActivate: [authGuard] }, 
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },     // Protected page

  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
