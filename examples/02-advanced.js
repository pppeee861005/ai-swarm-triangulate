/**
 * 例子 2：進階配置
 *
 * 自定義權重、觸發閾值，演示動態調整
 * 運行：npm run dev:advanced
 */

import { TriangulateAgent } from '../src/Agent.Triangulate.js';

// 創建 Agent，使用自定義權重
const agent = new TriangulateAgent({
  symbol: 'TSLA',
  name: 'Tesla Inc.',
  market: 'US',
  // 自定義權重：在熊市中降低技術面權重，提高籌碼面權重
  weights: {
    chip: 0.45, // 提升籌碼權重（關注機構動向）
    fundamental: 0.30,
    technical: 0.25 // 降低技術權重（熊市中技術面不可靠）
  }
});

// 模擬多個 Scout 報告，測試動態權重調整

// 報告 1：強勢突破信號
const strongBullReport = {
  symbol: 'TSLA',
  timestamp: new Date().toISOString(),
  triggers: [
    { type: 'BIG_ORDER_IN', amount: 100000000 },
    { type: 'VOLUME_SPIKE', ratio: 5.2 },
    { type: 'PRICE_SURGE', percent: 4.5 },
    { type: 'RESISTANCE_BREAK', details: { breakPercent: 2.1 } }
  ]
};

// 報告 2：弱勢信號
const weakSignalReport = {
  symbol: 'TSLA',
  timestamp: new Date().toISOString(),
  triggers: [
    { type: 'PRICE_DROP', percent: 2.1 },
    { type: 'SUPPORT_BREAK', details: { breakPercent: 1.5 } }
  ]
};

// 報告 3：三維分歧信號
const conflictingReport = {
  symbol: 'TSLA',
  timestamp: new Date().toISOString(),
  triggers: [
    { type: 'BIG_ORDER_IN', amount: 30000000 }, // 籌碼看多
    { type: 'PRICE_DROP', percent: 2.0 }, // 技術看空
    { type: 'VOLUME_SPIKE', ratio: 1.5 } // 成交量一般
  ]
};

console.log('\n=== 進階配置：動態權重調整演示 ===\n');

// 分析報告 1
console.log('【 報告 1：強勢突破 】\n');
agent.analyze(strongBullReport).then(result => {
  console.log(
    `信號: ${result.composite.level} (分數: ${(result.composite.score * 100).toFixed(1)}%)`
  );
  console.log(`動態權重: 籌碼 ${(result.weights.chip * 100).toFixed(1)}% | 基本 ${(result.weights.fundamental * 100).toFixed(1)}% | 技術 ${(result.weights.technical * 100).toFixed(1)}%`);
  console.log(`防騙結果: ${result.fraud.recommendation}`);
  console.log(`建議: ${result.recommendation.action}\n`);

  // 分析報告 2
  console.log('【 報告 2：弱勢信號 】\n');
  return agent.analyze(weakSignalReport);
}).then(result => {
  console.log(
    `信號: ${result.composite.level} (分數: ${(result.composite.score * 100).toFixed(1)}%)`
  );
  console.log(`動態權重: 籌碼 ${(result.weights.chip * 100).toFixed(1)}% | 基本 ${(result.weights.fundamental * 100).toFixed(1)}% | 技術 ${(result.weights.technical * 100).toFixed(1)}%`);
  console.log(`防騙結果: ${result.fraud.recommendation}`);
  console.log(`建議: ${result.recommendation.action}\n`);

  // 分析報告 3
  console.log('【 報告 3：三維分歧 】\n');
  return agent.analyze(conflictingReport);
}).then(result => {
  console.log(
    `信號: ${result.composite.level} (分數: ${(result.composite.score * 100).toFixed(1)}%)`
  );
  console.log(`動態權重: 籌碼 ${(result.weights.chip * 100).toFixed(1)}% | 基本 ${(result.weights.fundamental * 100).toFixed(1)}% | 技術 ${(result.weights.technical * 100).toFixed(1)}%`);
  console.log(`防騙風險: ${(result.fraud.riskLevel * 100).toFixed(1)}%`);
  console.log(`防騙結果: ${result.fraud.recommendation}`);
  console.log(`建議: ${result.recommendation.action}\n`);

  // 展示歷史記錄
  console.log('【 分析歷史 】\n');
  const history = agent.getAnalysisHistory();
  history.forEach((entry, idx) => {
    console.log(
      `${idx + 1}. ${entry.timestamp} → ${entry.composite.level} (${(entry.composite.score * 100).toFixed(1)}%)`
    );
  });
  console.log();
});
