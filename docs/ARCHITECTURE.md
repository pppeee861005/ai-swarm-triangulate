# 🏗️ 三維獵殺技術架構

---

## 整體架構圖

```
TriangulateAgent（主協調器）
    │
    ├─→ ChipDimension（籌碼分析器）
    │   ├─ analyzeBigOrderFlow()    # 大單流向
    │   ├─ analyzePositionChange()  # 持倉變化
    │   ├─ analyzeConcentration()   # 籌碼集中度
    │   └─ analyzeTurnoverRate()    # 換手率
    │
    ├─→ FundamentalDimension（基本面分析器）
    │   ├─ analyzeEarnings()        # 財報分析
    │   ├─ analyzeForecastPerformance()  # 預期分析
    │   ├─ analyzeIndustryComparison()   # 行業對標
    │   └─ analyzeValuation()       # 估值分析
    │
    ├─→ TechnicalDimension（技術分析器）
    │   ├─ analyzeCandlePattern()   # K線形態
    │   ├─ analyzeSupportResistance() # 支撐壓力
    │   ├─ analyzeMovingAverage()   # 均線系統
    │   └─ analyzeMomentum()        # 動量分析
    │
    ├─→ WeightCalculator（權重計算器）
    │   ├─ adjustWeights()          # 動態權重調整
    │   ├─ calculateMomentum()      # 動量計算
    │   ├─ calculateVolatility()    # 波動率計算
    │   └─ calculateConsistency()   # 一致性計算
    │
    └─→ FraudDetector（防騙局檢查器）
        ├─ checkConsistency()       # 信號一致性
        ├─ checkLiquidityTrap()     # 流動性陷阱
        ├─ checkTechnicalFake()     # 技術假突破
        └─ checkChipAnomaly()       # 籌碼異常

結果流：
Scout Report
    ↓
三維分析（並行）
    ↓
權重動態調整
    ↓
加權整合評分
    ↓
防騙檢查（4 層）
    ↓
最終報告 & 建議
```

---

## 核心組件詳解

### 1. TriangulateAgent 主類

**職責**：
- 統籌整個分析流程
- 管理三個維度的分析器
- 執行權重調整
- 調用防騙檢查
- 生成最終報告

**核心方法**：

```javascript
// 主分析方法
async analyze(scoutReport)
  → Promise<AnalysisResult>

// 計算加權綜合分數
calculateCompositeScore(chip, fundamental, technical, weights)
  → CompositeScore

// 信號等級評定
scoreToSignalLevel(score: 0-1)
  → SIGNAL_LEVELS

// 計算置信度
calculateConfidence(scores, agreement)
  → 0-1

// 生成投資建議
generateRecommendation(composite, fraud, scout)
  → Recommendation
```

**狀態管理**：
```javascript
{
  agentId: "Triangulate-AAPL",
  symbol: "AAPL",
  currentWeights: { chip: 0.35, fundamental: 0.35, technical: 0.30 },
  analysisHistory: [],  // 保存最近 100 次分析
  analysisCount: 0      // 累計分析次數
}
```

---

### 2. 三維分析器

#### ChipDimension（籌碼維度）

**分析指標**：

| 指標 | 計算方法 | 範圍 | 含義 |
|------|--------|------|------|
| **Big Order Flow** | Scout 中大單類型 | 0-1 | 機構進出方向 |
| **Position Change** | 成交量與持倉變化 | 0-1 | 籌碼增減速率 |
| **Concentration** | 買賣失衡程度 | 0-1 | 籌碼集中度 |
| **Turnover Rate** | 價格波動幅度 | 0-1 | 市場活躍度 |

**綜合評分**：
```
Score = 0.4 × flow + 0.3 × position + 0.2 × concentration + 0.1 × turnover
```

**輸出格式**：
```javascript
{
  score: 0.72,           // 籌碼維度分數
  confidence: 0.75,      // 置信度
  details: {
    bigOrderFlow: { ... },
    positionChange: { ... },
    concentration: { ... },
    turnoverRate: { ... }
  },
  reasoning: "大單買入..."
}
```

#### FundamentalDimension（基本面維度）

**分析指標**：

| 指標 | 信息來源 | 計算方法 |
|------|--------|--------|
| **Earnings** | 財報、盈利數據 | 營收增速、淨利潤率 |
| **Forecast** | 分析師一致預期 | 目標價、評級變化 |
| **Industry** | 同業對標 | PE、PB 相對水位 |
| **Valuation** | 估值模型 | DCF、相對估值 |

**綜合評分**：
```
Score = 0.4 × earnings + 0.3 × forecast + 0.2 × industry + 0.1 × valuation
```

**輸出格式**：
```javascript
{
  score: 0.70,
  confidence: 0.65,
  details: {
    earnings: { trend: "UP", revenue: "增速 15%" },
    forecast: { expectation: "POSITIVE", guidance: "上調" },
    industry: { peBenchmark: "18 倍", pbBenchmark: "2.8 倍" },
    valuation: { level: "合理", pe: "18 倍" }
  },
  reasoning: "業績向好..."
}
```

#### TechnicalDimension（技術面維度）

**分析指標**：

| 指標 | 計算方法 | 範圍 | 含義 |
|------|--------|------|------|
| **Candle Pattern** | 價格 + 成交量 | 0-1 | K線形態有效性 |
| **Support/Resistance** | Scout 突破信號 | 0-1 | 支撐壓力效力 |
| **Moving Average** | 價格趨勢 | 0-1 | 均線強度 |
| **Momentum** | 觸發信號數量 | 0-1 | 動量強度 |

**綜合評分**：
```
Score = 0.35 × pattern + 0.35 × support + 0.2 × avgline + 0.1 × momentum
```

**輸出格式**：
```javascript
{
  score: 0.78,
  confidence: 0.80,
  details: {
    candlePattern: { pattern: "突破", signal: "看多" },
    supportResistance: { direction: "UP", level: "壓力位" },
    movingAverage: { trend: "短期均線上揚", signal: "看多" },
    momentum: { signal: "強勢", rsi: 70 }
  },
  reasoning: "K線突破...",
  volatility: 0.35,       // 波動率
  momentum: 0.65          // 動量值
}
```

---

### 3. WeightCalculator（權重計算器）

**職責**：
根據市場環境動態調整三個維度的權重。

**調整邏輯**：

```javascript
adjustWeights({
  chipScore,
  fundamentalScore,
  technicalScore,
  scoutReport
}) → {
  chip: 0.35,
  fundamental: 0.35,
  technical: 0.30,
  reason: "市場環境說明..."
}
```

**調整規則**：

1. **基於動量調整**（牛熊市判斷）
   ```
   如果 momentum > 0.6（牛市）：
     - 技術權重 × 1.3
     - 籌碼權重 × 0.9

   如果 momentum < 0.4（熊市）：
     - 籌碼權重 × 1.3
     - 技術權重 × 0.9
   ```

2. **基於波動率調整**（風險程度）
   ```
   如果 volatility > 0.5（波動大）：
     - 籌碼權重 ↑（要看誰在買）
     - 技術權重 ↓（信號不可靠）

   如果 volatility < 0.2（波動小）：
     - 技術權重 ↑（穩定的趨勢）
     - 籌碼權重 ↓（沒有人在動）
   ```

3. **基於一致性調整**（信號清晰度）
   ```
   如果 consistency > 0.7（三維同聲）：
     - 保持基礎權重

   如果 consistency < 0.3（三維分歧）：
     - 基本面權重 ↑（作為穩定錨點）
     - 技術權重 ↓（信號不清晰）
   ```

4. **歸一化**
   ```
   最後確保權重和 = 1.0
   ```

---

### 4. FraudDetector（防騙局檢查器）

**4 層檢查機制**：

#### 檢查 1：信號一致性（Consistency Check）

```javascript
isFraud = 三個維度中有 ≤ 1 個同向

如果 isFraud：
  - riskLevel = 0.7（高風險）
  - recommendation = "WAIT"

邏輯：
- chipUp = chip.score > 0.5
- fundamentalUp = fundamental.score > 0.5
- technicalUp = technical.score > 0.5
- agreements = 有多少對維度同向
- 至少 2 個維度同向才算一致
```

#### 檢查 2：流動性陷阱（Liquidity Trap）

```javascript
diff = |chip.score - technical.score|
isFraud = diff > 0.4

含義：
- 籌碼強但技術弱 = 可能是大單設置陷阱
- 典型：大單買但股價停滯

riskLevel = min(diff, 0.7)
```

#### 檢查 3：技術假突破（Technical Fake-out）

```javascript
isFakeBullish = technical > 0.7 && fundamental < 0.4
  （技術面超強但基本面沒支撐）

isFakeBearish = technical < 0.3 && fundamental > 0.6
  （技術面超弱但基本面沒惡化）

isFraud = isFakeBullish || isFakeBearish
riskLevel = isFraud ? 0.6 : 0.1
```

#### 檢查 4：籌碼異常（Chip Anomaly）

```javascript
isChipManipulation = chip > 0.8 && composite < 0.5

含義：
- 籌碼異常強勢（> 0.8）
- 但綜合分數平庸（< 0.5）
- = 可能是莊家對倒

riskLevel = isChipManipulation ? 0.5 : 0.2
```

**輸出格式**：

```javascript
{
  isFraud: false,
  riskLevel: 0.25,              // 總欺詐風險
  recommendation: "PROCEED",     // PROCEED / PROCEED_WITH_CAUTION / WAIT
  failedChecks: [],             // 失敗的檢查列表
  details: {
    consistency: { isFraud: false, riskLevel: 0 },
    liquidityTrap: { isFraud: false, riskLevel: 0.1 },
    technicalFake: { isFraud: false, riskLevel: 0.1 },
    chipAnomaly: { isFraud: false, riskLevel: 0.2 }
  }
}
```

---

## 分析流程（詳細）

### 第 1 步：輸入驗證

```javascript
input: ScoutReport {
  symbol: string
  timestamp: ISO 8601
  triggers: Array<{
    type: string
    amount?: number
    ratio?: number
    percent?: number
    details?: object
  }>
}
```

### 第 2 步：並行分析（3 個維度同時運行）

```javascript
Promise.all([
  chipDimension.analyze(scoutReport),
  fundamentalDimension.analyze(scoutReport),
  technicalDimension.analyze(scoutReport)
])
```

**耗時**：通常 50-200ms

### 第 3 步：權重動態調整

```javascript
currentWeights = weightCalculator.adjustWeights({
  chipScore,
  fundamentalScore,
  technicalScore,
  scoutReport
})
```

### 第 4 步：加權整合

```javascript
compositeScore =
  chipScore × w_chip +
  fundamentalScore × w_fundamental +
  technicalScore × w_technical

signalLevel = scoreToSignalLevel(compositeScore)
confidence = calculateConfidence(scores, agreement)
```

### 第 5 步：防騙檢查

```javascript
fraudCheck = fraudDetector.check({
  chip: chipScore,
  fundamental: fundamentalScore,
  technical: technicalScore,
  composite: compositeScore
})
```

### 第 6 步：生成報告

```javascript
report = {
  metadata: { agentId, symbol, timestamp, analysisNumber },
  dimensions: { chip, fundamental, technical },
  weights: currentWeights,
  composite: { score, level, confidence, contributions },
  fraud: { isFraud, riskLevel, recommendation, failedChecks },
  recommendation: { action, positionSize, reason, validityPeriod },
  metrics: { durationMs, analysisCount }
}
```

---

## 性能特性

### 時間複雜度

| 操作 | 耗時 | 備註 |
|------|------|------|
| 單次分析 | ~150ms | 三個維度並行 |
| 防騙檢查 | ~30ms | 4 層順序檢查 |
| 總耗時 | ~180ms | 可接受實時應用 |

### 空間複雜度

| 數據 | 大小 | 備註 |
|------|------|------|
| 單次報告 | ~5KB | JSON 格式 |
| 歷史記錄（100 次） | ~500KB | 內存中 |
| 配置文件 | ~2KB | JSON |

### 可擴展性

- ✅ 支持多股票並行分析（通過 Promise.all）
- ✅ 支持自定義維度分析器（繼承基類）
- ✅ 支持自定義防騙檢查（添加新檢查方法）
- ✅ 支持權重預設方案（config/default.json）

---

## 數據流圖

```
Scout 監控信號
    ↓
┌─────────────────────────────┐
│   TriangulateAgent.analyze() │
└──────────────┬──────────────┘
               ↓
        ┌─────┴─────┐
        ↓           ↓
    [籌碼分析]   [基本面分析]   [技術分析]
    (ChipDim)   (FundDim)      (TechDim)
        ↓           ↓              ↓
    Score_C    Score_F         Score_T
    Conf_C     Conf_F          Conf_T
        ↓           ↓              ↓
        └─────┬─────┘
              ↓
    ┌──────────────────────┐
    │ WeightCalculator     │
    │ adjustWeights()      │
    └─────────┬────────────┘
              ↓
    W_chip, W_fund, W_tech
              ↓
    ┌──────────────────────┐
    │ calculateComposite   │
    │ Score & Level        │
    └─────────┬────────────┘
              ↓
    Score_C, Signal_Level,
    Confidence, Contributions
              ↓
    ┌──────────────────────┐
    │ FraudDetector        │
    │ 4-layer checks       │
    └─────────┬────────────┘
              ↓
    isFraud, riskLevel,
    failedChecks, recommendation
              ↓
    ┌──────────────────────┐
    │ generateReport()     │
    │ generateRecommend()  │
    └─────────┬────────────┘
              ↓
         最終報告
    (可供決策或執行)
```

---

## 與 Monitor 的集成

```
ai-swarm-monitor (Scout Agent)
         ↓
    [Real-time scanning]
         ↓
    ScoutReport {
      symbol, triggers, timestamp
    }
         ↓
ai-swarm-triangulate (Triangulate Agent)
         ↓
    [Three-dimensional analysis]
    [Fraud detection]
    [Dynamic weighting]
         ↓
    TriangulateReport {
      signal level, confidence,
      action, position size
    }
         ↓
  [其他 Workflow]
  - 再平衡引擎
  - 新聞獵手
  - 跨市場套利
```

---

## 擴展點

### 添加新的維度分析器

```javascript
// 創建新分析器
class CustomDimension {
  async analyze(scoutReport) {
    // 實現分析邏輯
    return {
      score: 0-1,
      confidence: 0-1,
      details: { ... },
      reasoning: "..."
    }
  }
}

// 在 TriangulateAgent 中使用
this.customDimension = new CustomDimension(config);
```

### 添加新的防騙檢查

```javascript
// 在 FraudDetector 中添加
checkNewFraud(scores) {
  const isFraud = ...;
  const riskLevel = ...;
  return { isFraud, riskLevel, interpretation: "..." };
}

// 在 check() 方法中調用
const checks = {
  ...existingChecks,
  newFraud: this.checkNewFraud(scores)
};
```

---

**最後更新**：2026-06-02
**版本**：0.1.0
**狀態**：🟢 穩定可用
