# RiderOS 前端开发 PRD 文档 v1\.0

# RiderOS 前端开发 PRD 文档

> **项目名称**：RiderOS — 面向非洲两轮骑手与资产金融公司的 AI 履约助手
> **文档版本**：v1\.0（前端开发版）— 基于全栈 PRD v0\.2 拆解
> **撰写日期**：2026\-07\-07
> **撰写人**：董璐瑶（产品） / AI 助手（前端视角重写）
> **目标比赛**：雏鹰 AI 创新大赛（移动互联模块）
> **DDL**：2026\-07\-10 初稿 / 2026\-07\-15 一版汇报 / 2026\-07\-16 二版汇报
> **本文档阅读对象**：前端开发同学（无需后端，无需 AI 模型训练）
> 
> 

---

## 0\. 文档说明

本 PRD 是 v0\.2 全栈 PRD 的**纯前端视角拆解**，目标是把"产品想做什么"翻译成"前端需要写什么"。

**与 v0\.2 全栈 PRD 的差异**：

- ✅ 保留：所有页面 UI、所有交互流程、所有 Mock 数据契约、所有状态管理、所有视觉规范

- ❌ 剥离：AI 模型训练细节、后端 API 详细设计、数据库、运维、权限分级

- 🔄 转化：AI 模型输出 → 前端调用的"预测结果数据结构"；后端 API → 前端的 Mock 契约

**前端工作量盘点**：

- 骑手端：**6 个页面** \+ 1 套底部 Tab \+ 5 个核心组件 ≈ **8 人日**

- 金融端：**7 个页面** \+ 1 套侧边栏 \+ 12 个核心组件 ≈ **12 人日**

- 全局（设计规范/状态管理/路由/Mock/多语言）：≈ **3 人日**

- **合计：约 23 人日**（按 2 个前端 1\.5 周评估，可在集训期间交付）

---

## 1\. 项目概述

### 1\.1 产品定位

RiderOS 是一款**面向非洲两轮骑手与资产金融公司**的 B2B2C AI 履约助手。MVP 阶段聚焦两类用户：

- **骑手端（Rider App）**：解决"算不清账 / 不知道该不该多接单 / 还款日临近焦虑"三大痛点

- **金融端（Finance Dashboard）**：解决"骑手一出门店就看不见 / 风险判断滞后 / 人工排查效率低"三大痛点

### 1\.2 MVP 范围（与 v0\.2 一致）

|角色|功能数|核心能力|
|---|---|---|
|骑手 \(Rider\)|3|多平台路径规划 / 日周月净收入看板 / 还款履约提醒|
|资产金融公司 \(Finance\)|7|风险总览 / 高风险列表 / 骑手详情 / 逾期预测 / 风险原因 / 干预追踪 / 信用画像|

### 1\.3 用户故事（汇总）

- **骑手阿米努**：每天打开看"今天还能赚多少、距离还款还差多少"，AI 帮他规划接单节奏。

- **风控经理凯文**：每天 9 点一眼看到整体风险，主动干预高风险骑手，把事后催收变事前提醒。

---

## 2\. 技术选型（建议方案）

> 团队可根据实际熟悉度调整，但需保证 MVP 演示流畅。
> 
> 

|维度|选型|理由|
|---|---|---|
|**框架**|React 18 \+ Vite|组件化成熟、生态完整、HMR 快|
|**语言**|TypeScript|类型安全、减少联调问题|
|**UI 库**|Tailwind CSS \+ shadcn/ui|快速搭建、样式可控、非洲场景不需要重型组件库|
|**状态管理**|Zustand|轻量、按需分片、易测试|
|**路由**|React Router v6|标准方案|
|**图表**|ECharts / Recharts|金融端 Dashboard 需要丰富图表|
|**图标**|Lucide Icons|与 shadcn 配套、轻量|
|**国际化**|react\-i18next|支持英 \+ 1 种本地语言（豪萨语/斯瓦希里语/约鲁巴语）|
|**Mock 数据**|MSW \(Mock Service Worker\)|模拟真实 API 调用，前端开发不阻塞|
|**地图（可选）**|Leaflet \+ OpenStreetMap|离线可用，规避 Google Maps 付费|
|**测试（可选）**|Vitest|单元测试|

> ⚠️ 如果团队更熟悉 Vue，可改为 Vue 3 \+ Vite \+ Pinia \+ Element Plus；核心架构不变。
> 
> 

---

## 3\. 全局规范

### 3\.1 视觉设计规范

#### 3\.1\.1 颜色规范

- **品牌主色**：`#10B981`（绿松石 — 体现"健康 / 履约 / 信用"）

- **辅助色**：`#3B82F6`（蓝）、`#F59E0B`（橙）、`#EF4444`（红）

- **风险等级色**（金融端核心）：

    - 绿（健康）`#10B981`

    - 黄（关注）`#F59E0B`

    - 橙（警告）`#FB923C`

    - 红（危险）`#EF4444`

- **中性色**：`#FFFFFF` / `#F9FAFB` / `#E5E7EB` / `#6B7280` / `#1F2937`

- **背景**：`#F9FAFB`（浅灰背景，骑手端整屏使用）/ `#FFFFFF`（卡片背景）

#### 3\.1\.2 字体规范

- **骑手端**（移动端）：

    - 主字体：`Inter` 或 `Noto Sans`

    - 数字字体：`DIN Pro` 或 `Roboto Mono`（强调净收入金额）

    - 标题：18\-24px / 行高 1\.3

    - 正文：14\-16px / 行高 1\.5

    - 数字大屏：32\-48px（净收入、达标率）

- **金融端**（桌面端）：

    - 主字体：`Inter`

    - 标题：20\-28px

    - 正文：14\-16px

    - 数据指标：24\-36px（粗体）

#### 3\.1\.3 间距与圆角

- **间距**：4 / 8 / 12 / 16 / 24 / 32 / 48 px（4 的倍数）

- **圆角**：卡片 12px / 按钮 8px / 标签 4px / 头像 50%

#### 3\.1\.4 图标规范

- **骑手端**：线性图标（Lucide outline）

- **金融端**：填充图标（Lucide solid）

- 统一尺寸：16 / 20 / 24 / 32px

#### 3\.1\.5 响应式断点

- 骑手端：仅做移动端，基准 375px（iPhone SE），适配至 414px

- 金融端：仅做桌面端，基准 1280px，适配至 1920px

- **不做跨端兼容**（节省时间）

### 3\.2 多语言支持

- **MVP 必须支持**：英语（默认）\+ 1 种本地语言（推荐斯瓦希里语 sw\-KE / 豪萨语 ha\-NG）

- **语言切换入口**：骑手端 \- 我的页面 → 语言；金融端 \- 顶部栏 → 语言

- **i18n 文件结构**：

    ```
    locales/
    ├── en.json
    ├── sw-KE.json   （或 ha-NG.json）
    └── index.ts
    ```

- **日期/数字格式**：

    - 尼日利亚：₦ \+ 千分位（`Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' })`）

    - 肯尼亚：KSh \+ 千分位

    - 时间：24h 制，避免 AM/PM 误读

### 3\.3 性能与离线

- **首屏加载**：骑手端 \< 2s，金融端 \< 3s

- **离线能力**（骑手端必须）：

    - 历史净收入数据缓存（IndexedDB / localStorage）

    - 离线时显示"已过期"标识

    - 网络恢复后自动同步

- **图片优化**：使用 WebP 格式，懒加载

- **代码分割**：金融端按路由懒加载

### 3\.4 状态管理架构（Zustand 切片设计）

```
src/store/
├── rider/
│   ├── auth.ts          // 骑手登录态
│   ├── orders.ts        // 多平台订单池
│   ├── income.ts        // 净收入数据
│   ├── expenses.ts      // 手动支出
│   ├── schedule.ts      // 还款日程
│   └── preferences.ts   // 偏好（语言 / 模式）
├── finance/
│   ├── auth.ts          // 风控人员登录
│   ├── dashboard.ts     // 风险总览数据
│   ├── riders.ts        // 骑手列表 / 详情
│   ├── riskModel.ts     // 风险预测结果
│   └── interventions.ts // 干预建议与追踪
└── shared/
    ├── i18n.ts
    └── network.ts       // 离线状态
```

### 3\.5 路由架构

#### 3\.5\.1 骑手端（Mobile App）

```
/                        → 启动页（角色选择 / 跳过）
/rider                   → 骑手端布局（底部 Tab）
  ├── /home              → 首页（净收入 + 行动序列入口）
  ├── /orders            → 路径规划页（F-A1）
  ├── /income            → 净收入看板（F-A2）
  ├── /repayment         → 还款履约（F-A3）
  └── /me                → 我的（设置 / 语言 / 支出录入）
```

#### 3\.5\.2 金融端（Web Dashboard）

```
/                        → 启动页（金融方登录）
/finance                 → 金融端布局（左侧菜单 + 顶栏）
  ├── /overview          → 风险总览（F-B1）
  ├── /risk-list         → 高风险骑手列表（F-B2）
  ├── /rider/:id         → 骑手详情（F-B3 / F-B4 / F-B5）
  ├── /interventions     → 干预建议与追踪（F-B6）
  ├── /credit-profile    → 信用画像与升级车贷（F-B7）
  └── /settings          → 设置（语言 / 主题）
```

### 3\.6 Mock 数据约定

> **MVP 阶段所有数据来自前端 Mock**，不依赖真实 API。后端联调时只需把 MSW 的 handler 替换为真实地址。
> 
> 

#### 3\.6\.1 Mock 工具

- **MSW \(Mock Service Worker\)**：拦截 fetch / axios 请求，返回 Mock 数据

- **Mock 数据位置**：`src/mocks/data/`

- **Mock 处理器**：`src/mocks/handlers/`

- **数据规模**：

    - 骑手端：1 个骑手完整数据 \+ 50\-100 条 Mock 订单

    - 金融端：200 个 Mock 骑手 \+ 30 天历史数据

#### 3\.6\.2 核心数据契约

##### 类型 1：Order（订单）

```typescript
interface Order {
  orderId: string;             // 'ord_001'
  platform: 'chowdeck' | 'glovo' | 'bolt_food' | 'uber_eats';
  merchantName: string;        // 'Mama Cass Restaurant'
  merchantLocation: { lat: number; lng: number };
  deliveryLocation: { lat: number; lng: number };
  distance: number;            // km
  estimatedEarnings: number;   // NGN（尼日利亚奈拉）
  estimatedDuration: number;   // 分钟
  pickupEta: number;           // 商家预计出餐时间（分钟）
  createdAt: string;           // ISO 时间
  expiresAt: string;           // 订单过期时间
}
```

##### 类型 2：Rider（骑手）

```typescript
interface Rider {
  riderId: string;
  name: string;
  avatar: string;              // URL
  phone: string;
  city: string;
  vehicle: 'motorcycle' | 'electric_scooter';
  vehicleId: string;
  financeCompany: 'Watu' | 'MAX' | 'M-Kopa' | 'Tugende' | 'Ampersand';
  installmentAmount: number;   // 每周/每月应还
  installmentCycle: 'weekly' | 'monthly';
  totalPeriods: number;
  currentPeriod: number;
  creditScore: number;         // 300-850
  riskLevel: 'green' | 'yellow' | 'orange' | 'red';
  riskProbability: number;     // 0-1
  registeredAt: string;
}
```

##### 类型 3：IncomeRecord（收入记录）

```typescript
interface IncomeRecord {
  recordId: string;
  riderId: string;
  type: 'order' | 'expense';
  category?: 'fuel' | 'electricity' | 'food' | 'maintenance' | 'platform_fee';
  amount: number;              // NGN
  platform?: string;
  timestamp: string;           // ISO
  note?: string;
}
```

##### 类型 4：RepaymentSchedule（还款日程）

```typescript
interface RepaymentSchedule {
  scheduleId: string;
  riderId: string;
  dueDate: string;             // ISO
  amount: number;              // NGN
  status: 'pending' | 'paid' | 'overdue';
  daysUntilDue: number;        // 负数表示已逾期
}
```

##### 类型 5：RiskPrediction（风险预测结果，前端展示用）

```typescript
interface RiskPrediction {
  riderId: string;
  predictedAt: string;         // 模型跑批时间
  overdueProbability7d: number;   // 0-1
  overdueProbability14d: number;  // 0-1
  overdueProbability30d: number;  // 0-1
  riskLevel: 'green' | 'yellow' | 'orange' | 'red';
  reasons: Array<{
    factor: string;            // '日均净收入下降'
    contribution: number;      // 0-1，SHAP 贡献度
    description: string;       // 详细描述
  }>;
  recommendedAction: {
    type: 'sms' | 'call' | 'meeting' | 'repossess';
    template: string;          // 建议话术
    expectedImpact: string;    // 预期效果
  };
}
```

##### 类型 6：Intervention（干预记录）

```typescript
interface Intervention {
  interventionId: string;
  riderId: string;
  type: 'sms' | 'call' | 'meeting' | 'repossess';
  content: string;
  sentAt: string;
  sentBy: string;              // 风控人员 ID
  outcome: {
    response7d?: { ordersCompleted: number; incomeRecovered: number };
    response14d?: { ordersCompleted: number; incomeRecovered: number };
    finalOutcome?: 'recovered' | 'partial' | 'failed';
  };
}
```

---

## 4\. 骑手端 \(Rider App\) 详细设计

### 4\.1 公共布局

#### 4\.1\.1 底部 Tab 导航

- **位置**：固定底部，高度 60px

- **Tab 项**：首页 / 接单 / 收入 / 还款 / 我的（5 个）

- **图标 \+ 文字**双层展示

- **当前 Tab** 主色高亮 \+ 顶部小圆点

- **响应式**：安全区适配 iPhone 底部 home indicator

#### 4\.1\.2 顶部 AppBar

- **首页 / 接单 / 收入 / 还款**：左侧"城市选择器"（下拉），中间"骑手姓名 \+ 头像"，右侧"通知铃铛"

- **我的页面**：居中标题"我的"

#### 4\.1\.3 通用组件

- `<NetIncomeBigCard>` — 大数字净收入卡片

- `<ActionSequenceCard>` — 行动序列推荐卡片

- `<TrendChart>` — 趋势图（日/周/月可切换）

- `<RiskBadge>` — 风险等级徽章

- `<ProgressBar>` — 进度条（达标率）

- `<ExpenseInputSheet>` — 支出录入底部弹层

### 4\.2 首页 `/rider/home`

#### 4\.2\.1 页面结构

```
顶部 AppBar
├── Hero 区域（核心数字 + 鼓励语）
│   ├── 大数字：今日净收入（32px 粗体）
│   ├── 副数字：目标完成度 + 预计达标时间
│   ├── 进度条：今日达成率
│   └── 鼓励语："再跑 2 单就能达到今日目标"
├── 行动序列入口卡片（引导进入 F-A1）
├── 还款提醒卡片（如果 7 天内到期，显示预警）
├── 今日支出速记（4 个快捷按钮：加油 / 换电 / 餐食 / 维修）
└── AI 解读卡片（每日 1 条洞察）
```

#### 4\.2\.2 Mock 数据

- `useRiderStore.dailyIncome` — 今日净收入

- `useRiderStore.todayTarget` — 今日目标

- `useRiderStore.dailyEta` — 预计达标时间

- `useRiderStore.aiInsight` — AI 每日洞察

#### 4\.2\.3 关键交互

- 点击"行动序列" → 跳转 `/rider/orders`

- 点击"还款提醒" → 跳转 `/rider/repayment`

- 点击"今日支出"按钮 → 弹出 `<ExpenseInputSheet>`，提交后实时更新净收入

- 长按数字 → 显示明细弹层

### 4\.3 路径规划页 `/rider/orders`（F\-A1）

> ⚠️ **v0\.2 修订核心**：本功能是"路径规划"而非"挑单"，详见 v0\.2 PRD 1\.2 双视角对照。
> 
> 

#### 4\.3\.1 页面结构

```
顶部 AppBar（标题："行动序列"）
├── 模式切换器（Segment Control）
│   ├── 最优路径（默认）
│   ├── 还款冲刺（还款日前 3 天可手动开启）
│   └── 低强度（夜间/疲劳时可手动开启）
├── 行动序列卡片（核心展示）
│   ├── 序列标题："接下来 2 小时建议接 3 单"
│   ├── 预计总净收入（大字）
│   ├── 预计总时间
│   ├── 地图预览（Leaflet 简单路径图）
│   ├── 订单列表（按推荐顺序 1/2/3）
│   │   ├── 平台图标 + 商家名
│   │   ├── 距离 + 预估收入
│   │   └── "接受 / 跳过"按钮
│   └── 净收入机会成本提示
└── 订单池入口（"查看所有订单"）
```

#### 4\.3\.2 关键交互

- **模式切换**：点击 Segment 立即重新规划，3 种模式的差异体现在"推荐单数 / 节奏"

- **接受推荐**：按顺序接单 → 调用对应平台 API（MVP 阶段 Mock 跳转）

- **跳过某单**：从序列中移除 → 系统 5 秒内重新规划

- **拒绝全部**：切换为"自由接单模式"，仅显示订单池（不做推荐）

- **机会成本提示**：每张订单卡片下方有 1 句话提示

#### 4\.3\.3 路径规划算法（前端实现）

```typescript
// src/utils/pathPlanner.ts
interface PlanRequest {
  orders: Order[];
  rider: Rider;
  mode: 'optimal' | 'repayment' | 'low_intensity';
  horizon: number; // 小时
}

interface PlanResult {
  sequence: Order[];
  totalEarnings: number;
  totalDuration: number;
  totalDistance: number;
}

// 算法：贪心 + 局部搜索
// 1. 按 mode 过滤候选订单（不按价值排他，只按模式决定密度）
// 2. 用最近邻 + 2-opt 局部搜索优化路径
// 3. 计算总净收入（订单金额 - 油/电预估）
// 4. 输出序列
```

#### 4\.3\.4 异常状态 UI

- 平台 API 不可用 → 顶部黄色横幅"Chowdeck 数据暂不可用"

- 网络离线 → 顶部红色横幅"离线模式 · 数据 5 分钟前"

- 订单池为空 → 空状态插画"暂无订单，稍后再来"

### 4\.4 净收入看板页 `/rider/income`（F\-A2）

#### 4\.4\.1 页面结构

```
顶部 AppBar（标题："净收入"）
├── 时间维度切换（Segment Control）
│   ├── 今日
│   ├── 本周
│   └── 本月
├── 核心数字卡
│   ├── 当前维度净收入（超大数字）
│   ├── 同比/同期对比
│   ├── 目标完成度
│   └── 历史最佳对比
├── 趋势图（折线图，可缩放）
│   ├── X 轴：日（今日） / 日（本周） / 日（本月）
│   ├── Y 轴：净收入 NGN
│   ├── 收入线 + 支出线（双线）
│   └── 高亮显示里程碑
├── 收支构成（饼图 + 列表）
│   ├── 收入来源（按平台）
│   └── 支出分类（油/电/餐食/维修）
├── 交易明细列表（可滚动）
│   ├── 时间 + 类型图标 + 描述 + 金额
│   └── 收入绿色，支出红色
└── AI 解读（每日 1 条）
```

#### 4\.4\.2 关键交互

- Tab 切换 → 切换时间维度，数据重新加载（Mock 切换）

- 长按数字 → 弹层显示明细来源

- 点击交易行 → 详情弹层（订单详情 / 支出详情）

- 下滑刷新 → 重新拉取数据

#### 4\.4\.3 净收入计算公式（前端实现）

```typescript
// 净收入 = 平台总收入 - 平台抽成 - 油/电/餐食/维修成本
function calculateNetIncome(orders: Order[], expenses: Expense[]): number {
  const gross = orders.reduce((sum, o) => sum + o.estimatedEarnings, 0);
  const platformFee = gross * 0.15; // 平均 15% 抽成
  const expenseTotal = expenses.reduce((sum, e) => sum + e.amount, 0);
  return gross - platformFee - expenseTotal;
}
```

### 4\.5 还款履约页 `/rider/repayment`（F\-A3）

#### 4\.5\.1 页面结构

```
顶部 AppBar（标题："还款"）
├── 下一期还款卡（核心展示）
│   ├── 距离还款日倒计时（大字）
│   ├── 应还金额
│   ├── 预期达标率（带颜色：绿/黄/橙/红）
│   └── 进度条
├── 达标率分析
│   ├── 已净收入（当前累计）
│   ├── 预计净收入（基于过去 14 天均值）
│   ├── 还款金额
│   ├── 差额（正数=已达标 / 负数=缺口）
│   └── 加班建议
├── 干预建议（按触发时机显示）
│   ├── 提前 7 天：轻量提醒
│   ├── 提前 3 天：App 内 + 短信
│   ├── 提前 1 天：冲刺建议
│   └── 还款日：完成确认
└── 还款历史（最近 12 期）
```

#### 4\.5\.2 关键交互

- 点击"加班建议" → 跳转 `/rider/orders` 并自动切换为"还款冲刺"模式

- 点击"我已还款" → 弹窗确认 → 立即同步金融方系统（Mock 设为已还）

- 点击历史期数 → 详情弹层

- 收到推送 → 横幅显示"还款提醒" \+ 操作按钮

#### 4\.5\.3 触发时机 UI

```typescript
function getReminderLevel(daysUntilDue: number) {
  if (daysUntilDue > 7) return { level: 'none', color: 'gray' };
  if (daysUntilDue >= 3) return { level: 'observe', color: 'yellow' };  // 观察期
  if (daysUntilDue >= 1) return { level: 'urgent', color: 'orange' };   // 高优
  if (daysUntilDue === 0) return { level: 'deadline', color: 'red' };   // 当天
  return { level: 'overdue', color: 'red' };                              // 已逾期
}
```

### 4\.6 我的页 `/rider/me`

#### 4\.6\.1 页面结构

```
顶部 AppBar
├── 个人信息卡
│   ├── 头像 + 姓名
│   ├── 骑手 ID
│   ├── 所属金融方（Watu / MAX / M-Kopa 等）
│   ├── 信用分（300-850）
│   └── 累计按时还款期数
├── 支出录入入口
│   ├── 加油 / 换电 / 餐食 / 维修 4 类
│   └── 今日已录入金额
├── 数据与隐私
│   ├── 授权管理（哪些数据共享给金融方）
│   └── 清除缓存
├── 语言切换
├── 关于 / 帮助
└── 退出登录
```

### 4\.7 骑手端组件清单

|组件|位置|复用页面|复杂度|
|---|---|---|---|
|`<BottomTabBar>`|全局|5 个|低|
|`<TopAppBar>`|全局|5 个|低|
|`<NetIncomeBigCard>`|首页 / 收入页|2|中|
|`<ActionSequenceCard>`|首页 / 接单页|2|高|
|`<ModeSwitcher>`|接单页|1|低|
|`<OrderCard>`|接单页 / 订单池|2|中|
|`<TrendChart>`|收入页|1|中|
|`<CategoryPieChart>`|收入页|1|中|
|`<ExpenseInputSheet>`|首页 / 我的|2|中|
|`<RepaymentCountdown>`|还款页|1|中|
|`<AIInsightCard>`|首页 / 收入 / 还款|3|低|
|`<RiskBadge>`|还款页 / 我的|2|低|

---

## 5\. 金融端 \(Finance Dashboard\) 详细设计

### 5\.1 公共布局

#### 5\.1\.1 顶部栏

- 左侧：Logo \+ 金融方名称（如"Watu 内罗毕分公司"）

- 中间：全局搜索（骑手 ID / 姓名）

- 右侧：通知铃铛 \+ 用户头像下拉（个人信息 / 设置 / 退出）

#### 5\.1\.2 左侧菜单

- 风险总览（F\-B1）

- 高风险骑手列表（F\-B2）

- 干预追踪（F\-B6）

- 信用画像（F\-B7）

- 分隔线

- 设置

#### 5\.1\.3 通用组件

- `<RiskLevelBadge>` — 风险等级徽章（绿/黄/橙/红）

- `<RiderCard>` — 骑手列表行

- `<KpiCard>` — KPI 数字卡

- `<TrendLineChart>` — 趋势折线图

- `<RiskReasonList>` — 风险原因列表（SHAP 可视化）

- `<InterventionTimeline>` — 干预时间线

- `<DataTable>` — 数据表格（支持排序/筛选/分页）

### 5\.2 风险总览页 `/finance/overview`（F\-B1）

#### 5\.2\.1 页面结构

```
顶部栏
左侧菜单
主内容区
├── 4 个 KPI 数字卡（顶部）
│   ├── 在贷骑手数
│   ├── 本月新增高风险数
│   ├── 30 天预测新增逾期
│   └── 干预后转化率
├── 风险趋势折线图（中部，左）
│   ├── X 轴：30 天
│   ├── Y 轴：风险人数
│   └── 4 条线（绿/黄/橙/红）
├── 风险分布饼图（中部，右）
│   ├── 风险原因分布
│   └── 点击下钻到 F-B2
└── 干预效果趋势（底部）
    ├── 干预后转化率（30 天）
    └── ROI 折线
```

#### 5\.2\.2 关键交互

- 点击 KPI 卡 → 跳转到对应详情列表

- 点击饼图扇区 → 跳转到 F\-B2 并按原因筛选

- 时间筛选（30/60/90 天）

### 5\.3 高风险骑手列表页 `/finance/risk-list`（F\-B2）

#### 5\.3\.1 页面结构

```
顶部栏
左侧菜单
主内容区
├── 筛选条件栏（顶部）
│   ├── 风险等级（多选）
│   ├── 城市
│   ├── 车辆类型
│   ├── 分期金额
│   └── 上次干预时间
├── 排序选项
│   ├── 逾期概率（默认）
│   ├── 风险等级
│   ├── 还款日期
│   └── 上次干预时间
├── 骑手列表（每行）
│   ├── 头像 + 姓名 + ID
│   ├── 风险等级徽章
│   ├── 逾期概率（大字 + 进度条）
│   ├── 主要风险原因（1 句话）
│   ├── 距离下次还款天数
│   ├── 推荐干预方案（1 句话）
│   └── [查看详情] [立即干预] 按钮
└── 分页（每页 20 条）
```

#### 5\.3\.2 关键交互

- 点击行 → 跳转到 F\-B3 骑手详情

- 点击"立即干预" → 弹层显示建议话术 \+ 确认按钮

- 批量操作：勾选多行 → 批量 SMS / 批量导出

- 列排序：点击列头切换升降序

### 5\.4 骑手详情页 `/finance/rider/:id`（F\-B3 / F\-B4 / F\-B5）

#### 5\.4\.1 页面结构

```
顶部栏
左侧菜单
主内容区
├── 头部：骑手基本信息
│   ├── 头像 + 姓名 + ID
│   ├── 风险等级（大徽章 + 概率）
│   ├── 信用分
│   └── [立即干预] [导出 PDF] 按钮
├── 关键指标卡（4 个）
│   ├── 30 天日均净收入
│   ├── 当前 DPD
│   ├── 距下次还款天数
│   └── 历史按时还款率
├── Tab 切换
│   ├── 收入与还款（F-B3）
│   ├── 风险预测（F-B4）
│   ├── 风险原因（F-B5）
│   ├── 工作活跃度
│   ├── 车辆状态
│   └── 干预历史
└── Tab 内容区
```

#### 5\.4\.2 Tab 1：收入与还款

- 30/60/90 天日均净收入折线图

- 12 期还款历史（绿/黄/红）

- 收入构成饼图

#### 5\.4\.3 Tab 2：风险预测

- 7/14/30 天逾期概率柱状图

- 模型更新时间

- 风险等级阈值说明

#### 5\.4\.4 Tab 3：风险原因（SHAP 可视化）

- 横向条形图（特征贡献度）

- 文字解释（前 3 大原因）

- 可点击展开"详细分析"

#### 5\.4\.5 Tab 4：工作活跃度

- 日均在线时长（折线图）

- 工作时段分布（热力图）

- 日均单量

#### 5\.4\.6 Tab 5：车辆状态

- 最近定位时间

- 累计里程

- 维修记录列表

#### 5\.4\.7 Tab 6：干预历史

- 时间线展示（按时间倒序）

- 每条干预：类型 \+ 内容 \+ 7/14/30 天效果

- 可点击"再次干预"

### 5\.5 干预追踪页 `/finance/interventions`（F\-B6）

#### 5\.5\.1 页面结构

```
顶部栏
左侧菜单
主内容区
├── 筛选条件
│   ├── 干预类型（SMS / 电话 / 面谈 / 收回）
│   ├── 时间范围
│   ├── 效果（已挽回 / 部分挽回 / 失败）
│   └── 风控人员
├── 干预总览（4 个 KPI）
│   ├── 本月已干预骑手数
│   ├── 干预后 7 天转化率
│   ├── 干预 ROI
│   └── 平均挽回时长
├── 干预效果分布（图表）
│   ├── 7/14/30 天效果柱状图
│   └── 按干预类型分组
├── 干预模板库（右侧栏 / 弹层）
│   ├── 20-30 条标准话术
│   ├── 按风险等级匹配
│   └── [采纳建议] 一键填充
└── 干预记录列表
    ├── 骑手 + 干预类型 + 时间 + 效果
    └── [查看详情] [再次干预]
```

### 5\.6 信用画像页 `/finance/credit-profile`（F\-B7）

#### 5\.6\.1 页面结构

```
顶部栏
左侧菜单
主内容区
├── 筛选条件
│   ├── 信用分区间
│   ├── 按时还款率
│   └── 当前车辆已还比例
├── 升级候选列表
│   ├── 骑手 + 信用分 + 按时率 + 升级建议
│   └── [生成升级方案]
├── 信用分分布图
│   └── 300-850 区间分布
└── 升级效果预估
    ├── 预计新增收益
    └── 预计流失率
```

### 5\.7 金融端组件清单

|组件|复用页面|复杂度|
|---|---|---|
|`<TopBar>`|全局|低|
|`<SideMenu>`|全局|中|
|`<KpiCard>`|总览 / 列表 / 干预 / 信用|4 处|
|`<RiskLevelBadge>`|列表 / 详情|中|
|`<RiderListRow>`|列表|中|
|`<DataTable>`|列表|高|
|`<TrendLineChart>`|总览 / 详情|多处|
|`<RiskPieChart>`|总览 / 详情|多处|
|`<ShapBarChart>`|详情|中|
|`<InterventionTimeline>`|详情 / 干预|中|
|`<InterventionTemplateModal>`|干预|中|
|`<UpgradeSuggestionCard>`|信用|中|

---

## 6\. 跨角色流程（前端视角）

### 6\.1 数据流向图

```
骑手端产生数据（F-A1/F-A2/F-A3）
        ↓
    Mock API（MSW）
        ↓
金融端获取数据（MSW 返回 Mock）
        ↓
金融端发起干预（F-B6）
        ↓
    Mock API（MSW）
        ↓
骑手端接收干预（F-A3 显示提醒）
        ↓
骑手响应 → 数据回流 → 循环
```

### 6\.2 关键时序

1. **D0**：骑手首次打开 App → 注册页（Mock）→ 进入首页

2. **D1\-7**：累计接单 \+ 录入支出 → AI 累计数据

3. **D7\+**：净收入看板开始显示真实数据

4. **D7\+**：金融端 Dashboard 可看到该骑手

5. **D14\+**：金融端对该骑手生成信用分 \+ 风险预测

6. **D14\+**：还款履约提醒开始生效

7. **D30\+**：进入持续运营循环

### 6\.3 Demo 演示流程（建议 8\-10 分钟）

1. **开场 1 分钟**：产品定位 \+ 用户故事

2. **骑手端演示 4 分钟**：

    - 首页（净收入 \+ AI 解读）

    - 接单页（路径规划推荐）

    - 收入页（日/周/月切换）

    - 还款页（提前 3 天提醒）

3. **金融端演示 3 分钟**：

    - 风险总览（KPI \+ 趋势）

    - 高风险列表（筛选 \+ 详情）

    - 干预追踪（建议 \+ 效果）

4. **收尾 1 分钟**：商业模式 \+ 传音生态协同

---

## 7\. 非功能需求（前端版）

|维度|要求|验收标准|
|---|---|---|
|**性能**|骑手端首屏 \< 2s；金融端 Dashboard \< 3s|Lighthouse 性能分 \> 80|
|**离线能力**|骑手端核心功能支持离线|断网后仍可看历史数据 \+ 录入支出|
|**多语言**|英 \+ 1 种本地语言|Demo 中必须演示语言切换|
|**可访问性**|字号、对比度满足 WCAG AA|关键文字 16px\+|
|**兼容性**|骑手端：iOS Safari \+ Android Chrome 最新版|不做 IE 兼容|
|**响应式**|骑手端 375\-414px；金融端 1280\-1920px|极限断点无横向滚动|
|**错误处理**|所有 API 失败有用户友好提示|不显示"undefined" / "\[object Object\]"|
|**加载状态**|所有异步操作有 loading 态|骨架屏 / Spinner|

---

## 8\. 开发任务拆分（按 Sprint 排期）

### 8\.1 Sprint 1（Day 1\-3，3 天）— 基础 \+ 骑手端核心

* [ ] 项目脚手架搭建（Vite \+ React \+ TS \+ Tailwind \+ Zustand \+ Router）

* [ ] 视觉规范落库（颜色/字体/间距常量 \+ Tailwind 主题）

* [ ] Mock 数据准备（1 个骑手完整数据 \+ 50 条订单）

* [ ] 公共布局（骑手端底部 Tab \+ 顶部 AppBar）

* [ ] 首页（净收入 \+ 行动序列入口 \+ AI 解读）

* [ ] 路径规划页（F\-A1，v0\.2 修订版）

* [ ] 净收入看板页（F\-A2）

### 8\.2 Sprint 2（Day 4\-6，3 天）— 骑手端收尾 \+ 金融端核心

* [ ] 还款履约页（F\-A3）

* [ ] 我的页（设置 \+ 语言 \+ 支出录入）

* [ ] 公共布局（金融端顶部栏 \+ 左侧菜单）

* [ ] 风险总览页（F\-B1）

* [ ] 高风险骑手列表页（F\-B2）

* [ ] Mock 数据扩展到 200 个骑手

### 8\.3 Sprint 3（Day 7\-9，3 天）— 金融端详情 \+ 联调

* [ ] 骑手详情页（F\-B3 / F\-B4 / F\-B5，6 个 Tab）

* [ ] 干预追踪页（F\-B6）

* [ ] 信用画像页（F\-B7）

* [ ] MSW 完整配置

* [ ] 多语言完整翻译（英 \+ 1 种本地语言）

### 8\.4 Sprint 4（Day 10\-12，3 天）— 优化 \+ 演示准备

* [ ] 离线能力实现（IndexedDB \+ Service Worker）

* [ ] 响应式微调

* [ ] 性能优化（懒加载 / 代码分割）

* [ ] Demo 演示流程演练

* [ ] Bug 修复 \+ UI 打磨

* [ ] 备份 Demo 数据

---

## 9\. Demo 演示注意事项

### 9\.1 演示设备

- 骑手端：建议用 iPhone 真机或 iOS Simulator（iPhone 14 / 375x812）

- 金融端：MacBook 13\-15 寸 / 1280\-1920 宽屏

### 9\.2 演示数据准备

- **骑手端**：阿米努（30 岁，拉各斯骑手）完整 Mock 数据

- **金融端**：200 个 Mock 骑手 \+ 30 天历史 \+ 高风险样本 10 个

- **关键场景**：

    - 阿米努今日净收入 ₦6,500 / 目标 ₦7,000 / 还差 ₦500

    - 还款日 3 天后 / 预期达标率 78%（黄色）

    - 1 个红色风险骑手用于演示"立即干预"

### 9\.3 演示中可能的问题

- **网络抖动**：所有数据已缓存，离线可演示

- **iOS 兼容问题**：用真机演示前先在真机跑一遍

- **时间紧迫**：只演示核心 6 个页面，其他用"页面预览图"快速带过

---

## 10\. 验收清单

### 10\.1 功能验收

* [ ] 骑手端 3 个核心功能（F\-A1 / F\-A2 / F\-A3）完整可用

* [ ] 金融端 7 个核心功能（F\-B1 \~ F\-B7）完整可用

* [ ] 跨端数据闭环：骑手数据 → 金融端可见 → 干预回流

### 10\.2 设计验收

* [ ] 视觉规范全部落地（颜色/字体/间距/圆角）

* [ ] 骑手端在 375px / 414px 下无横向滚动

* [ ] 金融端在 1280px / 1920px 下排版正常

* [ ] 英 \+ 1 种本地语言切换正常

### 10\.3 性能验收

* [ ] 骑手端 Lighthouse 性能分 \> 80

* [ ] 金融端首屏 \< 3s

* [ ] 离线模式下核心功能可用

### 10\.4 演示验收

* [ ] 8\-10 分钟演示流程跑通无卡顿

* [ ] 关键场景数据准备就绪

* [ ] 真机演示无 iOS 兼容问题

---

## 11\. 待澄清问题（前端相关）

1. **设计稿**：是否有 UI 设计稿？还是由前端自行设计？

2. **品牌色**：当前主色 `#10B981`（绿松石）是否需要调整？

3. **本地语言**：英 \+ 哪种本地语言？（斯瓦希里语 / 豪萨语 / 约鲁巴语）

4. **Demo 形态**：HTML 交互式 vs 真 App（iOS / Android）？

5. **多端兼容**：是否需要做 iPad / Android 平板兼容？（默认不需要）

6. **打印/导出**：金融端是否需要 PDF 导出骑手详情？

7. **数据权限**：风控人员能看到哪些字段？是否需要按角色分级？

---

## 12\. 附录

### 12\.1 推荐开源资源

- **shadcn/ui**（组件库）

- **Tailwind CSS**（样式）

- **Lucide Icons**（图标）

- **MSW**（Mock）

- **ECharts**（图表）

- **Leaflet**（地图）

- **react\-i18next**（国际化）

### 12\.2 上游文档

- [RiderOS 设计方案（何宇霄）](https://www.feishu.cn/docx/ZfARdgc1XoO7wOx1NNOcQxzknvq)

- [RiderOS 产品定位（丁岚月）](https://www.feishu.cn/docx/EGfkdxzXBoE9InxenKlcWwKOnHe)

- 全栈 PRD v0\.2（飞书云文档）

### 12\.3 文档变更记录

- **v1\.0（2026\-07\-07）**：从全栈 PRD v0\.2 拆解为纯前端版

    - 保留：所有 UI/交互/视觉规范/Mock 契约

    - 剥离：AI 模型训练 / 后端 API 详细设计 / 数据库 / 运维

    - 新增：技术选型、组件清单、路由表、状态管理切片、Sprint 排期、验收清单

---

> **本 PRD 专注于前端开发交付物**，与全栈 PRD v0\.2 配套使用。AI 模型 \+ 后端 API 细节请参考全栈 PRD；前端调用约定见本 PRD §3\.6 Mock 数据约定。
> 
> 

> (注：内容由 AI 生成，请谨慎参考）
