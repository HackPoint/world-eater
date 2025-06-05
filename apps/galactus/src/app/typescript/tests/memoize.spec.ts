import { describe } from 'vitest';
import { memoize } from '../memoize';

describe('memoized', () => {
  it('should return the correct result', () => {
    const add = (a: number, b: number) => a + b;
    const memoizedAdd = memoize(add);

    expect(memoizedAdd(2, 3)).toBe(5);
    expect(memoizedAdd(10, 7)).toBe(17);
  });

  it('should return cached result on repeated calls', () => {
    const spy = vi.fn((x: number) => x * 2);
    const memoizedFn = memoize(spy);

    expect(memoizedFn(4)).toBe(8);
    expect(memoizedFn(4)).toBe(8);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should handle different arguments separately', () => {
    const multiply = vi.fn((a: number, b: number) => a * b);
    const memoizedMultiply = memoize(multiply);

    expect(memoizedMultiply(2, 3)).toBe(6);
    expect(memoizedMultiply(3, 2)).toBe(6);
    expect(memoizedMultiply(2, 3)).toBe(6);
    expect(multiply).toHaveBeenCalledTimes(2); // Only (2,3) and (3,2)
  });

  it('should support string arguments', () => {
    const greet = vi.fn((name: string) => `Hello, ${name}`);
    const memoizedGreet = memoize(greet);

    expect(memoizedGreet('Alice')).toBe('Hello, Alice');
    expect(memoizedGreet('Alice')).toBe('Hello, Alice');
    expect(memoizedGreet('Bob')).toBe('Hello, Bob');
    expect(greet).toHaveBeenCalledTimes(2);
  });

  it('should preserve the return type', () => {
    const fn = (x: number): number => x ** 2;
    const memoized = memoize(fn);
    const result = memoized(3);

    // Type-level check
    type Check = typeof result extends number ? true : false;
    const typeCheck: Check = true;
    expect(result).toBe(9);
    expect(typeCheck).toBe(true);
  });
});
