import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Todo } from '../../services/todo.service'



@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.css'
})
export class TodoItemComponent {
  @Input() item!: Todo;
}
