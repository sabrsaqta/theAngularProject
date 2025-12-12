import { Injectable, inject } from '@angular/core';
import { Auth, user, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, User } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Credentials } from '../../models/credentials.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);

  user$: Observable<User | null> = user(this.auth);
  public currentUser$: Observable<User | null> = user(this.auth);

  isLoggedIn$: Observable<boolean> = this.user$.pipe(
    map(user => !!user)
  );
  
  //регистрация
  register({ email, password }: Credentials): Observable<any> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  //вход
  login({ email, password }: Credentials): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  //выход
  logout(): Observable<void> {
    return from(signOut(this.auth));
  }
}