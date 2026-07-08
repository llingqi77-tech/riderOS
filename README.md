# RiderOS — 双角色交互 Demo

面向非洲两轮骑手与资产金融公司的 AI 履约助手前端 Demo，包含 **骑手端（移动端）** 与 **金融公司端（桌面端）** 两个角色，并提供全局角色切换。

## 在线预览

推送至 GitHub 后自动部署，访问地址：

`https://<你的用户名>.github.io/riderOS/`

## 本地开发

```bash
npm install
npm run dev
```

打开 http://localhost:5173 ，默认进入骑手端。右上角可切换「骑手端 / 金融端」。

## 部署到 GitHub Pages

1. 将代码推送到 GitHub 仓库（`main` 分支）
2. 仓库 Settings → Pages → Build and deployment → Source 选择 **GitHub Actions**
3. 推送后 Actions 自动构建部署，约 1–2 分钟可访问

## 技术栈

React 18 · Vite · TypeScript · Tailwind CSS · Zustand · React Router v6 · Recharts · lucide-react

## 页面结构

### 骑手端 `/rider`

| 路由 | 页面 |
| --- | --- |
| `/rider/home` | 首页（净收入 + 行动序列 + 还款提醒 + 支出速记） |
| `/rider/orders` | 路径规划（模式切换 + 行动序列 + 订单列表） |
| `/rider/income` | 净收入看板（日/周/月 + 趋势图 + 明细） |
| `/rider/repayment` | 还款履约（倒计时 + 达标率分析 + 历史） |
| `/rider/me` | 我的（个人信息 + 支出录入 + 语言切换） |

AppBar 左侧 **城市选择器** 支持 Lagos / Nairobi / Abuja 三城切换，订单池、收入、还款数据联动更新。

### 金融端 `/finance`

| 路由 | 页面 |
| --- | --- |
| `/finance/overview` | 风险总览（KPI + 趋势 + 原因分布） |
| `/finance/risk-list` | 高风险骑手列表（筛选 + 立即干预） |
| `/finance/rider/:id` | 骑手详情（收入还款 / 风险预测 / SHAP 原因） |
| `/finance/interventions` | 干预追踪 |
