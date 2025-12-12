import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from 'firebase/auth';
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  
  private authService = inject(AuthService);
  private router = inject(Router);
  
  // observable для данных в HTML
  currentUser$: Observable<User | null> = this.authService.currentUser$;

  onLogout(): void {
      this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']); 
      },
      error: (err) => {
        console.error('Logout error:', err);
        this.router.navigate(['/login']); 
      }
    });;
  }
}