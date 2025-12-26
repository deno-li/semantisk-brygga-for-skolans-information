import { describe, it, expect } from 'vitest';

describe('Basic Infrastructure Test', () => {
  it('can run tests', () => {
    expect(true).toBe(true);
  });

  it('can perform basic assertions', () => {
    const value = 42;
    expect(value).toBe(42);
    expect(typeof value).toBe('number');
  });

  it('can work with arrays', () => {
    const array = [1, 2, 3];
    expect(array).toHaveLength(3);
    expect(array).toContain(2);
  });
});
