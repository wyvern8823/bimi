import { describe, it, expect } from 'vitest';
import { calcScore, DEFAULT_WEIGHTS } from './scoring';

describe('scoring', () => {
  it('basic scoring increases with inputs', () => {
    const low = calcScore(
      {
        reviewCount: 1,
        likeCount: 0,
        officialLikeCount: 0,
        richRatio: 0.1,
        varianceScore: 1.8,
      },
      DEFAULT_WEIGHTS,
    );
    const high = calcScore(
      {
        reviewCount: 150,
        likeCount: 800,
        officialLikeCount: 120,
        richRatio: 0.9,
        varianceScore: 0.3,
      },
      DEFAULT_WEIGHTS,
    );
    expect(high.score).toBeGreaterThan(low.score);
    expect(high.trustLevel).toBeGreaterThanOrEqual(low.trustLevel);
  });

  it('weights normalize automatically', () => {
    const res = calcScore(
      {
        reviewCount: 100,
        likeCount: 500,
        officialLikeCount: 50,
        richRatio: 0.5,
        varianceScore: 1,
      },
      { count: 3, like: 3, official: 2, rich: 1, variance: 1 } as any,
    );
    expect(res.trustLevel).toBeGreaterThanOrEqual(1);
  });
});
