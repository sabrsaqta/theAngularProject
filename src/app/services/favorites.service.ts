import { Injectable, inject } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { Firestore, collection, doc, docData, setDoc, deleteDoc, arrayUnion, arrayRemove } from '@angular/fire/firestore';
import { Observable, switchMap, map, of, startWith } from 'rxjs';

export interface FavoriteRecipes {
  id: string;
  recipeIds: string[];
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  //поток с избранными пользователя
  public favorites$!: Observable<string[]>;

  constructor() {
    this.favorites$ = user(this.auth).pipe(
      // свичмап ждет uid пользователя
      switchMap(user => {
        if (!user) {
          // если пользователь не вошел -> пустой массив
          
          // return new Observable<FavoriteRecipes | null>(subscriber => {
          //    subscriber.next({ id: '', recipeIds: [] });
          //    subscriber.complete();
          // });
          return of(null);
        }
        
        // создаем ссылку на док пользователя в коллекции 'favorites'
        const favoritesRef = doc(this.firestore, 'favorites', user.uid);
        
        // docData следит за изменениями в доке Firestore
        return docData(favoritesRef, { idField: 'id' }) as Observable<FavoriteRecipes | null>;
      }),
      // объект FavoriteRecipes в чистый массив id
      map(favoritesDoc => favoritesDoc?.recipeIds || []),
      startWith([])
    );
  }

  // crud

  // добавить рецепт в избранное
  async addFavorite(recipeId: string): Promise<void> {
    const userId = this.auth.currentUser?.uid;
    if (!userId) {
      console.error('User not logged in.');
      return Promise.reject(new Error('User not logged in.'));
    }
    const favoritesRef = doc(this.firestore, 'favorites', userId);
    
    // Используем arrayUnion для атомарного добавления элемента в массив
    // await setDoc(favoritesRef, { recipeIds: arrayUnion(recipeId) }, { merge: true }); //запись в документ, arrayUnion для добавления если еще нет и без конфликтов
    return setDoc(favoritesRef, { recipeIds: arrayUnion(recipeId) }, { merge: true });
  }

  // 2. Удалить рецепт из избранного
  async removeFavorite(recipeId: string): Promise<void> {
    const userId = this.auth.currentUser?.uid;
    if (!userId) {
      console.error('User not logged in.');
      return Promise.reject(new Error('User not logged in.'));;
    }
    const favoritesRef = doc(this.firestore, 'favorites', userId);
    
    // Используем arrayRemove для атомарного удаления элемента из массива
    // await setDoc(favoritesRef, { recipeIds: arrayRemove(recipeId) }, { merge: true }); //если есть, то arrayRemove удаляет из документа
    return setDoc(favoritesRef, { recipeIds: arrayRemove(recipeId) }, { merge: true });
  }
}