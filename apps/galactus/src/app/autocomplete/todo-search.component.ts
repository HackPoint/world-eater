import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Resource } from '../resource';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
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
  readonly $results = new Subject<Todo[]>();
  readonly searchControl = new FormControl('');

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((q) => {
          if (q === '') {
            this.$results.next([]);
            return [];
          }
          return this.resource.getTodosByTitle(q || '');
        }),
      )
      .subscribe(this.$results);
  }
}
