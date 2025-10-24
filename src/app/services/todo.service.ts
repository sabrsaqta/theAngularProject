//курьер
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; //поток данных

export interface Todo{
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}



@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/todos';
  constructor(private http: HttpClient){ } //для запросов


  //поток с массивом
  getTodos(): Observable<Todo[]>{
    return this.http.get<Todo[]>(this.apiUrl);
  }

  addTodo(newTodo: { title: string; completed: boolean}): Observable<Todo>{
    return this.http.post<Todo>(this.apiUrl, newTodo)
  }
}
