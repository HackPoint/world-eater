import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TodoSearchComponent } from './autocomplete/todo-search.component';

@Component({
  imports: [RouterModule, TodoSearchComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'galactus';
}
