/**
 * 例子 3：整合示例
 *
 * 展示 Triangulate 與 Monitor 的完整協作流程
 * 模擬實時監控 → 信號觸發 → 三維分析 → 投資建議
 *
 * 運行：npm run dev:integrated
 */

import { TriangulateAgent } from '../src/Agent.Triangulate.js';

// 模擬 Scout Agent（來自 ai-swarm-monitor）
class MockScoutAgent {
  constructor(symbol) {
    this.symbol = symbol;
    this.scanCount = 0;
    this.lastPrice = 150.0;
  }

  // 模擬市場掃描
  scan() {
    this.scanCount++;

    // 根據掃描次數生成不同信號
    let triggers = [];

    if (this.scanCount === 1) {
      // 第 1 次掃描：價格開始上升
      triggers = [
        { type: 'PRICE_SURGE', percent: 1.5 },
        { type: 'VOLUME_SPIKE', ratio: 2.0 }
      ];
    } else if (this.scanCount === 2) {
      // 第 2 次掃描：大單買入
      triggers = [
        { type: 'PRICE_SURGE', percent: 2.5 },
        { type: 'BIG_ORDER_IN', amount: 40000000 },
        { type: 'VOLUME_SPIKE', ratio: 3.5 }
      ];
    } else if (this.scanCount === 3) {
      // 第 3 次掃描：突破壓力位
      triggers = [
        { type: 'PRICE_SURGE', percent: 3.2 },
        { type: 'RESISTANCE_BREAK', details: { breakPercent: 2.1 } },
        { type: 'BIG_ORDER_IN', amount: 60000000 },
        { type: 'VOLUME_SPIKE', ratio: 4.2 }
      ];
    }

    return {
      symbol: this.symbol,
      timestamp: new Date().toISOString(),
      triggers: triggers,
      scanNumber: this.scanCount
    };
  }
}

// 創建 Triangulate Agent
const triangulateAgent = new TriangulateAgent({
  symbol: 'MSFT',
  name: 'Microsoft Corporation',
  market: 'US',
  weights: {
    chip: 0.35,
    fundamental: 0.35,
    technical: 0.30
  }
});

// 創建 Scout Agent
const scoutAgent = new MockScoutAgent('MSFT');

console.log('\n=== 整合示例：Monitor → Triangulate 完整流程 ===\n');
console.log(`股票: ${triangulateAgent.symbol} (${triangulateAgent.name})\n`);

// 模擬實時監控過程
const monitoringLoop = async () => {
  for (let i = 0; i < 3; i++) {
    console.log(`\n【 掃描 #${i + 1} 】\n`);

    // 第 1 步：Scout 執行掃描
    const scoutReport = scoutAgent.scan();

    console.log(`Scout 報告:`);
    console.log(`  時間: ${scoutReport.timestamp}`);
    console.log(`  信號數: ${scoutReport.triggers.length}`);
    if (scoutReport.triggers.length > 0) {
      scoutReport.triggers.forEach(t => {
        console.log(`    - ${t.type}`);
      });
    } else {
      console.log(`    - 無異常信號`);
    }
    console.log();

    // 第 2 步：Triangulate 執行三維分析
    const result = await triangulateAgent.analyze(scoutReport);

    console.log(`Triangulate 分析結果:`);
    console.log(`  綜合信號: ${result.composite.level}`);
    console.log(`  分數: ${(result.composite.score * 100).toFixed(1)}%`);
    console.log(`  置信度: ${(result.composite.confidence * 100).toFixed(1)}%`);
    console.log();

    console.log(`三維維度分數:`);
    console.log(
      `  籌碼面: ${(result.dimensions.chip.score * 100).toFixed(1)}%`
    );
    console.log(
      `  基本面: ${(result.dimensions.fundamental.score * 100).toFixed(1)}%`
    );
    console.log(
      `  技術面: ${(result.dimensions.technical.score * 100).toFixed(1)}%`
    );
    console.log();

    console.log(`防騙檢查:`);
    console.log(`  欺詐風險: ${(result.fraud.riskLevel * 100).toFixed(1)}%`);
    console.log(`  建議: ${result.fraud.recommendation}`);
    console.log();

    // 第 3 步：生成投資建議
    console.log(`💡 投資建議:`);
    console.log(`  行動: ${result.recommendation.action}`);
    console.log(`  倉位: ${result.recommendation.positionSize}`);
    console.log(`  原因: ${result.recommendation.reason}`);
    console.log();

    // 模擬延遲
    if (i < 2) {
      console.log('等待下一次掃描...');
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // 最後展示統計信息
  console.log('\n【 監控統計 】\n');
  const status = triangulateAgent.getStatus();
  console.log(`總分析次數: ${status.analysisCount}`);
  console.log(`最後分析時間: ${status.lastAnalysisTime}\n`);
};

// 運行完整流程
monitoringLoop().catch(console.error);
