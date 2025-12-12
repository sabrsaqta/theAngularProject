import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Credentials } from '../../../models/credentials.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})


export class LoginComponent implements OnInit{
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]) 
  });

  errorMessage: string | null = null;
  isLoading = false;

  ngOnInit(): void {

  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.errorMessage = null;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage = 'Пожалуйста, заполните форму правильно.';
      return;
    }

    this.isLoading = true;
    const credentials: Credentials = this.loginForm.value as Credentials;

    this.authService.login(credentials).subscribe({
      next: () => {
        this.router.navigate(['/profile']); 
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = this.handleAuthError(err.code);
      }
    });
  }


  private handleAuthError(code: string): string {
    switch(code) {
      case 'auth/invalid-credential': // Самая частая ошибка при неверном пароле/email
      case 'auth/wrong-password': 
      case 'auth/user-not-found':
        return 'Неверный email или пароль.';
      case 'auth/user-disabled':
        return 'Ваш аккаунт заблокирован. Обратитесь в поддержку.';
      default:
        return 'Произошла неизвестная ошибка входа.';
    }
  }
}
