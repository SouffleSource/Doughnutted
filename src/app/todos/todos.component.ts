import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';

const client = generateClient<Schema>();

interface Todo {
  id: string;
  content: string;
  count?: number;
}

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css',
})
export class TodosComponent implements OnInit {
  todos: Todo[] = [];
  newTodoContent: string = '';

  ngOnInit(): void {
    this.listTodos();
  }

  listTodos() {
    try {
      client.models.Todo.observeQuery().subscribe({
        next: ({ items, isSynced }) => {
          this.todos = items as Todo[];
        },
      });
    } catch (error) {
      console.error('error fetching todos', error);
    }
  }

  createTodo() {
    if (this.newTodoContent.trim()) {
      const existingTodo = this.todos.find(todo => todo.content.toLowerCase() === this.newTodoContent.toLowerCase());
      if (existingTodo) {
        existingTodo.count = (existingTodo.count || 1) + 1;
        client.models.Todo.update(existingTodo);
      } else {
        client.models.Todo.create({
          content: this.newTodoContent,
          count: 1,
        } as Todo);
      }
      this.newTodoContent = '';
      this.listTodos();
    }
  }

  deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }
}
