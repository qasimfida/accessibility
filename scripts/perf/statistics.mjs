/** Keep raw samples intact; use the middle-pair median and nearest-rank p95. */
export function summarize(samples) {
  if (
    samples.length !== 30 ||
    samples.some((n) => !Number.isFinite(n) || n < 0)
  )
    throw new Error('Expected exactly 30 finite, nonnegative init samples.');
  const sorted = [...samples].sort((a, b) => a - b);
  return {
    medianMs: (sorted[14] + sorted[15]) / 2,
    p95Ms: sorted[Math.ceil(sorted.length * 0.95) - 1],
  };
}

/** A shared runner may report absolute times, but only its trend is a CI gate. */
export function regression(current, baseline) {
  if (!Number.isFinite(baseline) || baseline <= 0)
    throw new Error('A positive committed baseline median is required.');
  const limitMs = baseline * 1.5;
  // Subtracting performance.now timestamps introduces tiny binary cancellation
  // errors. Compare at picosecond precision, far below browser timer resolution,
  // while preserving the raw samples and reported statistics for inspection.
  return {
    limitMs,
    pass: Number(current.toFixed(9)) <= Number(limitMs.toFixed(9)),
  };
}
