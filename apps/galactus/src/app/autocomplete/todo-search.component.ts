import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Resource } from '../resource';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged, finalize,
  of,
  Subject,
  switchMap
} from 'rxjs';
import { Todo } from '../types';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-search',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo-search.component.html',
  styleUrl: './todo-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoSearchComponent {
  private readonly resource = inject(Resource);
  readonly $results = new BehaviorSubject<Todo[]>([]);
  readonly isLoading$ = new BehaviorSubject<boolean>(false);

  readonly searchControl = new FormControl('');

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((q) => {
          if (!q || q.trim() === '') {
            this.isLoading$.next(false);
            return of([] as Todo[]);
          }

          this.isLoading$.next(true);
          return this.resource.getTodosByTitle(q.trim()).pipe(
            finalize(() => this.isLoading$.next(false))
          );
        })
      )
      .subscribe({
        next: (todos) => this.$results.next(todos),
        error: () => {
          // On error, ensure lading is turned off and push empty results
          this.isLoading$.next(false);
          this.$results.next([]);
        },
      });
  }
}
