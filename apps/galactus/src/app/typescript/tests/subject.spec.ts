import { createSubject, SimpleSubject, Subject } from '../subject';

const implementations: [name: string, factory: <T>() => Subject<T>][] = [
  ['class-based', <T>() => new SimpleSubject<T>()],
  ['factory-based', <T>() => createSubject<T>()],
];

implementations.forEach(([name, create]) => {
  describe(`Subject (${name})`, () => {
    it('should notify a subscribed listener when value is emitted', () => {
      const subject = create<string>();
      const listener = vi.fn();

      subject.subscribe(listener);
      subject.next('hello');

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith('hello');
    });

    it('should notify multiple listeners', () => {
      const subject = create<number>();
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      subject.subscribe(listener1);
      subject.subscribe(listener2);
      subject.next(42);

      expect(listener1).toHaveBeenCalledWith(42);
      expect(listener2).toHaveBeenCalledWith(42);
    });

    it('should not notify unsubscribed listener', () => {
      const subject = create<boolean>();
      const listener = vi.fn();

      subject.subscribe(listener);
      subject.unsubscribe(listener);
      subject.next(true);

      expect(listener).not.toHaveBeenCalled();
    });

    it('should only unsubscribe the specific listener', () => {
      const subject = create<number>();
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      subject.subscribe(listener1);
      subject.subscribe(listener2);
      subject.unsubscribe(listener1);

      subject.next(5);

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).toHaveBeenCalledWith(5);
    });

    it('should support multiple emissions to the same listener', () => {
      const subject = create<string>();
      const listener = vi.fn();

      subject.subscribe(listener);
      subject.next('a');
      subject.next('b');
      subject.next('c');

      expect(listener).toHaveBeenCalledTimes(3);
      expect(listener.mock.calls.map((call) => call[0])).toEqual([
        'a',
        'b',
        'c',
      ]);
    });

    it('should allow resubscription after unsubscribe', () => {
      const subject = create<number>();
      const listener = vi.fn();

      subject.subscribe(listener);
      subject.next(1);
      subject.unsubscribe(listener);
      subject.next(2);
      subject.subscribe(listener);
      subject.next(3);

      expect(listener).toHaveBeenCalledTimes(2);
      expect(listener.mock.calls.map((call) => call[0])).toEqual([1, 3]);
    });

    it('should maintain type safety', () => {
      const subject = create<{ message: string }>();
      const listener = vi.fn((v: { message: string }) => {
        expect(typeof v.message).toBe('string');
      });

      subject.subscribe(listener);
      subject.next({ message: 'Typed event' });

      expect(listener).toHaveBeenCalledWith({ message: 'Typed event' });
    });

    it('should return a subscription object with unsubscribe()', () => {
      const subject = create<string>();
      const listener = vi.fn();

      const subscription = subject.subscribe(listener);
      expect(typeof subscription.unsubscribe).toBe('function');
      expect(subscription.closed).toBe(false);

      subject.next('first');
      subscription.unsubscribe();

      expect(subscription.closed).toBe(true);
      subject.next('second');

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith('first');
    });

    it('should ignore unsubscribe() calls after already unsubscribed', () => {
      const subject = create<number>();
      const listener = vi.fn();

      const subscription = subject.subscribe(listener);
      subscription.unsubscribe();
      subscription.unsubscribe(); // double unsubscribe (should not throw)
      subject.next(42);

      expect(subscription.closed).toBe(true);
      expect(listener).not.toHaveBeenCalled();
    });

    it('should allow multiple subscriptions and independent unsubscriptions', () => {
      const subject = create<string>();
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      const sub1 = subject.subscribe(listener1);
      const sub2 = subject.subscribe(listener2);

      subject.next('A');
      sub1.unsubscribe();
      subject.next('B');
      sub2.unsubscribe();
      subject.next('C');

      expect(listener1.mock.calls.map(c => c[0])).toEqual(['A']);
      expect(listener2.mock.calls.map(c => c[0])).toEqual(['A', 'B']);
    });

  });
});
