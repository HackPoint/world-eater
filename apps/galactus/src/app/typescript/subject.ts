import { Subscription } from './subscribtion';

export interface Listener<T> {
  (value: T): void;
}

export interface Subject<T> {
  subscribe(listener: Listener<T>): Subscription;
  unsubscribe(listener: Listener<T>): void;
  next(value: T): void;
}

export class SimpleSubject<T> implements Subject<T> {
  private readonly listeners = new Set<Listener<T>>();

  next(value: T): void {
    for (const listener of this.listeners) {
      listener(value);
    }
  }

  subscribe(listener: Listener<T>): Subscription {
    this.listeners.add(listener);
    let isClosed = false;
    return {
      unsubscribe: () => {
        if (!isClosed) {
          this.unsubscribe(listener);
          isClosed = true;
        }
      },
      get closed() {
        return isClosed;
      },
    };
  }

  unsubscribe(listener: Listener<T>): void {
    this.listeners.delete(listener);
  }
}

export function createSubject<T>(): Subject<T> {
  return new SimpleSubject<T>();
}
