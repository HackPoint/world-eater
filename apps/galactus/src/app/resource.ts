import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Todo } from './types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Resource {
  private readonly http: HttpClient = inject(HttpClient);

  getTodosByTitle(search: string): Observable<Todo[]> {
    return this.http.get<Todo[]>(
      `https://jsonplaceholder.typicode.com/todos?title_like=${encodeURIComponent(search)}`,
    );
  }
}
