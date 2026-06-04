---
name: ai-swarm-triangulate-contributing
title: 社群貢獻指南 — 保存·精進·分享
description: 如何為本項目貢獻多語言實現、新功能、改進建議
date: 2026-06-04
version: 0.1.0
status: 開放社群貢獻
---

# 社群貢獻指南 — 保存·精進·分享

> **核心理念**：人類共學共好。你的 Workflows 腳本值得被保存、精進、並分享給他人

---

## 🌟 貢獻的三個層級

```
層級 1：保存（SAVE）
  └─ 你生成的 Dynamic Workflows 腳本
     可以直接保存到本項目的 examples/ 目錄

層級 2：精進（REFINE）
  └─ 改進現有的定義書或代碼實現
     提交 Pull Request 與社群分享優化

層級 3：分享（SHARE）
  └─ 用其他語言重新實現三維獵殺邏輯
     貢獻 Python、Go、Rust 版本
```

### 🎯 各層級的貢獻方式

| 層級 | 貢獻類型 | 難度 | 時間 | 貢獻位置 |
|------|--------|------|------|--------|
| **保存** | 新增 Dynamic Workflows 腳本 | ⭐ | 5分鐘 | `examples/` |
| **保存** | 新增執行案例記錄 | ⭐ | 10分鐘 | `examples/logs/` |
| **精進** | 改進定義書（優化決策邏輯） | ⭐⭐⭐ | 1-2小時 | `examples/*/定義書.md` |
| **精進** | 優化代碼實現（性能、可讀性） | ⭐⭐⭐ | 1-2小時 | `src/` |
| **精進** | 增加單元測試 | ⭐⭐ | 30分鐘 | `tests/` |
| **分享** | Python 實現 | ⭐⭐⭐ | 3-4小時 | `implementations/python/` |
| **分享** | Go 實現 | ⭐⭐⭐ | 3-4小時 | `implementations/go/` |
| **分享** | Rust 實現 | ⭐⭐⭐⭐ | 5-6小時 | `implementations/rust/` |

---

## 📝 保存（SAVE）：分享你的 Dynamic Workflows 腳本

### 1. 直接保存腳本

如果你用 Claude Code 生成了一個有用的 Dynamic Workflows 腳本，可以直接保存到本項目。

**步驟**：

#### A. 創建新的腳本目錄

```
examples/
├─ 01-蜂群覺醒/
├─ 02-三維獵殺/
└─ 03-你的腳本名稱/          ← 新增
    ├─ 定義書.md
    ├─ 預算控制.md
    └─ README.md (可選)
```

#### B. 編寫定義書

參考 `examples/02-三維獵殺/定義書.md` 的結構，編寫你的 Dynamic Workflows 定義書：

```markdown
---
name: 03-你的workflow名稱
description: 簡短描述
date: 2026-06-04
---

# 📊 你的 Workflow 名稱

## 第一章：問題定義
（描述你要解決的問題）

## 第二章：驗證標準
（如何評估成功）

## 第三章：執行策略
（誰來執行、如何執行）

## 第四章及以後
（根據需要自由調整）
```

#### C. 編寫預算控制書

```markdown
---
name: 03-你的workflow名稱-預算控制
description: Token 預算與成本管理
---

# 💰 預算控制

## 第一章：整體預算
（總成本估算，1 unit = 1,000,000 tokens）

## 第二章：分階段預算
（各個執行階段的成本分配）

## 第三章：降級策略
（當達到成本上限時的應對方案）
```

#### D. 提交 Pull Request

```bash
git add examples/03-你的workflow/
git commit -m "新增：03-你的workflow定義書和預算控制"
git push origin main
```

### 2. 記錄執行案例

如果你已經執行過某個 Workflow，分享執行結果和心得！

**創建執行日誌**：

```
examples/logs/
└─ 2026-06-04_用戶名_三維獵殺_AAPL.md

內容：
---
date: 2026-06-04
user: 你的名字
workflow: 02-三維獵殺
stock: AAPL
---

# 執行記錄：三維獵殺 AAPL

## 執行時間
2026年6月4日 14:30

## 輸入參數
- 股票代碼：AAPL
- 目標價位：150 USD
- 執行環境：Claude Code（Haiku 模型）

## 執行結果
- 綜合信號：STRONG_BUY
- 置信度：0.85
- 花費 Token：0.25 unit

## 執行後追蹤
（3天後、1週後的回顧）

## 心得與優化建議
（你學到了什麼、有什麼想改進）
```

---

## 🔧 精進（REFINE）：改進現有實現

### 1. 改進定義書的決策邏輯

**場景**：你認為三維獵殺的某個維度需要優化

**步驟**：

1. **Fork 本項目**
   ```bash
   git clone https://github.com/pppeee861005/ai-swarm-triangulate.git
   cd ai-swarm-triangulate
   git checkout -b improve-fundamental-dimension
   ```

2. **修改定義書**
   ```
   examples/02-三維獵殺/定義書.md
   ```
   例如：改進第二章「驗證標準」中的基本面評分規則

3. **同步更新代碼**
   ```
   src/dimensions/FundamentalDimension.js
   ```
   確保代碼邏輯與修改後的定義書一致

4. **更新 METHODOLOGY.md**
   ```
   METHODOLOGY.md
   ```
   說明新的邏輯映射

5. **測試驗證**
   ```bash
   npm test  # 運行單元測試
   npm run examples  # 運行示例驗證
   ```

6. **提交 Pull Request**
   ```
   標題：改進：優化基本面維度的評分邏輯
   描述：
   - 修改了 PE 和 ROE 的評分標準
   - 原因：提高對小盤股的適用性
   - 測試結果：AAPL 得分從 0.65 → 0.72
   ```

### 2. 優化代碼實現

**場景**：你發現代碼可以更高效、更易讀、或更易維護

**改進方向**：

| 方向 | 例子 | 測試方式 |
|------|------|--------|
| 性能 | 緩存計算結果、減少 API 調用 | npm run perf-test |
| 可讀性 | 重構函數名、添加註釋 | npm test |
| 可維護性 | 提取常數、模塊化邏輯 | npm test |
| 精度 | 調整公式、改進算法 | npm run examples |

**提交步驟**：

```bash
# 1. 創建分支
git checkout -b refactor-weight-calculator

# 2. 修改代碼
# src/utils/WeightCalculator.js

# 3. 運行測試
npm test

# 4. 提交
git add src/
git commit -m "優化：WeightCalculator 計算邏輯，提升 20% 性能"
git push origin refactor-weight-calculator

# 5. 在 GitHub 上提交 Pull Request
```

### 3. 增加單元測試

**缺失的測試文件**：

```
tests/
├─ dimensions.test.js         # 測試三個維度
├─ weight-calculator.test.js  # 測試權重調整
├─ fraud-detector.test.js     # 測試防騙局檢查
└─ integration.test.js        # 集成測試
```

**測試例子**：

```javascript
// tests/dimensions.test.js

describe('FundamentalDimension', () => {
  it('應該正確識別強基本面信號', async () => {
    const scoutReport = {
      triggers: [
        { type: 'PRICE_SURGE', amount: 50000000 },
        { type: 'VOLUME_SPIKE', ratio: 3 }
      ]
    };

    const dimension = new FundamentalDimension({
      symbol: 'AAPL',
      market: 'US'
    });

    const result = await dimension.analyze(scoutReport);

    expect(result.score).toBeGreaterThan(0.6);
    expect(result.confidence).toBeGreaterThan(0.5);
  });
});
```

**提交測試**：

```bash
git add tests/
git commit -m "新增：FundamentalDimension 單元測試覆蓋 95%"
git push origin add-tests
```

---

## 🌍 分享（SHARE）：多語言實現

### 為什麼要多語言實現？

```
代碼會變，方法論永恆

同一個決策邏輯（定義書），可以用多種語言實現：
- JavaScript（原始實現，適合 Claude Code / Node.js）
- Python（數據科學、機器學習）
- Go（高性能、併發處理）
- Rust（安全性、極致性能）

每種實現都有自己的優勢場景！
```

### 1. Python 實現

**項目結構**：

```
implementations/python/
├─ README.md
├─ requirements.txt
├─ setup.py
├─ triangulate/
│  ├─ __init__.py
│  ├─ agent.py
│  ├─ dimensions/
│  │  ├─ __init__.py
│  │  ├─ chip.py
│  │  ├─ fundamental.py
│  │  └─ technical.py
│  ├─ utils/
│  │  ├─ __init__.py
│  │  └─ weight_calculator.py
│  └─ validators/
│     ├─ __init__.py
│     └─ fraud_detector.py
├─ examples/
│  └─ basic_usage.py
└─ tests/
   ├─ test_dimensions.py
   ├─ test_agent.py
   └─ test_integration.py
```

**實現指南**：

1. **參考 METHODOLOGY.md** 理解決策邏輯
2. **逐個實現模塊**：
   - ChipDimension（籌碼面）
   - FundamentalDimension（基本面）
   - TechnicalDimension（技術面）
   - WeightCalculator（權重調整）
   - FraudDetector（防騙局）
3. **編寫單元測試**
4. **準備 Pull Request**

**示例代碼**：

```python
# implementations/python/triangulate/agent.py

from triangulate.dimensions import ChipDimension, FundamentalDimension, TechnicalDimension
from triangulate.utils import WeightCalculator
from triangulate.validators import FraudDetector

class TriangulateAgent:
    def __init__(self, config):
        self.symbol = config['symbol']
        self.chip_dimension = ChipDimension(config)
        self.fundamental_dimension = FundamentalDimension(config)
        self.technical_dimension = TechnicalDimension(config)
        self.weight_calculator = WeightCalculator()
        self.fraud_detector = FraudDetector()

    async def analyze(self, scout_report):
        # 並行執行三維分析
        chip_score, fund_score, tech_score = await asyncio.gather(
            self.chip_dimension.analyze(scout_report),
            self.fundamental_dimension.analyze(scout_report),
            self.technical_dimension.analyze(scout_report)
        )

        # 動態調整權重
        weights = self.weight_calculator.adjust_weights({
            'chip': chip_score,
            'fundamental': fund_score,
            'technical': tech_score,
            'scout': scout_report
        })

        # 計算綜合信號
        composite = self.calculate_composite_score(
            chip_score, fund_score, tech_score, weights
        )

        # 防騙局檢查
        fraud_check = await self.fraud_detector.check({
            'chip': chip_score,
            'fundamental': fund_score,
            'technical': tech_score,
            'composite': composite
        })

        # 生成報告
        return self.generate_report({
            'scout': scout_report,
            'dimensions': {
                'chip': chip_score,
                'fundamental': fund_score,
                'technical': tech_score
            },
            'weights': weights,
            'composite': composite,
            'fraud': fraud_check
        })
```

### 2. Go 實現

**適用場景**：
- 生產環境高性能服務
- 需要併發處理多只股票
- 對延遲和吞吐量有要求

**項目結構**：

```
implementations/go/
├─ README.md
├─ go.mod
├─ main.go
├─ cmd/
│  └─ triangulate/
│     └─ main.go
├─ internal/
│  ├─ agent/
│  │  └─ triangulate.go
│  ├─ dimensions/
│  │  ├─ chip.go
│  │  ├─ fundamental.go
│  │  └─ technical.go
│  └─ utils/
│     └─ weight.go
└─ tests/
   └─ agent_test.go
```

**實現指南**：

```go
// implementations/go/internal/agent/triangulate.go

package agent

import (
	"context"
	"sync"

	"triangulate/internal/dimensions"
	"triangulate/internal/utils"
)

type TriangulateAgent struct {
	Symbol               string
	ChipDimension        *dimensions.ChipDimension
	FundamentalDimension *dimensions.FundamentalDimension
	TechnicalDimension   *dimensions.TechnicalDimension
	WeightCalculator     *utils.WeightCalculator
}

func (a *TriangulateAgent) Analyze(ctx context.Context, scout interface{}) (interface{}, error) {
	// 並行執行三維分析
	var wg sync.WaitGroup

	var chipScore, fundScore, techScore interface{}
	var chipErr, fundErr, techErr error

	wg.Add(3)

	go func() {
		defer wg.Done()
		chipScore, chipErr = a.ChipDimension.Analyze(scout)
	}()

	go func() {
		defer wg.Done()
		fundScore, fundErr = a.FundamentalDimension.Analyze(scout)
	}()

	go func() {
		defer wg.Done()
		techScore, techErr = a.TechnicalDimension.Analyze(scout)
	}()

	wg.Wait()

	// ... 後續邏輯
}
```

### 3. Rust 實現

**適用場景**：
- 對安全性和性能都有最高要求
- 需要無垃圾回收的系統級應用
- 金融系統的核心模塊

**項目結構**：

```
implementations/rust/
├─ Cargo.toml
├─ src/
│  ├─ lib.rs
│  ├─ agent.rs
│  ├─ dimensions/
│  │  ├─ mod.rs
│  │  ├─ chip.rs
│  │  ├─ fundamental.rs
│  │  └─ technical.rs
│  └─ utils/
│     └─ weight.rs
└─ tests/
   └─ integration_tests.rs
```

**實現指南**：

```rust
// implementations/rust/src/agent.rs

use crate::dimensions::{ChipDimension, FundamentalDimension, TechnicalDimension};
use crate::utils::WeightCalculator;
use futures::join;

pub struct TriangulateAgent {
    symbol: String,
    chip_dimension: ChipDimension,
    fundamental_dimension: FundamentalDimension,
    technical_dimension: TechnicalDimension,
}

impl TriangulateAgent {
    pub async fn analyze(&self, scout_report: &ScoutReport) -> Result<AnalysisReport, Error> {
        // 並行執行三維分析
        let (chip_score, fund_score, tech_score) = join!(
            self.chip_dimension.analyze(scout_report),
            self.fundamental_dimension.analyze(scout_report),
            self.technical_dimension.analyze(scout_report)
        );

        // 處理結果...
        Ok(report)
    }
}
```

### 4. 提交多語言實現

**步驟**：

```bash
# 1. 創建分支
git checkout -b implementation-python-3d-hunt

# 2. 創建目錄結構
mkdir -p implementations/python/triangulate

# 3. 實現代碼
# 編寫 agent.py、dimensions/*.py、utils/*.py 等

# 4. 編寫 README
# implementations/python/README.md

# 5. 運行測試
pytest

# 6. 提交
git add implementations/python/
git commit -m "新增：三維獵殺 Python 實現（並發、數據科學友好）"

# 7. 提交 PR
# - 標題：新增 Python 實現：三維獵殺
# - 描述：
#   - 完全遵循定義書邏輯
#   - 使用 async/await 支持並發
#   - 包含 95% 測試覆蓋率
#   - 性能對標 JavaScript 版本
```

---

## ✅ 提交流程

### Pre-Submission 檢查清單

在提交 PR 前，請確保：

- [ ] **代碼風格**
  - [ ] 遵循項目的命名規範（camelCase for JS, snake_case for Python）
  - [ ] 添加了清晰的註釋和文檔
  - [ ] 代碼格式化（Prettier for JS, Black for Python）

- [ ] **功能完整性**
  - [ ] 實現了定義書中的全部邏輯
  - [ ] 更新了相應文檔（如 METHODOLOGY.md）
  - [ ] 如果修改了決策邏輯，更新了定義書

- [ ] **測試**
  - [ ] 運行了單元測試（npm test 或 pytest）
  - [ ] 測試通過率 > 90%
  - [ ] 運行了示例驗證（npm run examples）

- [ ] **文檔**
  - [ ] 編寫或更新了 README
  - [ ] 解釋了修改的原因和好處
  - [ ] 包含了使用示例

- [ ] **多語言實現專用**
  - [ ] 創建了 `implementations/{language}/README.md`
  - [ ] 包含了依賴安裝說明
  - [ ] 包含了運行示例
  - [ ] 包含了與 JavaScript 版本的對標測試

### 提交 PR 的標準格式

```markdown
## 描述
簡述你的貢獻內容

## 修改類型
- [ ] 新增功能
- [ ] 代碼優化
- [ ] 文檔更新
- [ ] 新增測試
- [ ] 多語言實現

## 關聯的問題
解決 #123（如果有）

## 修改內容
- 修改 1
- 修改 2
- 修改 3

## 測試
- [ ] 本地測試通過
- [ ] 示例運行成功
- [ ] 無性能退化

## 檢查清單
- [ ] 代碼遵循項目風格
- [ ] 已添加註釋和文檔
- [ ] 已更新相關文檔
- [ ] 包含測試（如適用）
```

---

## 🎖️ 貢獻者認可

我們會在 README.md 的「貢獻者」部分列出所有貢獻者：

```markdown
## 🌟 貢獻者

### 定義書改進
- @user1 - 優化基本面評分邏輯
- @user2 - 改進防騙局檢查規則

### 代碼優化
- @user3 - WeightCalculator 性能優化
- @user4 - 添加單元測試

### 多語言實現
- @user5 - Python 實現
- @user6 - Go 實現
- @user7 - Rust 實現
```

---

## 💬 問題與討論

### 有任何問題嗎？

1. **檢查現有的 Issues**：https://github.com/pppeee861005/ai-swarm-triangulate/issues

2. **提交新的 Issue**：
   ```
   標題：[Question] 如何修改權重配置
   標籤：question
   描述：我想用更高的基本面權重，應該在哪裡修改？
   ```

3. **參加討論**：
   在 Issues 或 Discussions 中互動

---

## 🚀 下一步行動

選擇你的貢獻方式：

### 🎯 剛開始？
→ 從「保存」開始：分享你的 Dynamic Workflows 腳本

### 💡 有改進想法？
→ 選擇「精進」：優化定義書或代碼

### 🌍 想展示技能？
→ 選擇「分享」：實現 Python/Go/Rust 版本

---

## 📚 相關資源

- 📖 **定義書**：[examples/02-三維獵殺/定義書.md](../examples/02-三維獵殺/定義書.md)
- 🔧 **方法論映射**：[METHODOLOGY.md](./METHODOLOGY.md)
- 📋 **主文檔**：[README.md](./README.md)
- 💰 **預算指南**：[examples/02-三維獵殺/預算控制.md](../examples/02-三維獵殺/預算控制.md)

---

**文檔版本**：0.1.0
**最後更新**：2026-06-04
**維護者**：AI Agent Commander
**狀態**：開放所有層級的社群貢獻
