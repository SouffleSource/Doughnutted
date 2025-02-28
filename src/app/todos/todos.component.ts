import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';

const client = generateClient<Schema>();

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css',
})
export class TodosComponent implements OnInit {
  todos: any[] = [];
  name: string = '';
  message: string = '';

  ngOnInit(): void {
    this.listTodos();
  }

  listTodos() {
    try {
      client.models.Todo.observeQuery().subscribe({
        next: ({ items, isSynced }) => {
          this.todos = items;
        },
      });
    } catch (error) {
      console.error('error fetching todos', error);
    }
  }

  createTodo() {
    try {
      client.models.Todo.create({
        content: window.prompt('Todo content'),
      });
      this.listTodos();
    } catch (error) {
      console.error('error creating todos', error);
    }
  }

  deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  submitName() {
    if (this.name.trim()) {
      const content = `${this.name}, you have been doughnutted! You now owe everyone one box of doughnuts!`;
      this.message = content;
      this.name = '';
    }
  }
}
