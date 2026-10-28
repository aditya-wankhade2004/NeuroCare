/**
 * Assessment Engine & High-Resolution Behavioral Utilities
 * Separates test logic, timing, and randomized trial generators from visual components.
 */

export function getPreciseTimestamp() {
  if (typeof window !== 'undefined' && window.performance && window.performance.now) {
    return window.performance.now();
  }
  return Date.now();
}

export function getRandomDelay(minMs = 1500, maxMs = 3800) {
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
}

export function calculateReactionStats(trials, prematureCount, durationMs) {
  if (!trials || trials.length === 0) {
    return {
      median: 0,
      mean: 0,
      fastest: 0,
      slowest: 0,
      validTrialsCount: 0,
      prematureCount,
      duration: '0s',
    };
  }

  const sorted = [...trials].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  const mean = Math.round(trials.reduce((sum, v) => sum + v, 0) / trials.length);
  const fastest = sorted[0];
  const slowest = sorted[sorted.length - 1];
  const durationSec = Math.round(durationMs / 1000);

  return {
    median,
    mean,
    fastest,
    slowest,
    validTrialsCount: trials.length,
    prematureCount,
    duration: `${durationSec} seconds`,
  };
}

export function getRandomShapeChoice(shapesList, targetProbability = 0.4) {
  const isTarget = Math.random() < targetProbability;
  if (isTarget) {
    return shapesList[0]; // Diamond (Target)
  }
  const distractors = shapesList.slice(1);
  const randomIndex = Math.floor(Math.random() * distractors.length);
  return distractors[randomIndex];
}

export function calculateAttentionStats(hits, misses, falseAlarms, correctRejections, hitRts, durationMs) {
  const totalTrials = hits + misses + falseAlarms + correctRejections;
  const correctDecisions = hits + correctRejections;
  const accuracy = totalTrials > 0 ? Math.round((correctDecisions / totalTrials) * 100) : 0;
  const avgHitRt = hitRts.length > 0 ? Math.round(hitRts.reduce((a, b) => a + b, 0) / hitRts.length) : null;
  const durationSec = Math.round(durationMs / 1000);

  return {
    accuracy,
    hits,
    misses,
    falseAlarms,
    correctRejections,
    avgHitRt,
    totalTrials,
    duration: `${durationSec} seconds`,
  };
}

export function generateMemoryTileSequence(length) {
  const seq = [];
  for (let i = 0; i < length; i++) {
    const tile = Math.floor(Math.random() * 9) + 1;
    seq.push(tile);
  }
  return seq;
}

export function calculateMemoryStats(totalAttempts, correctCount, longestSequence, durationMs) {
  const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;
  const durationSec = Math.round(durationMs / 1000);

  return {
    longestSequence,
    accuracy,
    totalAttempts,
    correctCount,
    duration: `${durationSec} seconds`,
  };
}

export function calculateMotionStats(tapTimestamps, testDurationSec) {
  const totalTaps = tapTimestamps.length;
  const tapsPerSec = Number((totalTaps / (testDurationSec || 1)).toFixed(1));

  const intervals = [];
  for (let i = 1; i < tapTimestamps.length; i++) {
    intervals.push(tapTimestamps[i] - tapTimestamps[i - 1]);
  }
  const avgIntervalMs = intervals.length > 0 ? Math.round(intervals.reduce((a, b) => a + b, 0) / intervals.length) : 0;

  return {
    tapsPerSec,
    totalTaps,
    avgIntervalMs,
    duration: `${testDurationSec} seconds`,
  };
}

