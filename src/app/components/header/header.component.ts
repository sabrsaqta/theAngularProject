
// import { Component, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterLink, RouterLinkActive } from '@angular/router';
// import { AuthService } from '../../services/auth.service';
// import { Observable } from 'rxjs';

// @Component({
//   selector: 'app-header',
//   standalone: true,
//   imports: [CommonModule, RouterLink, RouterLinkActive],
//   templateUrl: './header.component.html',
//   styleUrls: ['./header.component.css']
// })
// export class HeaderComponent {
  
//   // сервис аутентификации
//   private authService: AuthService = inject(AuthService);
  
//   // переменная для шаблона. Следит за статусом входа.
//   isLoggedIn$: Observable<boolean> = this.authService.isLoggedIn$;
  
//   constructor() { }

//   // Метод для выхода. Метод logout общается с Firebase
//   onLogout(): void {
//     this.authService.logout().subscribe(() => {
//       console.log('Logged out successfully');
//       // после выхода Firebase обновляет isLoggedIn$, Navbar меняется
//     });
//   }
// }

// src/app/components/header/header.component.ts

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// Убедитесь, что путь к сервису верный
import { AuthService } from '../../services/auth.service'; 

@Component({
  // КРИТИЧЕСКИЙ МОМЕНТ: Селектор должен быть 'app-header'
  selector: 'app-header', 
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  
  private authService: AuthService = inject(AuthService);
  
  // observable для отслеживания статуса входа (используется в шаблоне через async pipe)
  isLoggedIn$: Observable<boolean> = this.authService.isLoggedIn$;
  
  //
  currentUserEmail$: Observable<string | null> = this.authService.currentUser$.pipe(
    map(user => user ? user.email : null)
  );
  
  // Метод для выхода
  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => console.log('User logged out successfully'),
      error: (err) => console.error('Logout error:', err)
    });
  }
}