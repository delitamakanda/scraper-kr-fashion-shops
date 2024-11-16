import { describe, it, expect } from 'vitest'

describe('something true or false', () => {
  it('true to to be true', () => {
    expect(true).toBe(true)
  })

  it('false to be false', () => {
    expect(false).toBe(false)
  });
});
