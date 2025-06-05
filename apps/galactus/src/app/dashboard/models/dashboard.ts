import { Profile } from './profile';
import { NotificationCount } from './notification-count';
import { Settings } from './settings';

export interface Dashboard {
  readonly profile: Profile;
  readonly notifications: NotificationCount;
  readonly settings: Settings;
}
