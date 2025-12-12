import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { passwordComplexityValidator, passwordMatchValidator } from '../../shared/validators/password-complexity.validator';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})


export class SignupComponent {
  private fb: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  signupForm!: FormGroup;
  errorMessage: string | null = null;
  isLoading = false;

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordComplexityValidator()]],
      repeatPassword: ['', Validators.required]
    },
    {
      validators: passwordMatchValidator 
    });
  }

  get f() {
    return this.signupForm.controls;
  }

  onSubmit() {
    this.errorMessage = null;

    if (this.signupForm.invalid) {
      // помечаем все поля как 'touched' для отображения ошибок
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { email, password } = this.signupForm.value;

    this.authService.register({ email, password }).subscribe({
      next: () => {
        // успешная регистрация, перенаправляем на главную
        this.router.navigate(['/home']); 
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = this.handleAuthError(err.code);
      }
    });
  }

  private handleAuthError(code: string): string {
    switch(code) {
      case 'auth/email-already-in-use':
        return 'Этот email уже используется. Попробуйте войти.';
      case 'auth/invalid-email':
        return 'Некорректный формат email.';
      default:
        return 'Произошла неизвестная ошибка при регистрации.';
    }
  }
}
