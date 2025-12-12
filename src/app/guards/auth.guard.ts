import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router); //перенаправление если залогинен

  return authService.isLoggedIn$.pipe(
    take(1), // Берем только одно значение и завершаем поток
    tap(isLoggedIn => {
      if (!isLoggedIn) {
        console.log('Access denied: User is not logged in.');
        router.navigate(['/login']);
      }
    }),
    map(isLoggedIn => isLoggedIn)
  );
};