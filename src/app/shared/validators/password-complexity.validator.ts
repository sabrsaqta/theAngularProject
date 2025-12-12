import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Проверяет, соответствует ли пароль требованиям сложности:
 * Мин 8 символов
 * Содержит хотя бы одно число
 * Содержит хотя бы один спецсимвол
 */

export function passwordComplexityValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    // если поле пустое, не применяем валидацию (оставим это для 'required')
    if (!value) {
      return null;
    }

    const hasMinLength = value.length >= 8;
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);

    const passwordValid = hasMinLength && hasNumber && hasSpecialChar;

    if (!passwordValid) {
      return { 
          passwordComplexity: { 
              needsMinLength: !hasMinLength,
              needsNumber: !hasNumber, 
              needsSpecial: !hasSpecialChar 
          } 
      };
    }
    
    return null;
  };
}


export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    // Получаем значения полей password и repeatPassword
    const password = control.get('password')?.value;
    const repeatPassword = control.get('repeatPassword')?.value;

    // сравниваем, если оба поля заполнены и не совпадают
    if (password && repeatPassword && password !== repeatPassword) {
      // оба поля заполнены, но они НЕ СОВПАДАЮТ
      return { passwordsNotMatching: true };
    } else {
      // либо совпадают, либо одно из полей еще не заполнено.
      return null;
}
};