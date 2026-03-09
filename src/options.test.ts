import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { PRECISION_OPTIONS, POINTS_OF_INTEREST } from './options.tsx'

describe('options.tsx', () => {
  describe('PRECISION_OPTIONS', () => {
    it('are in size order', () => {
      for (let i = 0; i + 1 in PRECISION_OPTIONS; i++) {
        const precisionOption1 = PRECISION_OPTIONS[i]
        const precisionOption2 = PRECISION_OPTIONS[i + 1]
        assert(precisionOption1.numDecimalDigits < precisionOption2.numDecimalDigits)
      }
    })
  })

  describe('POINTS_OF_INTEREST', () => {
    it('are in chronological order', () => {
      for (let i = 0; i + 1 in POINTS_OF_INTEREST; i++) {
        const pointOfInterest1 = POINTS_OF_INTEREST[i]
        const pointOfInterest2 = POINTS_OF_INTEREST[i + 1]
        assert(pointOfInterest1.unixMillis < pointOfInterest2.unixMillis)
      }
    })
  })
})
