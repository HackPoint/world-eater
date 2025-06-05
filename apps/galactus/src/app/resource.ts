import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Todo } from './types';
import { map, Observable } from 'rxjs';
import { Dashboard } from './dashboard/models/dashboard';
import { Profile } from './dashboard/models/profile';
import { NotificationCount } from './dashboard/models/notification-count';
import { Settings } from './dashboard/models/settings';

interface RandomUserResponse {
  results: [
    {
      name: { first: string; last: string };
      login: { uuid: string };
      picture: { large: string };
    },
  ];
}

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

  getProfile(): Observable<Profile> {
    return this.http.get<RandomUserResponse>('https://randomuser.me/api/').pipe(
      map((res) => {
        const user = res.results[0];
        return {
          id: user.login.uuid,
          name: `${user.name.first} ${user.name.last}`,
          avatarUrl: user.picture.large,
        };
      }),
    );
  }

  getNotifications(): Observable<NotificationCount> {
    return this.http
      .get<
        number[]
      >('https://www.random.org/integers/?num=1&min=1&max=20&col=1&base=10&format=plain&rnd=new')
      .pipe(
        map((res) => {
          return {
            count: res[0],
          };
        }),
      );
  }

  getSettings() {
    return this.http.get<Settings>(
      'https://run.mocky.io/v3/d872f2bd-e97d-4176-95eb-528fd833d1b9',
    );
  }
}
