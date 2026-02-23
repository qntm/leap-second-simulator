import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
import { MODELS, UNIX_END } from 't-a-i/nanos'

import {
  MODEL_OPTIONS,
  PRECISION_OPTIONS,
  INITIAL_SCALE,
  INITIAL_MODEL,
  INITIAL_PRECISION_OPTION,
  FPSES,
  INITIAL_FPS,
  LATEST_INSERT_POINT,
  CURRENT_POINT
} from '../options.tsx'
import { div, modulo, multiplyByScale } from '../utils.ts'

// TODO: add ATOMIC_END to `t-a-i`

const UNIX_END_DATE = new Date(UNIX_END / 1_000_000)
const UNIX_END_STR = [
  String(UNIX_END_DATE.getUTCFullYear()).padStart(4, '0'),
  '-',
  String(UNIX_END_DATE.getUTCMonth() + 1).padStart(2, '0'),
  '-',
  String(UNIX_END_DATE.getUTCDate()).padStart(2, '0')
].join('')

const FUTURE_WARNING = `⚠ It is unknown how the relationship between TAI and Unix time will evolve after ${UNIX_END_STR}.`
const TRUNCATE_WARNING_1 = '⚠️ Drift rate truncated. Increase precision to ns'
const TRUNCATE_WARNING_2 = '⚠️ Drift rate truncated. Increase precision to µs or ns'

const formatNanos = (nanos, { numDecimalDigits, symbol }) => {
  // Happens during a break
  if (Number.isNaN(nanos)) {
    return <i>indeterminate</i>
  }

  // Happens during a stall
  if (nanos === Infinity) {
    return '∞'
  }

  nanos = div(nanos, 10n ** (9n - numDecimalDigits))

  const isNegative = nanos < 0n
  if (isNegative) {
    nanos = -nanos
  }

  const chars = nanos.toString().split('')
  const chunks = []
  while (chars.length > 0) {
    chunks.unshift(chars.splice(-3).join(''))
  }
  const separated = chunks.join(' ')
  const sign = isNegative ? '-' : ''

  return `${sign}${separated} ${symbol}`
}

const MILLISECONDS_PER_CYCLE = (365n * 400n + 100n - 4n + 1n) * 24n * 60n * 60n * 1000n

const formatScale = scale => scale < -6n
  ? <>10<sup>{scale}</sup>x</>
  : scale < 0n
    ? `0.${'0'.repeat(-Number(scale) - 1)}1x`
    : scale === 0n
      ? 'real time'
      : scale <= 6n
        ? `1${'0'.repeat(Number(scale))}x`
        : <>10<sup>{scale}</sup>x</>

// This can handle nanosecond counts far beyond JavaScript `Date`'s
// limit of 100,000,000 days either way from the Unix epoch
const formatDate = (x, { numDecimalDigits, symbol }) => {
  // This can happen during a break
  if (Number.isNaN(x)) {
    return <i>indeterminate</i>
  }

  const nanos = modulo(x, 1_000n)
  x -= nanos
  x = div(x, 1_000n)

  const micros = modulo(x, 1_000n)
  x -= micros
  x = div(x, 1_000n)

  const millis = modulo(x, MILLISECONDS_PER_CYCLE)
  x -= millis
  x = div(x, MILLISECONDS_PER_CYCLE)

  // `x` is now a count of completed 400-year cycles since the Unix epoch,
  // whereas `millis` is small enough not to overflow `new Date()`:

  const date = new Date(Number(millis))
  const components = [
    String(x * 400n + BigInt(date.getUTCFullYear())).padStart(4, '0'),
    '-',
    String(date.getUTCMonth() + 1).padStart(2, '0'),
    '-',
    String(date.getUTCDate()).padStart(2, '0'),
    ' ',
    String(date.getUTCHours()).padStart(2, '0'),
    ':',
    String(date.getUTCMinutes()).padStart(2, '0'),
    ':',
    String(date.getUTCSeconds()).padStart(2, '0')
  ]

  if (numDecimalDigits > 0n) {
    components.push(
      '.',
      String(date.getUTCMilliseconds()).padStart(3, '0')
    )
  }

  if (numDecimalDigits > 3n) {
    components.push(
      ' ',
      String(micros).padStart(3, '0')
    )
  }

  if (numDecimalDigits > 6n) {
    components.push(
      ' ',
      String(nanos).padStart(3, '0')
    )
  }

  // Why doesn't this line up on mobile? It works locally...
  components.push('\u2007'.repeat(` ${symbol}`.length))

  return components.join('')
}

export const Main = ({
  converter,
  fps,
  getInitialParams,
  goToAtomic,
  goToUnix,
  handleClickMore,
  handleClickPoint,
  model,
  now,
  params,
  precisionOption,
  setFps,
  setModel,
  setNow,
  setPrecisionOption,
  setParams
}) => {
  const handleClickMostRecent = useCallback(() => {
    handleClickPoint(LATEST_INSERT_POINT)
  }, [goToUnix, params])

  // This loses a few milliseconds of accuracy I guess
  const handleClickNow = useCallback(() => {
    handleClickPoint(CURRENT_POINT)
  }, [goToUnix])

  const setScale = useCallback(nextScale => {
    const now = BigInt(Date.now()) * 1_000_000n
    setParams(({ scale, offset, pausedAt }) => {
      const atomicNanos = pausedAt === undefined
        ? multiplyByScale(now, scale) + offset
        : pausedAt

      scale = typeof nextScale === 'function'
        ? nextScale(scale)
        : nextScale

      offset = atomicNanos - multiplyByScale(now, scale)
      return { offset, scale, pausedAt }
    })
    setNow(now)
  }, [])

  const handleClickRealTime = useCallback(
    () => setScale(INITIAL_SCALE),
    [setScale]
  )

  const handleClickSlower = useCallback(
    () => setScale(scale => scale - 1n),
    [setScale]
  )

  const handleClickFaster = useCallback(
    () => setScale(scale => scale + 1n),
    [setScale]
  )

  const handleClickBack = useCallback(() => {
    const now = BigInt(Date.now()) * 1_000_000n
    const atomicNanos = multiplyByScale(now - 5_000_000_000n, params.scale) + params.offset
    goToAtomic(atomicNanos)
  }, [params])

  const handleClickPause = useCallback(() => {
    const now = BigInt(Date.now()) * 1_000_000n
    setParams(({ scale, offset, pausedAt }) => {
      pausedAt = multiplyByScale(now, scale) + offset
      return { offset, scale, pausedAt }
    })
    setNow(now)
  }, [])

  const handleClickUnpause = useCallback(() => {
    const now = BigInt(Date.now()) * 1_000_000n
    setParams(({ scale, offset, pausedAt }) => {
      offset = pausedAt - multiplyByScale(now, scale)
      pausedAt = undefined
      return { offset, scale, pausedAt }
    })
    setNow(now)
  }, [])

  const handleClickReset = useCallback(() => {
    setModel(INITIAL_MODEL)
    setPrecisionOption(INITIAL_PRECISION_OPTION)
    setFps(INITIAL_FPS)
    setParams(getInitialParams())
  }, [getInitialParams])

  // displayed time = real time * scaling factor + offset

  const atomicNanos = multiplyByScale(now, params.scale) + params.offset
  const unixNanos = converter.atomicToUnix(atomicNanos)
  const diffNanos = converter.atomicToOffset(atomicNanos)
  const driftNanos = converter.atomicToDriftRate(atomicNanos)

  return (
    <div className='main'>
      <p>During a leap second, Unix time cannot represent 23:59:60. So what <em>does</em> happen?</p>
      <div>
        <h4>TAI</h4>
        <div className='data'>
          <div className='data-inner'>
            {formatNanos(atomicNanos, precisionOption)}<br />
            {formatDate(atomicNanos, precisionOption)}<br />
          </div>
        </div>
      </div>
      <div>
        <h4>Unix time</h4>
        <div className='data'>
          <div className='data-inner'>
            {formatNanos(unixNanos, precisionOption)}<br />
            {formatDate(unixNanos, precisionOption)}<br />
          </div>
        </div>
        {unixNanos > UNIX_END && (
          <div className='warning'>
            {FUTURE_WARNING}
          </div>
        )}
      </div>
      <div>
        <h4>TAI minus Unix</h4>
        <div className='data'>
          <div className='data-inner'>
            {formatNanos(diffNanos, precisionOption)}<br />
          </div>
        </div>
      </div>
      <div>
        <h4>TAI drift per Unix day</h4>
        <div className='data'>
          <div className='data-inner'>
            {formatNanos(driftNanos, precisionOption)}<br />
          </div>
        </div>
        {
          typeof driftNanos === 'bigint' &&
          driftNanos % 1_000n !== 0n &&
          precisionOption.numDecimalDigits < 9n && (
            <div className='warning'>
              {TRUNCATE_WARNING_1}
            </div>
          )
        }
        {
          typeof driftNanos === 'bigint' &&
          driftNanos % 1_000n === 0n &&
          driftNanos % 1_000_000n !== 0n &&
          precisionOption.numDecimalDigits < 6n && (
            <div className='warning'>
              {TRUNCATE_WARNING_2}
            </div>
          )
        }
      </div>

      <div className='controls'>
        <div className='controls-row'>
          <div>Jump to...</div>
          <div className='buttons'>
            <button onClick={handleClickMostRecent}>
              most recent leap second
            </button>
            <button onClick={handleClickNow}>
              now
            </button>
            <button className='secondary' onClick={handleClickMore}>
              more...
            </button>
          </div>
        </div>

        <div className='controls-row'>
          <div>Precision:</div>
          <div className='buttons'>
            {PRECISION_OPTIONS.map((newPrecision, i) => (
              <button
                key={i}
                disabled={newPrecision === precisionOption}
                onClick={() => setPrecisionOption(newPrecision)}
              >
                {newPrecision.symbol}
              </button>
            ))}
          </div>
        </div>

        <div className='controls-row'>
          <div>
            Speed:&nbsp;<b>{formatScale(params.scale)}</b>
          </div>
          <div className='buttons'>
            <button onClick={handleClickRealTime} disabled={params.scale === INITIAL_SCALE}>
              real time
            </button>
            <button onClick={handleClickSlower}>
              slower
            </button>
            <button onClick={handleClickFaster}>
              faster
            </button>
          </div>
        </div>

        <div className='controls-row'>
          <div>Frames per second:</div>
          <div className='buttons'>
            {FPSES.map((newFps, i) => (
              <button
                key={i}
                disabled={newFps === fps}
                onClick={() => setFps(newFps)}
              >
                {newFps}
              </button>
            ))}
          </div>
        </div>

        <div className='controls-row'>
          <div>
            <a href='https://github.com/qntm/t-a-i?tab=readme-ov-file#modelling-discontinuities'>Model</a>:
          </div>
          <div className='buttons'>
            {MODEL_OPTIONS.map((modelOption, i) => (
              <button
                key={i}
                disabled={modelOption.model === model}
                onClick={() => setModel(modelOption.model)}
              >
                {modelOption.displayName}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className='buttons' style={{ justifyContent: 'center' }}>
        <button className='secondary' onClick={handleClickBack}>
          Back a bit
        </button>

        {params.pausedAt === undefined && (
          <button className='secondary' onClick={handleClickPause}>
            Pause
          </button>
        )}

        {params.pausedAt !== undefined && (
          <button className='secondary' onClick={handleClickUnpause}>
            Unpause
          </button>
        )}

        <button className='secondary' onClick={handleClickReset}>
          Reset
        </button>
      </div>

      <div className='footer'>
        about <a href='https://en.wikipedia.org/wiki/Unix_time#Leap_seconds'>leap seconds in Unix time</a>· <a href='https://github.com/qntm/leap-second-simulator'>source code</a> · built using <code><a href='https://github.com/qntm/t-a-i'>t-a-i</a></code><br />
        <a href='https://qntm.org/src'>Back to Things of Interest</a><br />
      </div>
    </div>
  )
}

Main.displayName = 'Main'
Main.propTypes = {
  converter: PropTypes.shape({
    atomicToUnix: PropTypes.func.isRequired,
    atomicToOffset: PropTypes.func.isRequired,
    atomicToDriftRate: PropTypes.func.isRequired
  }).isRequired,
  fps: PropTypes.number.isRequired,
  getInitialParams: PropTypes.func.isRequired,
  goToAtomic: PropTypes.func.isRequired,
  goToUnix: PropTypes.func.isRequired,
  handleClickPoint: PropTypes.func.isRequired,
  handleClickMore: PropTypes.func.isRequired,
  handleClickReset: PropTypes.func.isRequired,
  model: PropTypes.oneOf([
    MODELS.OVERRUN,
    MODELS.BREAK,
    MODELS.STALL,
    MODELS.SMEAR
  ]).isRequired,
  now: PropTypes.number.isRequired,
  params: PropTypes.shape({
    scale: PropTypes.bigint.isRequired,
    offset: PropTypes.bigint.isRequired,
    pausedAt: PropTypes.bigint
  }).isRequired,
  precisionOption: PropTypes.shape({
    numDecimalDigits: PropTypes.bigint.isRequired,
    symbol: PropTypes.string.isRequired
  }).isRequired,
  setFps: PropTypes.func.isRequired,
  setModel: PropTypes.func.isRequired,
  setPrecisionOption: PropTypes.func.isRequired,
  setParams: PropTypes.func.isRequired,
  setNow: PropTypes.func.isRequired
}
