import { describe, it, expect, vi } from 'vitest';
import { ConcreteObservable, Observer } from './observer';

describe('Observer Pattern', () => {
  it('should notify a subscribed observer with the correct value', () => {
    const observable = new ConcreteObservable<string>();

    const observer: Observer<string> = {
      update: vi.fn()
    };

    observable.subscribe(observer);
    observable.notify('Test');

    expect(observer.update).toHaveBeenCalledTimes(1);
    expect(observer.update).toHaveBeenCalledWith('Test');
  });

  it('should notify multiple observers', () => {
    const observable = new ConcreteObservable<number>();

    const observer1: Observer<number> = { update: vi.fn() };
    const observer2: Observer<number> = { update: vi.fn() };

    observable.subscribe(observer1);
    observable.subscribe(observer2);

    observable.notify(42);

    expect(observer1.update).toHaveBeenCalledWith(42);
    expect(observer2.update).toHaveBeenCalledWith(42);
  });

  it('should not notify an unsubscribed observer', () => {
    const observable = new ConcreteObservable<boolean>();

    const observer: Observer<boolean> = { update: vi.fn() };

    observable.subscribe(observer);
    observable.unsubscribe(observer);
    observable.notify(true);

    expect(observer.update).not.toHaveBeenCalled();
  });

  it('should allow re-subscribing after unsubscribe', () => {
    const observable = new ConcreteObservable<number>();

    const observer: Observer<number> = { update: vi.fn() };

    observable.subscribe(observer);
    observable.notify(1);
    observable.unsubscribe(observer);
    observable.notify(2);
    observable.subscribe(observer);
    observable.notify(3);

    expect(observer.update).toHaveBeenCalledTimes(2);
    expect(observer.update).toHaveBeenCalledWith(1);
    expect(observer.update).toHaveBeenCalledWith(3);
  });

  it('should support type safety', () => {
    const observable = new ConcreteObservable<{ id: number; message: string }>();

    const observer: Observer<{ id: number; message: string }> = {
      update: vi.fn()
    };

    const payload = { id: 101, message: 'Hello' };
    observable.subscribe(observer);
    observable.notify(payload);

    expect(observer.update).toHaveBeenCalledWith(payload);
  });

  it('should not fail if unsubscribing a non-subscribed observer', () => {
    const observable = new ConcreteObservable<number>();

    const observer1: Observer<number> = { update: vi.fn() };
    const observer2: Observer<number> = { update: vi.fn() };

    observable.subscribe(observer1);
    observable.unsubscribe(observer2); // not subscribed
    observable.notify(10);

    expect(observer1.update).toHaveBeenCalledWith(10);
    expect(observer2.update).not.toHaveBeenCalled();
  });

  it('should call update on each notify', () => {
    const observable = new ConcreteObservable<string>();

    const updateMock = vi.fn<(value: string) => void>();
    const observer: Observer<string> = { update: updateMock };

    observable.subscribe(observer);
    observable.notify('a');
    observable.notify('b');
    observable.notify('c');

    expect(updateMock).toHaveBeenCalledTimes(3);
    expect(updateMock.mock.calls.map(c => c[0])).toEqual(['a', 'b', 'c']);
  });
});
