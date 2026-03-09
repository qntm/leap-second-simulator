export const modulo = (a, b) => ((a % b) + b) % b

// Divide two BigInts and truncate towards negative infinity, not towards zero
// This is important for time calculations before the Unix epoch
export const div = (a, b) => {
  const q = a / b
  if (a % b === 0n) {
    return q
  }
  return (a > 0n) === (b > 0n) ? q : q - 1n
}

export const multiplyByScale = (n, scale) => scale < 0n
  ? div(n, 10n ** -scale)
  : n * 10n ** scale

export const formatScale = scale => {
  if (scale < -6n) {
    return <>10<sup>{String(scale)}</sup>x</>
  }
  if (scale < 0n) {
    return `0.${'0'.repeat(-Number(scale) - 1)}1x`
  }
  if (scale === 0n) {
    return 'real time'
  }
  if (scale <= 6n) {
    return `1${'0'.repeat(Number(scale))}x`
  }
  return <>10<sup>{String(scale)}</sup>x</>
}

export const formatNanos = (nanos, { numDecimalDigits, symbol }) => {
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

// This can handle nanosecond counts far beyond JavaScript `Date`'s
// limit of 100,000,000 days either way from the Unix epoch
export const formatDate = (x, { numDecimalDigits, symbol }) => {
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

  components.push('\u2007'.repeat(` ${symbol}`.length))

  return components.join('')
}
