export interface Listener<T> {
  (value: T): void;
}

export interface Subject<T> {
  subscribe(listener: Listener<T>): void;

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

  subscribe(listener: Listener<T>): void {
    this.listeners.add(listener);
  }

  unsubscribe(listener: Listener<T>): void {
    this.listeners.delete(listener);
  }
}

export function createSubject<T>(): Subject<T> {
  return new SimpleSubject<T>();
}
