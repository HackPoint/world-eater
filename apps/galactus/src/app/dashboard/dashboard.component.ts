import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Resource } from '../resource';
import { forkJoin, Subject } from 'rxjs';
import { Dashboard } from './models/dashboard';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private readonly resource = inject(Resource);
  readonly $dashboard = new Subject<Dashboard>();

  ngOnInit(): void {
    forkJoin({
      profile: this.resource.getProfile(),
      notifications: this.resource.getNotifications(),
      settings: this.resource.getSettings(),
    }).subscribe(this.$dashboard);
  }
}
