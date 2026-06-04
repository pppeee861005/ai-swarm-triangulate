---
name: ai-swarm-triangulate-methodology
title: ⭐ 方法論與代碼映射指南
description: 從定義書到 JavaScript 代碼實現的完整映射
date: 2026-06-04
version: 0.1.0
status: 基礎實現完成
---

# ⭐ 方法論與代碼映射指南

> **讀這個文件前**，請先讀 `examples/02-三維獵殺/定義書.md`
> 本文檔展示**如何將定義書的決策邏輯**映射到 JavaScript 代碼實現

---

## 🔥 重要：理解 DW 的可復用性

這個定義書+代碼不只是「一次性工具」，而是 **Dynamic Workflow 知識資產**：

```
定義書（永恆藍圖）
  ├─ 可以保存 → 你的個人資產庫
  ├─ 可以精進 → 基於執行結果優化
  ├─ 可以分享 → 提交社群，社群復用
  └─ 可以復用 → 他人改 1 個參數就能用在 100 個場景

代碼實現（可互換）
  ├─ 可以用 JavaScript（目前）
  ├─ 可以改寫成 Python / Go / Rust
  └─ 邏輯永遠相同，只是實現語言不同
```

**核心價值**：
- 📖 定義書是「一次思考，永久復用」
- 💻 代碼是「可互換的實現，不是終點」
- 🤝 你的改進會啟發社群的 100 個應用

---

---

## 📖 快速導覽

| 定義書章節 | 代碼文件 | 映射內容 |
|-----------|---------|---------|
| 第一章：問題定義 | `Agent.Triangulate.js` | 三維分析架構 |
| 維度 1：財務面 | `src/dimensions/FundamentalDimension.js` | 基本面評分規則 |
| 維度 2：技術面 | `src/dimensions/TechnicalDimension.js` | 技術面評分規則 |
| 維度 3：籌碼面 | `src/dimensions/ChipDimension.js` | 籌碼面評分規則 |
| 第三章：執行策略 | `src/utils/WeightCalculator.js` | 動態權重調整 |
| 防騙局檢查 | `src/validators/FraudDetector.js` | 風險驗證邏輯 |

---

## 🎯 核心架構：三維獵殺決策流程

### 定義書中的決策流程

```
輸入：股票代碼 + 買入價位
  ↓
【並行分析三個維度】
  ├─ 財務面 → 評分 0-1
  ├─ 技術面 → 評分 0-1
  └─ 籌碼面 → 評分 0-1
  ↓
【動態調整權重】
  根據市場環境調整：籌碼:基本面:技術面 = 35:35:30
  ↓
【計算綜合信號】
  score = chip*0.35 + fundamental*0.35 + technical*0.30
  ↓
【防騙局檢查】
  驗證是否存在異常信號
  ↓
【生成報告】
  輸出：信號強度 + 建議 + 風險評級
```

### 代碼中的實現（`Agent.Triangulate.js`）

```javascript
// 1. 並行執行三維分析
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

// 3. 計算綜合信號
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

// 5. 生成報告
const report = this.generateReport({
  scout: scoutReport,
  dimensions: { chip, fundamental, technical },
  weights: this.currentWeights,
  composite: compositeScore,
  fraud: fraudCheck,
  duration: Date.now() - startTime
});
```

---

## 📊 維度 1：財務面評分 → `FundamentalDimension`

### 定義書中的邏輯

**評估指標**：
```
PE（市盈率）、PB（市淨率）、ROE（股東報酬率）、負債率

判斷規則：
├─ 如果 (PE < 行業平均) AND (ROE > 15%) AND (負債率 < 60%)
│   → 財務面信號：強（score = 0.8-1.0）
├─ 否則如果 (PE < 行業平均 * 1.2) AND (ROE > 12%)
│   → 財務面信號：中（score = 0.6-0.8）
└─ 否則
    → 財務面信號：弱（score = 0.0-0.6）
```

### 代碼實現

```javascript
class FundamentalDimension {
  async analyze(scoutReport) {
    // 並行分析 4 個指標
    const earnings = this.analyzeEarnings(scoutReport);           // 業績質量
    const forecastPerformance = this.analyzeForecastPerformance(scoutReport); // 預期
    const industryComparison = this.analyzeIndustryComparison(scoutReport);   // 行業對比
    const valuation = this.analyzeValuation(scoutReport);         // 估值水平

    // 加權綜合評分
    // 業績質量(40%) > 預期(30%) > 行業對比(20%) > 估值(10%)
    const score =
      earnings.score * 0.4 +
      forecastPerformance.score * 0.3 +
      industryComparison.score * 0.2 +
      valuation.score * 0.1;

    return {
      score: Math.min(Math.max(score, 0), 1), // 限制在 0-1 範圍
      confidence: this.calculateConfidence({...}),
      details: { earnings, forecastPerformance, industryComparison, valuation },
      reasoning: `基本面維度: 業績${earnings.trend === 'UP' ? '向好' : '承壓'}，...`
    };
  }

  // 各指標的具體評分函數
  analyzeEarnings(scoutReport) {
    // 根據觸發信號判斷業績趨勢
    // 實際應用中應調用真實財報 API
    const score = priceChange ? 0.7 : 0.5;
    return { score, trend, revenue, profit, roe, interpretation };
  }

  // ... 類似 analyzeForecastPerformance、analyzeIndustryComparison、analyzeValuation
}
```

### 配置調整建議

如果你想自定義財務面的評分邏輯，修改 `FundamentalDimension.js` 中的權重：

```javascript
// 修改「業績」vs「預期」vs「行業對比」vs「估值」的權重
const score =
  earnings.score * 0.4 +              // 改成 0.5 → 更重視業績
  forecastPerformance.score * 0.3 +   // 改成 0.2
  industryComparison.score * 0.2 +
  valuation.score * 0.1;
```

---

## 📈 維度 2：技術面評分 → `TechnicalDimension`

### 定義書中的邏輯

**評估指標**：
```
K線形態、支撐/壓力位、均線系統、RSI/MACD 動量指標

判斷規則：
├─ 如果 (股價 > 50均 > 200均) AND (成交量 > 20日平均) AND (RSI > 50)
│   → 技術面信號：強（score = 0.8-1.0）
├─ 否則如果 (股價 > 200均) AND (RSI > 40)
│   → 技術面信號：中（score = 0.6-0.8）
└─ 否則
    → 技術面信號：弱（score = 0.0-0.6）
```

### 代碼實現

```javascript
class TechnicalDimension {
  async analyze(scoutReport) {
    // 並行分析 4 個指標
    const candlePattern = this.analyzeCandlePattern(scoutReport);          // K線形態
    const supportResistance = this.analyzeSupportResistance(scoutReport);  // 支撐/壓力
    const movingAverage = this.analyzeMovingAverage(scoutReport);          // 均線系統
    const momentum = this.analyzeMomentum(scoutReport);                    // 動量指標

    // 加權綜合評分
    // K線(35%) ≈ 支撐/壓力(35%) > 均線(20%) > 動量(10%)
    const score =
      candlePattern.score * 0.35 +
      supportResistance.score * 0.35 +
      movingAverage.score * 0.2 +
      momentum.score * 0.1;

    return {
      score: Math.min(Math.max(score, 0), 1),
      confidence: this.calculateConfidence({...}),
      details: { candlePattern, supportResistance, movingAverage, momentum },
      reasoning: `技術面維度: K線${candlePattern.pattern}，...`
    };
  }

  // 各指標的具體評分函數
  analyzeCandlePattern(scoutReport) {
    // 判斷 K線形態是否是「突破」或「破位」
    const priceSurge = scoutReport.triggers?.find(t => t.type === 'PRICE_SURGE');
    let pattern = '平衡';
    let score = 0.5;
    if (priceSurge) {
      pattern = '突破';
      score = 0.8; // 強信號
    }
    return { score, pattern, signal, interpretation };
  }

  analyzeSupportResistance(scoutReport) {
    // 判斷是否突破阻力位或跌破支撐位
    const resistanceBreak = scoutReport.triggers?.find(t => t.type === 'RESISTANCE_BREAK');
    if (resistanceBreak) {
      return { score: 0.8, direction: 'UP', level: '壓力位', ... };
    }
    return { score: 0.5, direction: 'HOLD', ... };
  }

  // ... 類似 analyzeMovingAverage、analyzeMomentum
}
```

### 配置調整建議

修改 `TechnicalDimension.js` 中的權重，改變技術面各指標的重要性：

```javascript
// 如果你更重視「支撐/壓力位」的突破信號
const score =
  candlePattern.score * 0.25 +        // 減少 K線 權重
  supportResistance.score * 0.50 +    // 增加 支撐/壓力 權重（從 0.35）
  movingAverage.score * 0.15 +
  momentum.score * 0.1;
```

---

## 💰 維度 3：籌碼面評分 → `ChipDimension`

### 定義書中的邏輯

**評估指標**：
```
大單流向、持倉變化、籌碼集中度、換手率

判斷規則：
├─ 如果 (大單持續買入) AND (持倉增加) AND (籌碼集中)
│   → 籌碼面信號：強（score = 0.8-1.0）
├─ 否則如果 (大單買賣平衡) OR (持倉平穩)
│   → 籌碼面信號：中（score = 0.5-0.6）
└─ 否則 (大單持續賣出)
    → 籌碼面信號：弱（score = 0.0-0.4）
```

### 代碼實現

```javascript
class ChipDimension {
  async analyze(scoutReport) {
    // 並行分析 4 個指標
    const bigOrderFlow = this.analyzeBigOrderFlow(scoutReport);       // 大單流向
    const positionChange = this.analyzePositionChange(scoutReport);   // 持倉變化
    const concentration = this.analyzeConcentration(scoutReport);     // 集中度
    const turnoverRate = this.analyzeTurnoverRate(scoutReport);       // 換手率

    // 加權綜合評分
    // 大單流向(40%) > 持倉變化(30%) > 集中度(20%) > 換手率(10%)
    const score =
      bigOrderFlow.strength * 0.4 +
      positionChange.momentum * 0.3 +
      concentration.efficiency * 0.2 +
      turnoverRate.healthiness * 0.1;

    return {
      score: Math.min(Math.max(score, 0), 1),
      confidence: this.calculateConfidence({...}),
      details: { bigOrderFlow, positionChange, concentration, turnoverRate },
      reasoning: `籌碼維度: 大單${bigOrderFlow.direction === 'BUY' ? '買入' : '賣出'}，...`
    };
  }

  // 各指標的具體評分函數
  analyzeBigOrderFlow(scoutReport) {
    // 檢查是否有機構大單進場或出逃信號
    const bigOrderTrigger = scoutReport.triggers?.find(
      t => t.type === 'BIG_ORDER_IN' || t.type === 'BIG_ORDER_OUT'
    );

    if (!bigOrderTrigger) {
      return { detected: false, direction: 'NEUTRAL', strength: 0.5 };
    }

    const isBuyOrder = bigOrderTrigger.type === 'BIG_ORDER_IN';
    const strength = isBuyOrder ? 0.8 : 0.2; // 買入強、賣出弱

    return {
      detected: true,
      direction: isBuyOrder ? 'BUY' : 'SELL',
      strength: strength,
      amount: bigOrderTrigger.amount || 0,
      interpretation: isBuyOrder ? '機構進場，看多信號' : '機構出逃，看空信號'
    };
  }

  analyzePositionChange(scoutReport) {
    // 根據成交量激增判斷持倉變化
    const volumeSpikeTrigger = scoutReport.triggers?.find(t => t.type === 'VOLUME_SPIKE');
    const spikeRatio = volumeSpikeTrigger?.ratio || 1;
    const momentum = Math.min(0.9, 0.5 + (spikeRatio - 1) * 0.1);

    return {
      momentum: momentum,
      direction: spikeRatio > 2 ? 'UP' : 'DOWN',
      changeRate: spikeRatio,
      interpretation: spikeRatio > 2 ? '持倉增加，籌碼進場' : '持倉減少'
    };
  }

  // ... 類似 analyzeConcentration、analyzeTurnoverRate
}
```

### 配置調整建議

修改 `ChipDimension.js` 中的權重，改變籌碼面各指標的重要性：

```javascript
// 如果你更重視「大單流向」（機構行為）
const score =
  bigOrderFlow.strength * 0.5 +        // 增加大單權重（從 0.4）
  positionChange.momentum * 0.25 +     // 減少持倉權重（從 0.3）
  concentration.efficiency * 0.15 +
  turnoverRate.healthiness * 0.1;
```

---

## ⚙️ 動態權重調整 → `WeightCalculator`

### 定義書中的邏輯

> **基礎權重**：籌碼 35% + 基本面 35% + 技術面 30%

但在不同市場環境下，應該調整權重：

```
場景 A：機構大量進場（大單信號強）
  → 籌碼權重提升到 45%
  → 技術面權重下降到 25%
  → 邏輯：機構行為最可靠

場景 B：基本面反轉（財報超預期）
  → 基本面權重提升到 40%
  → 技術面權重下降到 25%
  → 邏輯：基本面是長期支撐

場景 C：震蕩市（沒有明確趨勢）
  → 三個維度平均分配 33% 各
  → 邏輯：信號模糊，等權重
```

### 代碼實現

```javascript
class WeightCalculator {
  adjustWeights({ chipScore, fundamentalScore, technicalScore, scoutReport }) {
    // 1. 初始化為基礎權重
    let weights = {
      chip: 0.35,
      fundamental: 0.35,
      technical: 0.30
    };

    // 2. 檢查市場環境信號，動態調整

    // 如果大單信號強 → 籌碼權重上升
    if (chipScore.score > 0.7) {
      weights.chip = 0.45;
      weights.technical = 0.25;
    }

    // 如果基本面信號強 → 基本面權重上升
    if (fundamentalScore.score > 0.7) {
      weights.fundamental = 0.40;
      weights.technical = 0.25;
    }

    // 如果三個維度一致 → 提高對最強維度的權重
    // 如果三個維度分散 → 平均分配（降低風險）

    // 3. 歸一化權重（確保總和為 1）
    const total = weights.chip + weights.fundamental + weights.technical;
    return {
      chip: weights.chip / total,
      fundamental: weights.fundamental / total,
      technical: weights.technical / total
    };
  }
}
```

### 配置調整建議

根據你的投資風格修改 `WeightCalculator.js`：

```javascript
// 如果你偏好「基本面驅動」的長期策略
if (fundamentalScore.score > 0.7) {
  weights.fundamental = 0.50;    // 增加基本面權重
  weights.chip = 0.30;           // 減少籌碼權重
  weights.technical = 0.20;
}

// 如果你偏好「技術面驅動」的短期交易
if (technicalScore.score > 0.7) {
  weights.technical = 0.40;      // 增加技術面權重
  weights.chip = 0.35;
  weights.fundamental = 0.25;
}
```

---

## 🚨 防騙局檢查 → `FraudDetector`

### 定義書中的邏輯

> **目的**：檢測是否存在「異常信號組合」，識別可能的騙局

**檢查項目**：
```
1. 三個維度信號不一致（一致性 < 40%）
   → 警示：可能有隱藏風險

2. 籌碼面和技術面相反
   → 警示：大單買入但價格下跌？異常

3. 估值極端高估（PE > 行業平均 * 2）
   → 警示：可能存在炒作

4. 流動性枯竭（成交量極低）
   → 警示：無法及時平倉

5. 前期高位套牢盤大量解套
   → 警示：可能高位出逃
```

### 代碼實現

```javascript
class FraudDetector {
  async check({
    chip,
    fundamental,
    technical,
    composite,
    scout
  }) {
    let failedChecks = [];
    let riskLevel = 0;

    // 檢查 1：三維一致性
    const agreement = this.calculateAgreement(chip.score, fundamental.score, technical.score);
    if (agreement < 0.4) {
      failedChecks.push('三維信號不一致，存在隱藏風險');
      riskLevel += 0.2;
    }

    // 檢查 2：籌碼和技術相反
    if ((chip.score > 0.6 && technical.score < 0.4) ||
        (chip.score < 0.4 && technical.score > 0.6)) {
      failedChecks.push('籌碼和技術面信號相反，警惕陷阱');
      riskLevel += 0.2;
    }

    // 檢查 3：基本面和價格相離
    if (fundamental.score < 0.4 && composite.score > 0.7) {
      failedChecks.push('基本面弱但股價強，可能被高估');
      riskLevel += 0.2;
    }

    // ... 更多檢查

    return {
      isFraud: riskLevel > 0.6,
      riskLevel: riskLevel,
      failedChecks: failedChecks,
      recommendation: riskLevel > 0.6 ? 'WAIT' : 'PROCEED'
    };
  }

  calculateAgreement(chipScore, fundamentalScore, technicalScore) {
    // 計算三個維度的一致性（標準差越小越一致）
    const mean = (chipScore + fundamentalScore + technicalScore) / 3;
    const variance =
      Math.pow(chipScore - mean, 2) +
      Math.pow(fundamentalScore - mean, 2) +
      Math.pow(technicalScore - mean, 2);
    const stdDev = Math.sqrt(variance / 3);
    return Math.max(0, 1 - stdDev); // 一致性分數
  }
}
```

### 配置調整建議

修改風險閾值以調整檢測靈敏度：

```javascript
// 如果你風險承受度高，降低風險閾值
if (riskLevel > 0.8) {  // 改成 0.8（原來 0.6）
  return { isFraud: true, ... };
}

// 如果你更保守，增加風險檢查項
failedChecks.push('價格波動過大，流動性風險');
failedChecks.push('機構持倉减少，警惕出逃');
```

---

## 🔧 常見使用場景

### 場景 1：快速驗證買點（默認配置）

```javascript
import { TriangulateAgent } from './src/Agent.Triangulate.js';

const agent = new TriangulateAgent({
  symbol: 'AAPL',
  name: 'Apple Inc.',
  market: 'US',
  weights: {
    chip: 0.35,           // 使用默認權重
    fundamental: 0.35,
    technical: 0.30
  }
});

const report = await agent.analyze(scoutReport);
console.log(report.composite.level);  // STRONG_BUY / BUY / HOLD / SELL / STRONG_SELL
console.log(report.recommendation);   // 最終建議
```

### 場景 2：基本面投資者（提升基本面權重）

```javascript
const agent = new TriangulateAgent({
  symbol: 'AAPL',
  market: 'US',
  weights: {
    chip: 0.25,           // 降低籌碼權重
    fundamental: 0.50,    // 提升基本面權重
    technical: 0.25       // 降低技術面權重
  }
});

// 適用於：長期投資、看重公司基本面
```

### 場景 3：短期交易者（提升技術面權重）

```javascript
const agent = new TriangulateAgent({
  symbol: 'AAPL',
  market: 'US',
  weights: {
    chip: 0.30,
    fundamental: 0.20,    // 降低基本面權重
    technical: 0.50       // 提升技術面權重
  }
});

// 適用於：短期交易、看重形態突破
```

---

## 📝 修改定義書 vs 修改代碼

| 場景 | 修改方案 | 原因 |
|------|--------|------|
| 想改變三維評分邏輯 | 修改 `src/dimensions/*.js` | 代碼級細粒度控制 |
| 想改變權重配置 | 修改 `src/utils/WeightCalculator.js` | 動態權重調整邏輯 |
| 想改變防騙局規則 | 修改 `src/validators/FraudDetector.js` | 風險檢測邏輯 |
| 想改變整體決策框架 | 修改 `examples/02-三維獵殺/定義書.md` | 重新定義方法論 |
| 不想改代碼，只想改參數 | 通過 `config` 對象動態配置 | 無需重新部署 |

---

## 🌟 核心理念：代碼會變，方法論永恆

這個實現展示了一個重要的原則：

> **定義書中的決策邏輯是方法論**，是不變的思維方式
> **JavaScript 代碼是實現**，可以用 Python、Go、Rust 重新寫

### 如果你想用 Python 重新實現

```python
# src/triangulate_agent.py
class TriangulateAgent:
    def __init__(self, config):
        self.chip_dimension = ChipDimension(config)
        self.fundamental_dimension = FundamentalDimension(config)
        self.technical_dimension = TechnicalDimension(config)

    async def analyze(self, scout_report):
        # 並行執行三個維度分析
        chip_score, fund_score, tech_score = await asyncio.gather(
            self.chip_dimension.analyze(scout_report),
            self.fundamental_dimension.analyze(scout_report),
            self.technical_dimension.analyze(scout_report)
        )

        # 動態調整權重 → WeightCalculator
        weights = self.weight_calculator.adjust_weights({...})

        # 計算綜合信號
        composite = self.calculate_composite_score(chip_score, fund_score, tech_score, weights)

        # ... 防騙局檢查、生成報告
        return report
```

> 邏輯完全相同，只是實現語言不同！

---

## 📚 相關文檔

- 📖 **定義書全文**：[examples/02-三維獵殺/定義書.md](../examples/02-三維獵殺/定義書.md)
- 💰 **預算控制指南**：[examples/02-三維獵殺/預算控制.md](../examples/02-三維獵殺/預算控制.md)
- 🚀 **快速開始**：[README.md](./README.md)
- 📋 **API 詳細文檔**：[docs/API.md](./docs/API.md)（如果存在）

---

## 🔄 下一步行動

### 想改進這個實現？

1. **理解方法論**：讀懂定義書的決策邏輯
2. **修改代碼**：調整 `src/` 中的具體實現
3. **測試驗證**：用 `examples/` 中的例子驗證新邏輯
4. **保存、精進、分享**：記錄你的修改，迭代優化，與社群分享

### 想用其他語言實現？

參考此文檔和定義書，用 Python/Go/Rust 重新實現三維獵殺邏輯。完成後可向本項目提交多語言實現！

---

**文檔版本**：0.1.0
**最後更新**：2026-06-04
**維護者**：AI Agent Commander
**狀態**：基礎實現完成，等待社群貢獻
