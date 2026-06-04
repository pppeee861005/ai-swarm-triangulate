/**
 * 例子 1：基礎三維分析
 *
 * 最簡單的用法：監控單支股票，執行三維分析
 * 代碼行數 < 50 行
 * 完整的註釋
 *
 * 運行：npm run dev
 */

import { TriangulateAgent } from '../src/Agent.Triangulate.js';

// 創建分析 Agent
const agent = new TriangulateAgent({
  symbol: 'AAPL',
  name: 'Apple Inc.',
  market: 'US',
  weights: {
    chip: 0.35,
    fundamental: 0.35,
    technical: 0.30
  }
});

// 模擬 Scout Agent 的報告
// 這來自 ai-swarm-monitor 的監控結果
const scoutReport = {
  symbol: 'AAPL',
  timestamp: new Date().toISOString(),
  triggers: [
    {
      type: 'BIG_ORDER_IN',
      amount: 50000000,
      description: '大單買入 5000 萬'
    },
    {
      type: 'VOLUME_SPIKE',
      ratio: 3.5,
      description: '成交量突增 3.5 倍'
    },
    {
      type: 'PRICE_SURGE',
      percent: 3.2,
      description: '價格急漲 3.2%'
    },
    {
      type: 'RESISTANCE_BREAK',
      details: {
        currentPrice: 178.5,
        resistanceLevel: 175.3,
        breakPercent: 1.82
      },
      description: '突破壓力位'
    }
  ]
};

console.log('\n=== 三維獵殺分析 ===\n');
console.log(`股票代碼: ${scoutReport.symbol}`);
console.log(`分析時間: ${scoutReport.timestamp}`);
console.log(`Scout 監控信號數: ${scoutReport.triggers.length}\n`);

// 執行三維分析
agent.analyze(scoutReport).then(result => {
  // 展示結果
  console.log('【 三維分析結果 】\n');

  console.log(`📊 綜合信號: ${result.composite.level}`);
  console.log(`   分數: ${(result.composite.score * 100).toFixed(1)}%`);
  console.log(`   置信度: ${(result.composite.confidence * 100).toFixed(1)}%\n`);

  console.log('【 三維維度分數 】\n');
  console.log(
    `籌碼面: ${(result.dimensions.chip.score * 100).toFixed(1)}% (權重: ${(result.weights.chip * 100).toFixed(1)}%)`
  );
  console.log(
    `基本面: ${(result.dimensions.fundamental.score * 100).toFixed(1)}% (權重: ${(result.weights.fundamental * 100).toFixed(1)}%)`
  );
  console.log(
    `技術面: ${(result.dimensions.technical.score * 100).toFixed(1)}% (權重: ${(result.weights.technical * 100).toFixed(1)}%)\n`
  );

  console.log('【 各維度貢獻度 】\n');
  console.log(
    `籌碼貢獻: ${(result.composite.contributions.chip * 100).toFixed(1)}%`
  );
  console.log(
    `基本面貢獻: ${(result.composite.contributions.fundamental * 100).toFixed(1)}%`
  );
  console.log(
    `技術面貢獻: ${(result.composite.contributions.technical * 100).toFixed(1)}%\n`
  );

  console.log('【 防騙局檢查 】\n');
  console.log(
    `檢測結果: ${result.fraud.isFraud ? '⚠️ 警告' : '✅ 安全'}`
  );
  console.log(`風險等級: ${(result.fraud.riskLevel * 100).toFixed(1)}%`);
  console.log(
    `建議: ${result.fraud.recommendation === 'PROCEED' ? '放心進行' : '謹慎操作'}`
  );
  if (result.fraud.failedChecks.length > 0) {
    console.log(`失敗檢查: ${result.fraud.failedChecks.join(', ')}`);
  }
  console.log();

  console.log('【 投資建議 】\n');
  console.log(`行動: ${result.recommendation.action}`);
  console.log(`倉位: ${result.recommendation.positionSize}`);
  console.log(`原因: ${result.recommendation.reason}`);
  console.log(`有效期: ${result.recommendation.validityPeriod}`);
  console.log(`下次檢查: ${result.recommendation.nextReviewTime}\n`);

  console.log('【 Agent 狀態 】\n');
  const status = agent.getStatus();
  console.log(`分析次數: ${status.analysisCount}`);
  console.log(`用時: ${result.metrics.durationMs}ms\n`);
});
