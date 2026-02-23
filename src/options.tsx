import React from 'react'
import { MODELS, UNIX_END } from 't-a-i/nanos'

const MODEL_OPTION_OVERRUN = { model: MODELS.OVERRUN, displayName: 'overrun' }
const MODEL_OPTION_BREAK = { model: MODELS.BREAK, displayName: 'break' }
const MODEL_OPTION_STALL = { model: MODELS.STALL, displayName: 'stall' }
const MODEL_OPTION_SMEAR = { model: MODELS.SMEAR, displayName: 'smear' }

export const MODEL_OPTIONS = [
  MODEL_OPTION_OVERRUN,
  MODEL_OPTION_BREAK,
  MODEL_OPTION_STALL,
  MODEL_OPTION_SMEAR
]

export const INITIAL_MODEL = MODELS.STALL

export const FPSES = [1, 10, 30, 60, 120]
export const INITIAL_FPS = 60

const PRECISION_OPTION_S = { symbol: 's', numDecimalDigits: 0n }
const PRECISION_OPTION_MS = { symbol: 'ms', numDecimalDigits: 3n }
const PRECISION_OPTION_US = { symbol: 'µs', numDecimalDigits: 6n }
const PRECISION_OPTION_NS = { symbol: 'ns', numDecimalDigits: 9n }

export const PRECISION_OPTIONS = [
  PRECISION_OPTION_S,
  PRECISION_OPTION_MS,
  PRECISION_OPTION_US,
  PRECISION_OPTION_NS
]

export const INITIAL_PRECISION_OPTION = PRECISION_OPTION_MS

// Scale is a power of 10 multiplier
export const INITIAL_SCALE = 0n

const JAN = 0
const FEB = 1
const MAR = 2
const APR = 3
const JUL = 6
const AUG = 7
const SEP = 8
const NOV = 10

export const FIRST_POINT = {
  unixMillis: Date.UTC(1961, JAN, 1),
  description: (
    <>
      Start of UTC.<br />
      TAI - UTC = 1.422818 TAI seconds.<br />
      Drift rate: 15 TAI ns per Unix second<br />
    </>
  ),
  backTrack: false
}

export const CURRENT_POINT = {
  unixMillis: Date.now(),
  description: 'Present day',
  backTrack: false
}

export const FUTURE_POINT = {
  unixMillis: UNIX_END / 1_000_000,
  description: 'Limit of validity'
}

export const POINTS_OF_INTEREST = [
  FIRST_POINT,
  {
    unixMillis: Date.UTC(1961, AUG, 1),
    offsetChange: -0.05,
    description: '0.05 TAI seconds removed from UTC'
  },
  {
    unixMillis: Date.UTC(1962, JAN, 1),
    driftRateChange: -2,
    description: (
      <>
        Drift rate reduced from 15 to 13 TAI ns per Unix second.<br />
        No discontinuity<br />
      </>
    )
  },
  {
    unixMillis: Date.UTC(1963, NOV, 1),
    offsetChange: 0.1,
    description: '0.1 TAI seconds added to UTC'
  },
  {
    unixMillis: Date.UTC(1964, JAN, 1),
    driftRateChange: 2,
    description: (
      <>
        Drift rate increased from 13 to 15 TAI ns per Unix second.<br />
        No discontinuity<br />
      </>
    )
  },
  {
    unixMillis: Date.UTC(1964, APR, 1),
    offsetChange: 0.1,
    description: '0.1 TAI seconds added to UTC'
  },
  {
    unixMillis: Date.UTC(1964, SEP, 1),
    offsetChange: 0.1,
    description: '0.1 TAI seconds added to UTC'
  },
  {
    unixMillis: Date.UTC(1965, JAN, 1),
    offsetChange: 0.1,
    description: '0.1 TAI seconds added to UTC'
  },
  {
    unixMillis: Date.UTC(1965, MAR, 1),
    offsetChange: 0.1,
    description: '0.1 TAI seconds added to UTC'
  },
  {
    unixMillis: Date.UTC(1965, JUL, 1),
    offsetChange: 0.1,
    description: '0.1 TAI seconds added to UTC'
  },
  {
    unixMillis: Date.UTC(1965, SEP, 1),
    offsetChange: 0.1,
    description: '0.1 TAI seconds added to UTC'
  },
  {
    unixMillis: Date.UTC(1966, JAN, 1),
    driftRateChange: 15,
    description: (
      <>
        Drift rate doubled from 15 to 30 TAI ns per Unix second.<br />
        No discontinuity<br />
      </>
    )
  },
  {
    unixMillis: Date.UTC(1968, FEB, 1),
    offsetChange: -0.1,
    description: (
      <>
        0.1 TAI seconds removed from UTC.<br />
        Most recent removed time<br />
      </>
    )
  },
  {
    unixMillis: Date.UTC(1970, JAN, 1),
    description: (
      <>
        Unix epoch.<br />
        No change in parameters<br />
      </>
    )
  },
  {
    unixMillis: Date.UTC(1972, JAN, 1),
    offsetChange: 0.107_758,
    driftRateChange: -30,
    description: (
      <>
        0.107758 TAI seconds added to UTC.<br />
        TAI - Unix = 10.000000s.<br />
        Drift rate zeroed<br />
      </>
    )
  },
  { unixMillis: Date.UTC(1972, JUL, 1), offsetChange: 1, description: 'Leap second' },
  { unixMillis: Date.UTC(1973, JAN, 1), offsetChange: 1, description: 'Leap second' },
  { unixMillis: Date.UTC(1974, JAN, 1), offsetChange: 1, description: 'Leap second' },
  { unixMillis: Date.UTC(1975, JAN, 1), offsetChange: 1, description: 'Leap second' },
  { unixMillis: Date.UTC(1976, JAN, 1), offsetChange: 1, description: 'Leap second' },
  { unixMillis: Date.UTC(1977, JAN, 1), offsetChange: 1, description: 'Leap second' },
  { unixMillis: Date.UTC(1978, JAN, 1), offsetChange: 1, description: 'Leap second' },
  { unixMillis: Date.UTC(1979, JAN, 1), offsetChange: 1, description: 'Leap second' },
  { unixMillis: Date.UTC(1980, JAN, 1), offsetChange: 1, description: 'Leap second' },
  { unixMillis: Date.UTC(1981, JUL, 1), offsetChange: 1, description: 'Leap second' },
  { unixMillis: Date.UTC(1982, JUL, 1), offsetChange: 1, description: 'Leap second' },
  { unixMillis: Date.UTC(1983, JUL, 1), offsetChange: 1, description: 'Leap second' },
  { unixMillis: Date.UTC(1985, JUL, 1), offsetChange: 1, description: 'Leap second' },
  { unixMillis: Date.UTC(1988, JAN, 1), offsetChange: 1, description: 'Leap second' },
  { unixMillis: Date.UTC(1990, JAN, 1), offsetChange: 1, description: 'Leap second' },
  { unixMillis: Date.UTC(1991, JAN, 1), offsetChange: 1, description: 'Leap second' },
  { unixMillis: Date.UTC(1992, JUL, 1), offsetChange: 1, description: 'Leap second' },
  { unixMillis: Date.UTC(1993, JUL, 1), offsetChange: 1, description: 'Leap second' },
  { unixMillis: Date.UTC(1994, JUL, 1), offsetChange: 1, description: 'Leap second' },
  { unixMillis: Date.UTC(1996, JAN, 1), offsetChange: 1, description: 'Leap second' },
  { unixMillis: Date.UTC(1997, JUL, 1), offsetChange: 1, description: 'Leap second' },
  { unixMillis: Date.UTC(1999, JAN, 1), offsetChange: 1, description: 'Leap second' },
  { unixMillis: Date.UTC(2006, JAN, 1), offsetChange: 1, description: 'Leap second' },
  { unixMillis: Date.UTC(2009, JAN, 1), offsetChange: 1, description: 'Leap second' },
  { unixMillis: Date.UTC(2012, JUL, 1), offsetChange: 1, description: 'Leap second' },
  { unixMillis: Date.UTC(2015, JUL, 1), offsetChange: 1, description: 'Leap second' },
  {
    unixMillis: Date.UTC(2017, JAN, 1),
    offsetChange: 1,
    description: (
      <>
        Leap second.<br />
        Most recent inserted time<br />
      </>
    )
  },
  CURRENT_POINT,
  FUTURE_POINT
]
