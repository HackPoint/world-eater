export interface Observer<T> {
  update(value: T): void;
}

export interface Observable<T> {
  subscribe(observer: Observer<T>): void;
  unsubscribe(observer: Observer<T>): void;
  notify(value: T): void;
}

export class ConcreteObservable<T> implements Observable<T> {
  private readonly observers = new Set<Observer<T>>();

  notify(value: T): void {
    for (const observer of this.observers) {
      observer.update(value);
    }
  }

  subscribe(observer: Observer<T>): void {
    this.observers.add(observer);
  }

  unsubscribe(observer: Observer<T>): void {
    this.observers.delete(observer);
  }
}
