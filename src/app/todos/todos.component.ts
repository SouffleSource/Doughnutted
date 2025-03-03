import { Component, OnInit, Renderer2 } from '@angular/core';
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
  errorMessage: string = ''; // Add error message property

  constructor(private renderer: Renderer2) {}

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
          this.todos.sort((a, b) => b.count - a.count); // Sort todos in descending order based on count
        },
      });
    } catch (error) {
      console.error('error fetching todos', error);
    }
  }

  createTodo() {
    if (this.newTodoContent.trim()) {
      if (this.validateInput(this.newTodoContent)) {
        this.newTodoContent = this.capitalizeWords(this.newTodoContent); // Capitalize first letter of each word
        const existingTodo = this.todos.find(todo => todo.content.toLowerCase() === this.newTodoContent.toLowerCase());
        if (existingTodo) {
          existingTodo.count = (existingTodo.count || 1) + 1;
          existingTodo.paid = existingTodo.paid + 1; // Increment paid by 1
          client.models.Todo.update(existingTodo);
        } else {
          client.models.Todo.create({
            content: this.newTodoContent,
            count: 1,
            paid: 1,
          } as Todo);
        }
        this.newTodoContent = '';
        this.errorMessage = ''; // Clear error message
        this.listTodos();
        this.launchConfetti(); // Invoke confetti animation
        this.pulseHeader(); // Invoke pulse animation on header
      } else {
        this.errorMessage = 'Input should be in the format: {firstname} {first initial of lastname}, max 16 characters.'; // Set error message
      }
    }
  }

  validateInput(input: string): boolean {
    const regex = /^[A-Za-z]+ [A-Za-z]$/;
    return regex.test(input) && input.length <= 16;
  }

  capitalizeWords(str: string): string {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  }

  deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  decreasePaid(todo: Todo) {
    if (todo.paid > 0) {
      todo.paid -= 1;
      client.models.Todo.update(todo);
      this.launchConfettiCannon(); // Invoke confetti cannon animation
    }
  }

  launchConfetti() {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  }

  launchConfettiCannon() {
    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    confetti({
      angle: randomInRange(55, 125),
      spread: randomInRange(50, 70),
      particleCount: randomInRange(50, 100),
      origin: { y: 0.6 },
    });
  }

  pulseHeader() {
    const header = document.querySelector('h1');
    if (header) {
      this.renderer.addClass(header, 'pulse');
      setTimeout(() => {
        this.renderer.removeClass(header, 'pulse');
      }, 1000); // Remove the class after the animation duration
    }
  }
}
