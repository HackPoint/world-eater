type Memoized<T extends (...args: never[]) => unknown> = (
  ...args: Parameters<T>
) => ReturnType<T>;

export function memoize<T extends (...args: never[]) => unknown>(
  fn: T,
): Memoized<T> {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    const cached = cache.get(key);
    if (cached !== undefined) return cached;

    const result = fn(...args) as ReturnType<T>;
    cache.set(key, result);
    return result;
  }) as Memoized<T>;
}
