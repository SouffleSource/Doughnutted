import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import confetti from 'canvas-confetti';

const client = generateClient<Schema>();

interface Todo {
  id: string;
  content: string;
  count: number;
  paid: number; // Add the paid property
}

@Component({
  selector: 'app-todos', // Ensure the selector is correctly set
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
          this.todos = items.map(item => ({
            ...item,
            count: item.count || 1,
            paid: item.paid !== undefined ? item.paid : 1, // Initialize paid property only if undefined
          })) as Todo[];
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
        existingTodo.paid = (existingTodo.paid || 1) + 1;
        client.models.Todo.update(existingTodo);
      } else {
        client.models.Todo.create({
          content: this.newTodoContent,
          count: 1,
          paid: 1,
        } as Todo);
      }
      this.newTodoContent = '';
      this.listTodos();
    }
  }

  deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  decreasePaid(todo: Todo) {
    if (todo.paid > 0) {
      todo.paid -= 1;
      client.models.Todo.update(todo);
    }
  }
}
