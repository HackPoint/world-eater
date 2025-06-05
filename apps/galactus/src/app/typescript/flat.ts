type FlatOne<T extends readonly unknown[]> = T extends readonly [
  infer First,
  ...infer Rest,
]
  ? First extends readonly unknown[]
    ? [...First, ...FlatOne<Rest>]
    : [First, ...FlatOne<Rest>]
  : [];

type DecrementDepth<D extends number> = [
  never, // 0
  0, // 1
  1, // 2
  2, // 3
  3, // 4
  4, // 5
][D];

export type Flat<T, D extends number = 1> = D extends 0
  ? T
  : T extends readonly unknown[]
    ? Flat<FlatOne<T>, DecrementDepth<D>>
    : T;

/*export function flat(args: unknown[], depth = 1): unknown[] {
  if (depth < 1) return args.slice();

  const flattened: unknown[] = [];

  for (const [i, item] of args.entries()) {
    if (!(i in args)) continue;

    if (Array.isArray(item)) {
      flattened.push(...flat(item, depth - 1));
    } else {
      flattened.push(item);
    }
  }
  return flattened;
}*/
export function flat<T extends readonly unknown[], D extends number = 1>(
  args: T,
  depth?: D,
): Flat<T, D> {
  const d = depth ?? 1;
  const flattened: unknown[] = [];

  for (const [i, item] of args.entries()) {
    if (!(i in args)) continue;

    if (Array.isArray(item) && d > 0) {
      flattened.push(...flat(item, (d - 1) as D));
    } else {
      flattened.push(item);
    }
  }

  return flattened as Flat<T, D>;
}

