/**
 * ユーザー信頼度スコアリング
 * 入力: ユーザー統計（reviewCount, likeCount, officialLikeCount, richRatio, varianceScore）
 * 可変重み: {count, like, official, rich, variance} 合計1.0
 * 出力: { score: 0..100, trustLevel: 1..10 }
 * 方針:
 *  - 各指標を0..1に正規化（経験的な上限でクリップ）
 *  - ばらつき補正: 評価の標準偏差から (1 - clamp(sd / 2.0, 0, 1)) に変換
 *  - 合成スコア = Σ( normalized_i * weight_i ) * 100
 *  - trustLevel = ceil(score / 10)
 */
export type UserStatsInput = {
  reviewCount: number; // 投稿件数
  likeCount: number; // ユーザーからのイイネ合計
  officialLikeCount: number; // 企業/店舗イイネ合計
  richRatio: number; // 写真添付率/平均文字数から導く0..1
  varianceScore: number; // 評価の標準偏差（例: 0..2想定）
};

export type Weights = {
  count: number;
  like: number;
  official: number;
  rich: number;
  variance: number;
};

export const DEFAULT_WEIGHTS: Weights = {
  count: 0.3,
  like: 0.3,
  official: 0.2,
  rich: 0.1,
  variance: 0.1,
};

// 経験的上限（このMVPでは固定）
const MAX_REVIEW = 200; // 200件で飽和
const MAX_LIKE = 1000; // 1000いいねで飽和
const MAX_OFFICIAL = 200; // 公式200で飽和

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

export function normalizeStats(s: UserStatsInput) {
  const countN = clamp(s.reviewCount / MAX_REVIEW, 0, 1);
  const likeN = clamp(s.likeCount / MAX_LIKE, 0, 1);
  const officialN = clamp(s.officialLikeCount / MAX_OFFICIAL, 0, 1);
  const richN = clamp(s.richRatio, 0, 1);
  // 標準偏差が小さいほど安定 → (1 - sd/2) を0..1に
  const varianceN = clamp(1 - s.varianceScore / 2.0, 0, 1);
  return { countN, likeN, officialN, richN, varianceN };
}

export function calcScore(
  s: UserStatsInput,
  weights: Weights = DEFAULT_WEIGHTS,
) {
  // 重みの合計は1に正規化（管理画面で編集された場合の安全弁）
  const sumW =
    weights.count +
    weights.like +
    weights.official +
    weights.rich +
    weights.variance;
  const w = {
    count: weights.count / sumW,
    like: weights.like / sumW,
    official: weights.official / sumW,
    rich: weights.rich / sumW,
    variance: weights.variance / sumW,
  };

  const { countN, likeN, officialN, richN, varianceN } = normalizeStats(s);

  const score01 =
    countN * w.count +
    likeN * w.like +
    officialN * w.official +
    richN * w.rich +
    varianceN * w.variance;

  const score = clamp(Math.round(score01 * 100), 0, 100);
  const trustLevel = clamp(Math.ceil(score / 10), 1, 10);

  return { score, trustLevel };
}
