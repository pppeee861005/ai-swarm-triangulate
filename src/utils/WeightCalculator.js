/**
 * 權重計算器
 *
 * 根據市場環境動態調整三個維度的權重：
 * - 牛市：技術權重 ↑
 * - 熊市：籌碼權重 ↑
 * - 不確定性高：基本面權重 ↑
 *
 * @author AI Agent Commander
 */

class WeightCalculator {
  constructor(baseWeights) {
    this.baseWeights = baseWeights || {
      chip: 0.35,
      fundamental: 0.35,
      technical: 0.3
    };
  }

  /**
   * 動態調整權重
   */
  adjustWeights({
    chipScore,
    fundamentalScore,
    technicalScore,
    scoutReport
  }) {
    let weights = { ...this.baseWeights };

    // 計算市場環境指標
    const momentum = this.calculateMomentum(technicalScore);
    const volatility = this.calculateVolatility(scoutReport);
    const consistency = this.calculateConsistency({
      chipScore,
      fundamentalScore,
      technicalScore
    });

    // 根據動量調整權重（牛熊市判斷）
    if (momentum > 0.6) {
      // 上升趨勢明確，增加技術面權重
      weights.technical = Math.min(this.baseWeights.technical * 1.3, 0.45);
      weights.chip = Math.max(this.baseWeights.chip * 0.9, 0.25);
    } else if (momentum < 0.4) {
      // 下跌趨勢明確，增加籌碼面權重
      weights.chip = Math.min(this.baseWeights.chip * 1.3, 0.45);
      weights.technical = Math.max(this.baseWeights.technical * 0.9, 0.2);
    }

    // 根據波動率調整權重
    if (volatility > 0.5) {
      // 波動大，增加籌碼面權重
      weights.chip = Math.min(weights.chip * 1.15, 0.5);
      weights.technical = Math.max(weights.technical * 0.9, 0.2);
    } else if (volatility < 0.2) {
      // 波動小，增加技術和基本面權重
      weights.technical = Math.min(weights.technical * 1.1, 0.4);
      weights.chip = Math.max(weights.chip * 0.95, 0.3);
    }

    // 根據信號一致性調整權重
    if (consistency > 0.7) {
      // 三維信號一致性高，所有權重保持或適度調整
      // 不做大調整
    } else if (consistency < 0.3) {
      // 三維信號分歧，增加基本面權重（作為穩定錨點）
      weights.fundamental = Math.min(
        this.baseWeights.fundamental * 1.2,
        0.45
      );
      weights.technical = Math.max(weights.technical * 0.9, 0.2);
    }

    // 歸一化（保證和為 1）
    const sum = weights.chip + weights.fundamental + weights.technical;
    return {
      chip: weights.chip / sum,
      fundamental: weights.fundamental / sum,
      technical: weights.technical / sum,
      reason: this.generateAdjustmentReason({
        momentum,
        volatility,
        consistency
      })
    };
  }

  /**
   * 計算動量（確定牛熊市）
   */
  calculateMomentum(technicalScore) {
    // 技術面分數 > 0.5 = 看多，< 0.5 = 看空
    return technicalScore.score || 0.5;
  }

  /**
   * 計算波動率
   */
  calculateVolatility(scoutReport) {
    const triggersCount = scoutReport.triggers?.length || 0;
    // 觸發信號越多，波動越大
    return Math.min(triggersCount * 0.15, 0.8);
  }

  /**
   * 計算三維信號一致性
   */
  calculateConsistency({
    chipScore,
    fundamentalScore,
    technicalScore
  }) {
    const chipValue = chipScore.score || 0.5;
    const fundamentalValue = fundamentalScore.score || 0.5;
    const technicalValue = technicalScore.score || 0.5;

    // 計算標準差
    const mean = (chipValue + fundamentalValue + technicalValue) / 3;
    const variance =
      Math.pow(chipValue - mean, 2) +
      Math.pow(fundamentalValue - mean, 2) +
      Math.pow(technicalValue - mean, 2);
    const stdDev = Math.sqrt(variance / 3);

    // 一致性 = 1 - stdDev（stdDev 越小，一致性越高）
    const consistency = Math.max(0, 1 - stdDev);
    return consistency;
  }

  /**
   * 生成調整原因說明
   */
  generateAdjustmentReason({
    momentum,
    volatility,
    consistency
  }) {
    const reasons = [];

    if (momentum > 0.6) {
      reasons.push('上升趨勢明確，提升技術權重');
    } else if (momentum < 0.4) {
      reasons.push('下跌趨勢明確，提升籌碼權重');
    }

    if (volatility > 0.5) {
      reasons.push('波動增大，提升籌碼權重');
    } else if (volatility < 0.2) {
      reasons.push('波動平靜，提升技術和基本權重');
    }

    if (consistency < 0.3) {
      reasons.push('信號分歧，提升基本面權重');
    }

    return reasons.length > 0
      ? reasons.join('；')
      : '市場環境穩定，維持基礎權重';
  }

  /**
   * 更新基礎權重
   */
  updateBaseWeights(newWeights) {
    this.baseWeights = { ...this.baseWeights, ...newWeights };
  }

  /**
   * 獲取當前基礎權重
   */
  getBaseWeights() {
    return { ...this.baseWeights };
  }
}

export { WeightCalculator };
