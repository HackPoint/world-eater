import { describe, it, expect } from 'vitest';
import { Flat, flat } from '../flat'; // you will implement this

describe('flat()', () => {
  it('flattens a 1-level nested array (default)', () => {
    const input = [1, [2, 3], 4];
    const result = flat(input);
    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('flattens to a given depth', () => {
    const input = [1, [2, [3, [4]]]];
    expect(flat(input, 2)).toEqual([1, 2, 3, [4]]);
    expect(flat(input, 3)).toEqual([1, 2, 3, 4]);
  });

  it('treats depth = 0 as no flattening', () => {
    const input = [1, [2, 3]];
    expect(flat(input, 0)).toEqual([1, [2, 3]]);
  });

  it('flattens empty arrays correctly', () => {
    const input: unknown[] = [[], 1, [2, []], [[3]], []];
    expect(flat(input)).toEqual([1, 2, [], [3]]);
  });

  it('flattens with Infinity depth', () => {
    const input = [1, [2, [3, [4, [5]]]]];
    expect(flat(input, Infinity)).toEqual([1, 2, 3, 4, 5]);
  });

  it('ignores non-array elements', () => {
    const input = [1, 'a', null, [true, [undefined]], { x: 1 }];
    expect(flat(input, 2)).toEqual([1, 'a', null, true, undefined, { x: 1 }]);
  });

  it('handles holes in arrays', () => {
    const input = [1, , 2, , [3, , 4]];
    expect(flat(input)).toEqual([1, 2, 3, 4]);
  });

  it('does not mutate the original array', () => {
    const input = [1, [2]];
    const clone = [...input];
    flat(input);
    expect(input).toEqual(clone);
  });

  it('flattens one level by default', () => {
    const input = [1, [2, 3], 4] as const;
    const result = flat(input);

    expect(result).toEqual([1, 2, 3, 4]);
    expectTypeOf(result).toEqualTypeOf<Flat<typeof input, 1>>();
  });

  it('flattens two levels', () => {
    const input = [1, [2, [3]], 4] as const;
    const result = flat(input, 2);

    expect(result).toEqual([1, 2, 3, 4]);
    expectTypeOf(result).toEqualTypeOf<Flat<typeof input, 2>>();
  });

  it('preserves deeper arrays if depth is not enough', () => {
    const input = [1, [2, [3]]] as const;
    const result = flat(input, 1);

    expect(result).toEqual([1, 2, [3]]);
    expectTypeOf(result).toEqualTypeOf<Flat<typeof input, 1>>();
  });

  it('works with empty arrays', () => {
    const input = [[], 1, [[2]], [[[3]]]] as const;
    const result = flat(input, 2);

    expect(result).toEqual([1, 2, [3]]);
    expectTypeOf(result).toEqualTypeOf<Flat<typeof input, 2>>();
  });

  it('skips holes in arrays', () => {
    const input = [1, , 2, [3, , 4]] as unknown[];
    const result = flat(input, 2);

    expect(result).toEqual([1, 2, 3, 4]);
    // no type test here because holes aren't captured in the literal type
  });

  it('handles depth = 0 (returns same array)', () => {
    const input = [1, [2, 3]] as const;
    const result = flat(input, 0);

    expect(result).toEqual([1, [2, 3]]);
    expectTypeOf(result).toEqualTypeOf<Flat<typeof input, 0>>();
  });

  it('infers correct types for nested tuples', () => {
    const input = [[1], [[2]], [[[3]]]] as const;
    const result = flat(input, 3);

    expect(result).toEqual([1, 2, 3]);
    expectTypeOf(result).toEqualTypeOf<[1, 2, 3]>();
  });
});
