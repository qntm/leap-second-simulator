import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { modulo, div, multiplyByScale } from './utils.ts'

describe('utils.ts', () => {
  describe('modulo', () => {
    it('works', () => {
      assert.equal(modulo(10n, 9n), 1n)
      assert.equal(modulo(9n, 9n), 0n)
      assert.equal(modulo(8n, 9n), 8n)
      assert.equal(modulo(1n, 9n), 1n)
      assert.equal(modulo(0n, 9n), 0n)
      assert.equal(modulo(-1n, 9n), 8n)
      assert.equal(modulo(-8n, 9n), 1n)
      assert.equal(modulo(-9n, 9n), 0n)
      assert.equal(modulo(-10n, 9n), 8n)
    })
  })

  describe('div', () => {
    it('works', () => {
      assert.equal(div(15n, 10n), 1n)
      assert.equal(div(18n, 10n), 1n)
      assert.equal(div(12n, 10n), 1n)
      assert.equal(div(10n, 10n), 1n)
      assert.equal(div(8n, 10n), 0n)
      assert.equal(div(5n, 10n), 0n)
      assert.equal(div(2n, 10n), 0n)
      assert.equal(div(0n, 10n), 0n)
      assert.equal(div(-2n, 10n), -1n)
      assert.equal(div(-5n, 10n), -1n)
      assert.equal(div(-8n, 10n), -1n)
      assert.equal(div(-10n, 10n), -1n)
      assert.equal(div(-12n, 10n), -2n)
      assert.equal(div(-15n, 10n), -2n)
      assert.equal(div(-18n, 10n), -2n)
    })
  })

  describe('multiplyByScale', () => {
    it('works', () => {
      assert.equal(multiplyByScale(678n, 4n), 6_780_000n)
      assert.equal(multiplyByScale(678n, 3n), 678_000n)
      assert.equal(multiplyByScale(678n, 2n), 67_800n)
      assert.equal(multiplyByScale(678n, 1n), 6_780n)
      assert.equal(multiplyByScale(678n, 0n), 678n)
      assert.equal(multiplyByScale(678n, -1n), 67n)
      assert.equal(multiplyByScale(678n, -2n), 6n)
      assert.equal(multiplyByScale(678n, -3n), 0n)
      assert.equal(multiplyByScale(678n, -4n), 0n)

      assert.equal(multiplyByScale(-678n, 4n), -6_780_000n)
      assert.equal(multiplyByScale(-678n, 3n), -678_000n)
      assert.equal(multiplyByScale(-678n, 2n), -67_800n)
      assert.equal(multiplyByScale(-678n, 1n), -6_780n)
      assert.equal(multiplyByScale(-678n, 0n), -678n)
      assert.equal(multiplyByScale(-678n, -1n), -68n)
      assert.equal(multiplyByScale(-678n, -2n), -7n)
      assert.equal(multiplyByScale(-678n, -3n), -1n)
      assert.equal(multiplyByScale(-678n, -4n), -1n)
    })
  })
})
