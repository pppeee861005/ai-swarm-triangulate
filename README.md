# 🎯 AI 蜂群投資 - 三維獵殺

> **「沒有三維印證，我不出手。」**
>
> 籌碼 + 基本 + 技術 三角印證投資信號，防騙局系統，動態權重調整。

---

## 📖 故事

深夜，你盯著屏幕。

一支股票在 5 分鐘內漲了 5%，成交量飆升 10 倍，新聞鋪天蓋地。

**但你沒有立即下單。**

為什麼？

因為你知道：一個好的投資信號，不是來自單一維度的狂歡，而是**三個維度的齊聲共鳴**。

---

## 🌟 核心特性

### ✨ 三維同時分析
```
籌碼維度（Chip）        →  機構進出了嗎？
基本面維度（Fundamental） → 業績支持漲價嗎？
技術面維度（Technical）   → 形態突破真實嗎？
        ↓
    三維信號整合
        ↓
   置信度評分 (0-1)
        ↓
   投資建議輸出
```

### 🛡️ 防騙局系統
- ✅ 三維信號一致性檢查
- ✅ 流動性陷阱警報
- ✅ 技術假突破識別
- ✅ 籌碼異常檢測

### ⚖️ 動態權重調整
根據市場環境自動調整三個維度的權重：
- 牛市：技術權重 ↑
- 熊市：籌碼權重 ↑
- 不確定性高：基本面權重 ↑

---

## 🚀 快速開始

### 安裝

```bash
npm install @ai-swarm/triangulate
```

或本地開發：

```bash
git clone https://github.com/pppeee861005/ai-swarm-triangulate.git
cd ai-swarm-triangulate
npm install
```

### 最簡單的例子（< 30 行）

```javascript
import { TriangulateAgent } from './src/Agent.Triangulate.js';

// 創建分析 Agent
const agent = new TriangulateAgent({
  symbol: 'AAPL',
  name: 'Apple Inc.',
  weights: {
    chip: 0.35,
    fundamental: 0.35,
    technical: 0.30
  }
});

// Scout 的監控報告（來自 ai-swarm-monitor）
const scoutReport = {
  symbol: 'AAPL',
  triggers: [
    { type: 'BIG_ORDER_IN', amount: 50000000 },
    { type: 'VOLUME_SPIKE', ratio: 3.5 },
    { type: 'PRICE_SURGE', percent: 3.2 }
  ],
  timestamp: new Date().toISOString()
};

// 執行三維分析
const result = await agent.analyze(scoutReport);

console.log(`信號等級: ${result.composite.level}`);        // 買賣建議
console.log(`置信度: ${(result.composite.score * 100).toFixed(1)}%`); // 0-100%
console.log(`防騙局: ${result.fraud.recommendation}`);      // PROCEED / WAIT
```

### 運行示例

```bash
npm run dev           # 基礎示例
npm run dev:advanced  # 進階示例（自定義權重）
npm run dev:integrated # 整合示例（與 Monitor 協作）
```

---

## 📚 文檔

- **[STORY.md](./docs/STORY.md)** — 完整故事線（對應 Substack E02）
- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** — 技術架構詳解
- **[API.md](./docs/API.md)** — API 參考
- **[WEIGHT_STRATEGY.md](./docs/WEIGHT_STRATEGY.md)** — 權重調整策略
- **[FRAUD_DETECTION.md](./docs/FRAUD_DETECTION.md)** — 防騙局詳解

---

## 🏗️ 架構

```
TriangulateAgent（主類）
    ↓
    ├─→ ChipDimension（籌碼分析）
    │   ├─ Big Order Flow（大單流向）
    │   ├─ Position Change（持倉變化）
    │   ├─ Concentration（籌碼集中度）
    │   └─ Turnover Rate（換手率）
    │
    ├─→ FundamentalDimension（基本面分析）
    │   ├─ Latest Earnings（最新財報）
    │   ├─ Performance Forecast（業績預期）
    │   └─ Industry Comparison（行業對標）
    │
    ├─→ TechnicalDimension（技術面分析）
    │   ├─ Candlestick Pattern（K線形態）
    │   ├─ Support & Resistance（支撐/壓力）
    │   └─ Moving Averages（均線系統）
    │
    ├─→ WeightCalculator（權重計算）
    │   └─ Dynamic Weight Adjustment（動態調整）
    │
    └─→ FraudDetector（防騙局）
        ├─ Consistency Check（信號一致性）
        ├─ Liquidity Trap（流動性陷阱）
        ├─ Technical Fake（假突破）
        └─ Chip Anomaly（籌碼異常）
```

---

## 📊 信號等級

| 等級 | 分數範圍 | 含義 | 行動 |
|------|---------|------|------|
| **STRONG_BUY** | 0.8-1.0 | 三維強烈看多 | 可重倉建倉 |
| **BUY** | 0.6-0.8 | 三維看多 | 標準建倉 |
| **HOLD** | 0.4-0.6 | 三維中性 | 觀望 |
| **SELL** | 0.2-0.4 | 三維看空 | 標準減倉 |
| **STRONG_SELL** | 0.0-0.2 | 三維強烈看空 | 可重倉減倉 |

---

## 🔗 生態整合

### 與 ai-swarm-monitor 協作

```
Monitor Agent 監控      →  檢測異動信號
            ↓
      Triangulate Agent  →  三維驗證信號
            ↓
       決策輸出（買賣建議）
```

### 與其他 Workflow 協作

- **再平衡引擎** — 基於三維信號調整持倉
- **新聞獵手** — 基本面維度的消息驅動
- **跨市場套利** — 跨境信號驗證

---

## 💻 技術棧

- **語言** — JavaScript / Node.js
- **AI 引擎** — Claude API（Opus for analysis, Haiku for monitoring）
- **測試** — Jest
- **部署** — Node.js 環境 / AWS Lambda / Azure Functions

---

## 🧪 測試

```bash
npm test              # 運行所有測試
npm run test:watch   # 監視模式
```

覆蓋範圍：
- ✅ 單元測試（各維度分析）
- ✅ 集成測試（三維整合）
- ✅ 防騙局檢查測試

---

## 📝 示例

### 例子 1：基礎三維分析

```bash
npm run dev
```

監控單支股票（AAPL），執行三維分析。

### 例子 2：進階配置

```bash
npm run dev:advanced
```

自定義權重、觸發閾值，演示動態調整。

### 例子 3：整合 Monitor

```bash
npm run dev:integrated
```

展示 Triangulate 與 Monitor 的完整協作流程。

---

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

參考 [貢獻指南](./CONTRIBUTING.md)（主項目）

---

## 📄 License

MIT License - 自由使用、修改、商用

---

## 🔗 相關資源

- **主項目** — [ai-swarm-investing](https://github.com/pppeee861005/ai-swarm-investing)
- **子專案 1** — [ai-swarm-monitor](https://github.com/pppeee861005/ai-swarm-monitor)
- **Substack** — [AI 指揮官](https://aiagentcommander.substack.com)
- **Issue** — [GitHub Issues](https://github.com/pppeee861005/ai-swarm-triangulate/issues)

---

**最後更新** — 2026-06-02
**版本** — 0.1.0
**狀態** — 🟢 開發中

