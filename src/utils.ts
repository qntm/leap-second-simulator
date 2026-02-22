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
