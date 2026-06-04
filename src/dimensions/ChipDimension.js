/**
 * 籌碼維度分析
 *
 * 分析重點：
 * - 大單流向（機構進出）
 * - 持倉變化速率
 * - 籌碼集中度
 * - 籌碼換手率
 *
 * @author AI Agent Commander
 */

class ChipDimension {
  constructor(config) {
    this.symbol = config.symbol;
    this.market = config.market || 'US';
  }

  /**
   * 執行籌碼維度分析
   */
  async analyze(scoutReport) {
    try {
      // 分析各個指標
      const bigOrderFlow = this.analyzeBigOrderFlow(scoutReport);
      const positionChange = this.analyzePositionChange(scoutReport);
      const concentration = this.analyzeConcentration(scoutReport);
      const turnoverRate = this.analyzeTurnoverRate(scoutReport);

      // 計算籌碼維度綜合分數
      const score =
        bigOrderFlow.strength * 0.4 +
        positionChange.momentum * 0.3 +
        concentration.efficiency * 0.2 +
        turnoverRate.healthiness * 0.1;

      return {
        score: Math.min(Math.max(score, 0), 1), // 限制在 0-1 範圍
        confidence: this.calculateConfidence({
          bigOrderFlow,
          positionChange,
          concentration,
          turnoverRate
        }),
        details: {
          bigOrderFlow,
          positionChange,
          concentration,
          turnoverRate
        },
        reasoning: `籌碼維度: 大單${bigOrderFlow.direction === 'BUY' ? '買入' : '賣出'}，持倉${positionChange.direction === 'UP' ? '增加' : '減少'}，集中度${concentration.level}`
      };

    } catch (error) {
      console.error('籌碼維度分析錯誤:', error);
      return {
        score: 0.5,
        confidence: 0.3,
        details: null,
        reasoning: '籌碼維度分析中出現錯誤'
      };
    }
  }

  /**
   * 分析大單流向
   * - 大單持續買入 → 機構看多
   * - 大單持續賣出 → 機構看空
   */
  analyzeBigOrderFlow(scoutReport) {
    // 檢查是否有大單信號
    const bigOrderTrigger = scoutReport.triggers?.find(
      t => t.type === 'BIG_ORDER_IN' || t.type === 'BIG_ORDER_OUT'
    );

    if (!bigOrderTrigger) {
      return {
        detected: false,
        direction: 'NEUTRAL',
        strength: 0.5,
        amount: 0
      };
    }

    const isBuyOrder = bigOrderTrigger.type === 'BIG_ORDER_IN';
    const strength = Math.min(
      0.9,
      0.5 + (bigOrderTrigger.amount || 10000000) / 100000000
    );

    return {
      detected: true,
      direction: isBuyOrder ? 'BUY' : 'SELL',
      strength: isBuyOrder ? strength : 1 - strength,
      amount: bigOrderTrigger.amount || 0,
      interpretation: isBuyOrder
        ? '機構進場，看多信號'
        : '機構出逃，看空信號'
    };
  }

  /**
   * 分析持倉變化
   */
  analyzePositionChange(scoutReport) {
    // 模擬持倉變化（實際應來自實時數據）
    const volumeSpikeTrigger = scoutReport.triggers?.find(
      t => t.type === 'VOLUME_SPIKE'
    );

    if (!volumeSpikeTrigger) {
      return {
        momentum: 0.5,
        direction: 'FLAT',
        changeRate: 0
      };
    }

    const spikeRatio = volumeSpikeTrigger.ratio || 1;
    const momentum = Math.min(0.9, 0.5 + (spikeRatio - 1) * 0.1);

    return {
      momentum: momentum,
      direction: spikeRatio > 2 ? 'UP' : 'DOWN',
      changeRate: spikeRatio,
      interpretation: spikeRatio > 2 ? '持倉增加，籌碼進場' : '持倉減少，籌碼出場'
    };
  }

  /**
   * 分析籌碼集中度
   */
  analyzeConcentration(scoutReport) {
    // 根據買賣失衡判斷集中度
    const imbalanceTrigger = scoutReport.triggers?.find(
      t => t.type === 'IMBALANCE'
    );

    if (!imbalanceTrigger) {
      return {
        level: 'MEDIUM',
        efficiency: 0.5,
        riskLevel: 0.3
      };
    }

    const imbalance = Math.abs(imbalanceTrigger.details?.imbalance || 0);
    const efficiency = Math.min(0.9, imbalance);

    let level = 'MEDIUM';
    if (imbalance > 0.5) level = 'HIGH';
    if (imbalance < 0.2) level = 'LOW';

    return {
      level: level,
      efficiency: efficiency,
      riskLevel: imbalance > 0.5 ? 0.7 : 0.3,
      interpretation: level === 'HIGH' ? '籌碼集中，風險高' : '籌碼分散，風險低'
    };
  }

  /**
   * 分析換手率
   */
  analyzeTurnoverRate(scoutReport) {
    // 換手率反映市場活躍度
    const priceSurgeTrigger = scoutReport.triggers?.find(
      t => t.type === 'PRICE_SURGE' || t.type === 'PRICE_DROP'
    );

    if (!priceSurgeTrigger) {
      return {
        healthiness: 0.5,
        level: 'NORMAL'
      };
    }

    const priceChange = Math.abs(priceSurgeTrigger.details?.changePct || 0);
    const healthiness = Math.min(0.9, 0.5 + priceChange / 10);

    return {
      healthiness: healthiness,
      level: priceChange > 3 ? 'HIGH' : 'NORMAL',
      interpretation: priceChange > 3 ? '換手活躍，市場關注度高' : '換手正常'
    };
  }

  /**
   * 計算籌碼維度的置信度
   */
  calculateConfidence({
    bigOrderFlow,
    positionChange,
    concentration,
    turnoverRate
  }) {
    let confidence = 0.5;

    // 大單信號提高置信度
    if (bigOrderFlow.detected) {
      confidence += 0.2;
    }

    // 多個指標同時發生提高置信度
    const signalCount = [
      bigOrderFlow.detected,
      positionChange.momentum > 0.6,
      concentration.level === 'HIGH',
      turnoverRate.level === 'HIGH'
    ].filter(Boolean).length;

    confidence += signalCount * 0.1;

    return Math.min(confidence, 1.0);
  }
}

export { ChipDimension };
