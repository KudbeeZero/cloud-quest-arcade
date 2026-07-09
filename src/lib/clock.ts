/**
 * Isolated impure clock read.
 *
 * Timing (for the arcade speed bonus) only happens inside event handlers, never
 * during render. Wrapping the call here keeps the impure `Date.now()` out of
 * component bodies so React purity lint rules stay satisfied.
 */
export function now(): number {
  return Date.now();
}
