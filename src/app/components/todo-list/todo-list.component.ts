import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo, TodoService } from '../../services/todo.service';
import { TodoItemComponent } from '../todo-item/todo-item.component';

import { BehaviorSubject, Observable, combineLatest, switchMap } from 'rxjs';
import { map, debounceTime, startWith } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
//мзг пгрм


@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, TodoItemComponent, FormsModule],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css'
})

//бз лг
export class TodoListComponent implements OnInit {
  todos$!: Observable<Todo[]>; //хранит поток задач

  private searchTerm = new BehaviorSubject<string>('');
  newTaskTitle: string = '';
  // private refreshTodos = new BehaviorSubject<void>(undefined); //тригер для обновления
  private allTodos = new BehaviorSubject<Todo[]>([]);
  constructor(private todoService: TodoService){ }  //writing TS to tS


  ngOnInit(): void {
      // const dataFromServer$ = this.refreshTodos.pipe(
      //   switchMap(() => this.todoService.getTodos())
      // );
      this.todoService.getTodos().subscribe(initialTodos => {
        this.allTodos.next(initialTodos);
      });

      const searchTerm$ = this.searchTerm.asObservable().pipe(
        debounceTime(350),
        startWith('')
      );

      this.todos$ = combineLatest([this.allTodos.asObservable(), searchTerm$]).pipe(
        map(([todos, searchTerm]) =>
          todos.filter(todo =>
            todo.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      );
  }

  onSearch(event: Event): void{
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.next(value);
  }

  addTask():void{
    if (!this.newTaskTitle.trim()) return; //пустая строка

    const newTodo = {
      title: this.newTaskTitle,
      completed: false,
    };

    this.todoService.addTodo(newTodo).subscribe(createdTodo => {
      const currentTodos = this.allTodos.getValue();
      // this.refreshTodos.next(); //обновляем список
      this.allTodos.next([createdTodo, ...currentTodos]);
      this.newTaskTitle = '';
    })
  }
}
