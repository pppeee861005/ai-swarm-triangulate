/**
 * 防騙局檢查器
 *
 * 檢查項目：
 * - 三維信號一致性（排除虛假突破）
 * - 流動性陷阱（警惕大單誘騙）
 * - 技術形態陷阱（假突破）
 * - 籌碼異常（莊家對倒）
 *
 * @author AI Agent Commander
 */

class FraudDetector {
  constructor(config) {
    this.symbol = config.symbol;
    this.market = config.market || 'US';
  }

  /**
   * 執行防騙局檢查
   */
  async check(scores) {
    try {
      const checks = {
        consistency: this.checkConsistency(scores),
        liquidityTrap: this.checkLiquidityTrap(scores),
        technicalFake: this.checkTechnicalFake(scores),
        chipAnomaly: this.checkChipAnomaly(scores)
      };

      // 計算總體欺詐風險
      const isFraud = Object.values(checks).some(c => c.isFraud === true);

      const fraudScore = Object.values(checks).reduce(
        (sum, c) => sum + (c.riskLevel || 0),
        0
      ) / Object.keys(checks).length;

      const failedChecks = Object.entries(checks)
        .filter(([_, v]) => v.isFraud === true)
        .map(([k]) => k);

      // 生成建議
      const recommendation = this.generateRecommendation({
        isFraud,
        fraudScore,
        failedChecks,
        scores
      });

      return {
        isFraud: isFraud,
        riskLevel: fraudScore,
        failedChecks: failedChecks,
        recommendation: recommendation,
        details: checks
      };

    } catch (error) {
      console.error('防騙局檢查錯誤:', error);
      return {
        isFraud: false,
        riskLevel: 0.3,
        failedChecks: [],
        recommendation: 'PROCEED_WITH_CAUTION',
        details: null
      };
    }
  }

  /**
   * 三維信號一致性檢查
   * 如果三個維度信號互相矛盾，可能是騙局
   */
  checkConsistency(scores) {
    const chipUp = scores.chip.score > 0.5;
    const fundamentalUp = scores.fundamental.score > 0.5;
    const technicalUp = scores.technical.score > 0.5;

    // 計算信號一致性
    const agreements = [
      chipUp === fundamentalUp,
      chipUp === technicalUp,
      fundamentalUp === technicalUp
    ].filter(Boolean).length;

    // 至少 2 個維度同向為一致
    const isConsistent = agreements >= 2;

    return {
      isFraud: !isConsistent,
      riskLevel: isConsistent ? 0 : 0.7,
      chipUp: chipUp,
      fundamentalUp: fundamentalUp,
      technicalUp: technicalUp,
      agreement: agreements,
      interpretation: isConsistent
        ? '三維信號一致，可信度高'
        : '三維信號分歧，警惕騙局'
    };
  }

  /**
   * 流動性陷阱檢查
   * 檢查是否有大單誘騙跡象
   */
  checkLiquidityTrap(scores) {
    const chipScore = scores.chip.score;
    const technicalScore = scores.technical.score;

    // 如果籌碼和技術面背離，可能是流動性陷阱
    const diff = Math.abs(chipScore - technicalScore);

    const isLiquidityTrap = diff > 0.4;

    return {
      isFraud: isLiquidityTrap,
      riskLevel: Math.min(diff, 0.7),
      chipTechnicalDiff: diff,
      interpretation: isLiquidityTrap
        ? '籌碼和技術背離，警惕主力誘騙'
        : '籌碼技術配合良好'
    };
  }

  /**
   * 技術形態陷阱檢查
   * 檢查是否有虛假突破跡象
   */
  checkTechnicalFake(scores) {
    const technicalScore = scores.technical.score;
    const fundamentalScore = scores.fundamental.score;

    // 技術面超強但基本面支撐不足，可能是假突破
    const isFakeBullish =
      technicalScore > 0.7 && fundamentalScore < 0.4;

    // 技術面超弱但沒有基本面惡化，可能是假跌
    const isFakeBearish =
      technicalScore < 0.3 && fundamentalScore > 0.6;

    const isFake = isFakeBullish || isFakeBearish;

    return {
      isFraud: isFake,
      riskLevel: isFake ? 0.6 : 0.1,
      isFakeBullish: isFakeBullish,
      isFakeBearish: isFakeBearish,
      interpretation: isFake
        ? '技術面與基本面不符，警惕虛假突破'
        : '技術面有基本面支撐'
    };
  }

  /**
   * 籌碼異常檢查
   * 檢查是否有莊家對倒或異常操縱跡象
   */
  checkChipAnomaly(scores) {
    const chipScore = scores.chip.score;
    const compositeScore = scores.composite.score;

    // 籌碼面異常強勢（> 0.8）但綜合信號中等，可能是對倒
    const isChipManipulation =
      chipScore > 0.8 && compositeScore < 0.5;

    return {
      isFraud: isChipManipulation,
      riskLevel: isChipManipulation ? 0.5 : 0.2,
      chipScore: chipScore,
      compositeScore: compositeScore,
      interpretation: isChipManipulation
        ? '籌碼面異常，警惕主力對倒'
        : '籌碼面正常'
    };
  }

  /**
   * 生成防騙局建議
   */
  generateRecommendation({
    isFraud,
    fraudScore,
    failedChecks,
    scores
  }) {
    if (isFraud && fraudScore > 0.6) {
      return 'WAIT';
    }

    if (fraudScore > 0.3) {
      return 'PROCEED_WITH_CAUTION';
    }

    if (scores.composite.score < 0.3 || scores.composite.score > 0.7) {
      return 'PROCEED';
    }

    return 'HOLD';
  }
}

export { FraudDetector };
