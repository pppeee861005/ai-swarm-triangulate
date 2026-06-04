/**
 * Triangulate Agent - 三維獵殺
 *
 * 職責：
 * - 整合 Scout 的監控信號
 * - 分析籌碼、基本、技術三個維度
 * - 動態權重調整
 * - 防騙局檢查
 * - 生成投資建議
 *
 * @author AI Agent Commander
 * @version 0.1.0
 * @model Claude Opus（複雜決策）+ Claude Haiku（快速分析）
 */

import { ChipDimension } from './dimensions/ChipDimension.js';
import { FundamentalDimension } from './dimensions/FundamentalDimension.js';
import { TechnicalDimension } from './dimensions/TechnicalDimension.js';
import { FraudDetector } from './validators/FraudDetector.js';
import { WeightCalculator } from './utils/WeightCalculator.js';

// ============================================================
// 信號等級定義
// ============================================================

const SIGNAL_LEVELS = {
  STRONG_BUY: 'STRONG_BUY',       // 0.8-1.0
  BUY: 'BUY',                     // 0.6-0.8
  HOLD: 'HOLD',                   // 0.4-0.6
  SELL: 'SELL',                   // 0.2-0.4
  STRONG_SELL: 'STRONG_SELL'      // 0.0-0.2
};

const CONFIDENCE_LEVELS = {
  VERY_HIGH: 0.9,
  HIGH: 0.7,
  MEDIUM: 0.5,
  LOW: 0.3,
  VERY_LOW: 0.1
};

// ============================================================
// Triangulate Agent 主類
// ============================================================

class TriangulateAgent {
  /**
   * 創建 Triangulate Agent
   * @param {Object} config - 配置對象
   * @param {string} config.symbol - 股票代碼
   * @param {string} config.name - 股票名稱
   * @param {string} config.market - 市場（TW/US/HK）
   * @param {Object} config.weights - 三維權重配置
   * @param {Object} config.dataSource - 數據源接口
   */
  constructor(config) {
    this.agentId = `Triangulate-${config.symbol}`;
    this.symbol = config.symbol;
    this.name = config.name || config.symbol;
    this.market = config.market || 'US';

    // 初始化三個維度分析器
    this.chipDimension = new ChipDimension(config);
    this.fundamentalDimension = new FundamentalDimension(config);
    this.technicalDimension = new TechnicalDimension(config);

    // 權重配置（可動態調整）
    this.baseWeights = {
      chip: config.weights?.chip || 0.35,
      fundamental: config.weights?.fundamental || 0.35,
      technical: config.weights?.technical || 0.30
    };

    // 當前權重（會被動態調整）
    this.currentWeights = { ...this.baseWeights };

    // 初始化工具
    this.weightCalculator = new WeightCalculator(this.baseWeights);
    this.fraudDetector = new FraudDetector(config);

    // 歷史記錄
    this.analysisHistory = [];
    this.analysisCount = 0;
    this.lastAnalysisTime = null;
  }

  /**
   * 執行三維分析（主方法）
   * @param {Object} scoutReport - Scout Agent 的報告
   * @returns {Promise<Object>} 三維分析結果
   */
  async analyze(scoutReport) {
    const startTime = Date.now();
    this.analysisCount++;

    try {
      // 1. 並行獲取三個維度的分析
      const [chipScore, fundamentalScore, technicalScore] = await Promise.all([
        this.chipDimension.analyze(scoutReport),
        this.fundamentalDimension.analyze(scoutReport),
        this.technicalDimension.analyze(scoutReport)
      ]);

      // 2. 動態調整權重
      this.currentWeights = this.weightCalculator.adjustWeights({
        chipScore,
        fundamentalScore,
        technicalScore,
        scoutReport
      });

      // 3. 計算加權綜合信號
      const compositeScore = this.calculateCompositeScore(
        chipScore,
        fundamentalScore,
        technicalScore,
        this.currentWeights
      );

      // 4. 防騙局檢查
      const fraudCheck = await this.fraudDetector.check({
        chip: chipScore,
        fundamental: fundamentalScore,
        technical: technicalScore,
        composite: compositeScore,
        scout: scoutReport
      });

      // 5. 生成最終報告
      const report = this.generateReport({
        scout: scoutReport,
        dimensions: {
          chip: chipScore,
          fundamental: fundamentalScore,
          technical: technicalScore
        },
        weights: this.currentWeights,
        composite: compositeScore,
        fraud: fraudCheck,
        duration: Date.now() - startTime
      });

      // 6. 保存歷史記錄
      this.analysisHistory.push(report);
      this.lastAnalysisTime = new Date().toISOString();

      return report;

    } catch (error) {
      return this.generateErrorReport(error, startTime);
    }
  }

  /**
   * 計算加權綜合信號
   * score = chip_score * w_chip + fundamental_score * w_fundamental + technical_score * w_technical
   */
  calculateCompositeScore(chipScore, fundamentalScore, technicalScore, weights) {
    // 提取各維度的分數
    const chipValue = chipScore.score || 0.5;
    const fundamentalValue = fundamentalScore.score || 0.5;
    const technicalValue = technicalScore.score || 0.5;

    // 計算加權綜合分數
    const compositeScore =
      chipValue * weights.chip +
      fundamentalValue * weights.fundamental +
      technicalValue * weights.technical;

    // 計算各維度的貢獻度
    const contributions = {
      chip: chipValue * weights.chip,
      fundamental: fundamentalValue * weights.fundamental,
      technical: technicalValue * weights.technical
    };

    // 判斷信號等級
    const level = this.scoreToSignalLevel(compositeScore);

    // 計算置信度
    const confidence = this.calculateConfidence({
      chipScore,
      fundamentalScore,
      technicalScore,
      compositeScore,
      agreement: this.calculateAgreement(chipValue, fundamentalValue, technicalValue)
    });

    return {
      score: compositeScore,
      level: level,
      confidence: confidence,
      contributions: contributions,
      reasoning: {
        chipDimension: chipScore.reasoning || '籌碼維度分析中',
        fundamentalDimension: fundamentalScore.reasoning || '基本面維度分析中',
        technicalDimension: technicalScore.reasoning || '技術面維度分析中'
      }
    };
  }

  /**
   * 分數轉換為信號等級
   */
  scoreToSignalLevel(score) {
    if (score >= 0.8) return SIGNAL_LEVELS.STRONG_BUY;
    if (score >= 0.6) return SIGNAL_LEVELS.BUY;
    if (score >= 0.4) return SIGNAL_LEVELS.HOLD;
    if (score >= 0.2) return SIGNAL_LEVELS.SELL;
    return SIGNAL_LEVELS.STRONG_SELL;
  }

  /**
   * 計算三維信號一致性
   * 如果三個維度信號方向一致，一致性高
   */
  calculateAgreement(chipValue, fundamentalValue, technicalValue) {
    // 計算標準差（偏差越小，一致性越高）
    const mean = (chipValue + fundamentalValue + technicalValue) / 3;
    const variance =
      Math.pow(chipValue - mean, 2) +
      Math.pow(fundamentalValue - mean, 2) +
      Math.pow(technicalValue - mean, 2);
    const stdDev = Math.sqrt(variance / 3);

    // 一致性分數：stdDev 越小，agreement 越高
    const agreement = Math.max(0, 1 - stdDev);
    return agreement;
  }

  /**
   * 計算綜合置信度
   */
  calculateConfidence({
    chipScore,
    fundamentalScore,
    technicalScore,
    compositeScore,
    agreement
  }) {
    let confidence = 0.5; // 基礎置信度

    // 各維度置信度的加權平均
    const dimensionConfidence =
      (chipScore.confidence || 0.5) * this.currentWeights.chip +
      (fundamentalScore.confidence || 0.5) * this.currentWeights.fundamental +
      (technicalScore.confidence || 0.5) * this.currentWeights.technical;

    confidence = dimensionConfidence * 0.7 + agreement * 0.3;

    // 信號強度加成（極端信號更有信心）
    if (compositeScore >= 0.8 || compositeScore <= 0.2) {
      confidence = Math.min(confidence * 1.1, 1.0);
    }

    return Math.min(confidence, 1.0);
  }

  /**
   * 生成最終分析報告
   */
  generateReport({
    scout,
    dimensions,
    weights,
    composite,
    fraud,
    duration
  }) {
    return {
      // 元數據
      agentId: this.agentId,
      symbol: this.symbol,
      name: this.name,
      market: this.market,
      timestamp: new Date().toISOString(),
      analysisNumber: this.analysisCount,

      // 輸入信息
      input: {
        scoutTriggersCount: scout.triggers?.length || 0,
        scoutTriggersTypes: scout.triggers?.map(t => t.type) || []
      },

      // 三維分析結果
      dimensions: {
        chip: {
          score: dimensions.chip.score,
          confidence: dimensions.chip.confidence,
          details: dimensions.chip.details
        },
        fundamental: {
          score: dimensions.fundamental.score,
          confidence: dimensions.fundamental.confidence,
          details: dimensions.fundamental.details
        },
        technical: {
          score: dimensions.technical.score,
          confidence: dimensions.technical.confidence,
          details: dimensions.technical.details
        }
      },

      // 權重配置
      weights: weights,

      // 綜合信號
      composite: {
        score: composite.score,
        level: composite.level,
        confidence: composite.confidence,
        contributions: composite.contributions
      },

      // 防騙局檢查
      fraud: {
        isFraud: fraud.isFraud,
        riskLevel: fraud.riskLevel,
        recommendation: fraud.recommendation,
        failedChecks: fraud.failedChecks
      },

      // 最終建議
      recommendation: this.generateRecommendation({
        composite,
        fraud,
        scoutReport: scout
      }),

      // 性能指標
      metrics: {
        durationMs: duration,
        analysisCount: this.analysisCount
      }
    };
  }

  /**
   * 生成最終投資建議
   */
  generateRecommendation({ composite, fraud, scoutReport }) {
    // 如果檢測到騙局，降級建議
    if (fraud.isFraud && fraud.riskLevel > 0.6) {
      return {
        action: 'WAIT',
        reason: '檢測到可能的騙局信號，建議觀望',
        riskWarnings: fraud.failedChecks
      };
    }

    // 根據信號等級生成建議
    const baseRecommendation = {
      [SIGNAL_LEVELS.STRONG_BUY]: {
        action: 'BUY',
        positionSize: '重倉',
        reason: '三維強烈看多信號'
      },
      [SIGNAL_LEVELS.BUY]: {
        action: 'BUY',
        positionSize: '標準',
        reason: '三維看多信號'
      },
      [SIGNAL_LEVELS.HOLD]: {
        action: 'HOLD',
        positionSize: '觀望',
        reason: '三維中性信號'
      },
      [SIGNAL_LEVELS.SELL]: {
        action: 'SELL',
        positionSize: '標準',
        reason: '三維看空信號'
      },
      [SIGNAL_LEVELS.STRONG_SELL]: {
        action: 'SELL',
        positionSize: '重倉',
        reason: '三維強烈看空信號'
      }
    };

    const recommendation = baseRecommendation[composite.level];

    return {
      ...recommendation,
      confidence: composite.confidence,
      validityPeriod: '5-30分鐘',
      nextReviewTime: new Date(Date.now() + 5 * 60 * 1000).toISOString()
    };
  }

  /**
   * 生成錯誤報告
   */
  generateErrorReport(error, startTime) {
    return {
      agentId: this.agentId,
      symbol: this.symbol,
      timestamp: new Date().toISOString(),
      status: 'ERROR',
      error: {
        message: error.message,
        stack: error.stack
      },
      metrics: {
        durationMs: Date.now() - startTime,
        analysisCount: this.analysisCount
      }
    };
  }

  /**
   * 獲取 Agent 狀態
   */
  getStatus() {
    return {
      agentId: this.agentId,
      symbol: this.symbol,
      analysisCount: this.analysisCount,
      lastAnalysisTime: this.lastAnalysisTime,
      currentWeights: this.currentWeights,
      baseWeights: this.baseWeights,
      analysisHistoryLength: this.analysisHistory.length
    };
  }

  /**
   * 更新基礎權重配置
   */
  updateBaseWeights(newWeights) {
    this.baseWeights = { ...this.baseWeights, ...newWeights };
    this.weightCalculator.updateBaseWeights(this.baseWeights);
  }

  /**
   * 獲取分析歷史（最近 N 次）
   */
  getAnalysisHistory(limit = 10) {
    return this.analysisHistory.slice(-limit);
  }

  /**
   * 清除歷史記錄
   */
  clearHistory() {
    this.analysisHistory = [];
  }
}

// ============================================================
// 導出
// ============================================================

export {
  TriangulateAgent,
  SIGNAL_LEVELS,
  CONFIDENCE_LEVELS
};
