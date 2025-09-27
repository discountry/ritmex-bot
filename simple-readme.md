# 简明上手指南（零基础）

这份指南面向完全没有开发经验的用户，手把手带你在 Windows、macOS（或 WSL）上运行 **ritmex-bot**。每个步骤都尽量写得直观，出现问题也能快速定位。

---

## 0. 你需要准备什么？
- **Git（推荐）**：从 [git-scm.com](https://git-scm.com/download) 安装；macOS 在终端输入 `git --version` 会提示安装 Xcode Command Line Tools。
- **VS Code**：前往 [code.visualstudio.com](https://code.visualstudio.com/) 下载。用它编辑 `.env` 与查看文件最方便。
- **终端/命令行**：
  - macOS：Spotlight 搜索 “Terminal”
  - Windows：开始菜单搜索 “PowerShell” 或 “Windows Terminal”
  - WSL：运行 `wsl` 后进入 Linux 子系统

如果暂时无法使用 Git，可以在 GitHub 上下载 ZIP，后面步骤相同。

---

## 1. 获取项目代码
### 方式 A：Git（推荐）
```bash
git clone https://github.com/discountry/ritmex-bot.git
cd ritmex-bot
```

### 方式 B：下载压缩包
1. 打开仓库页面：<https://github.com/discountry/ritmex-bot>
2. 点击绿色的 `Code` → `Download ZIP`
3. 解压到易于找到的路径，例如：
   - Windows：`C:\Users\你的用户名\Desktop\ritmex-bot`
   - macOS：`~/Desktop/ritmex-bot`
4. 打开终端，使用 `cd` 进入该目录：
   ```bash
   cd ~/Desktop/ritmex-bot         # macOS 示例
   cd C:\Users\你\Desktop\ritmex-bot  # Windows 示例
   ```

进入项目后，执行 `ls`（macOS/Linux）或 `dir`（Windows）应能看到 `package.json`、`index.ts` 等文件。

---

## 2. 安装 Bun（项目运行环境）
### macOS / Linux
```bash
curl -fsSL https://bun.sh/install | bash
```
安装完关闭并重新打开终端，输入 `bun -v`，出现版本号表示成功。

### Windows PowerShell
```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```
同样重新打开 PowerShell，确认 `bun -v` 正常。

> 其他安装方式详见 [bun.com/get](https://bun.com/get)。

---

## 3. 安装依赖
在项目目录执行：
```bash
bun install
```
首次运行会下载所有依赖包。

---

## 4. 配置环境变量（.env）
### 复制模板
```bash
cp .env.example .env
```
若在 Windows 无法使用 `cp`，可以在资源管理器中复制 `.env.example` 并重命名为 `.env`。

### 编辑 `.env`
用 VS Code 或记事本打开 `.env`，至少填入：
```bash
ASTER_API_KEY=你的AsterKey
ASTER_API_SECRET=你的AsterSecret
```
其他常用参数已有默认值，需要个性化时修改即可：
- `TRADE_SYMBOL` / `TRADE_AMOUNT`
- `LOSS_LIMIT`、`TRAILING_PROFIT`、`TRAILING_CALLBACK_RATE`
- `PROFIT_LOCK_TRIGGER_USD` / `PROFIT_LOCK_OFFSET_USD`
- `BOLLINGER_LENGTH` / `BOLLINGER_STD_MULTIPLIER` / `MIN_BOLLINGER_BANDWIDTH`
- `PRICE_TICK` / `QTY_STEP`
- `MAKER_*` 系列（若要启用做市策略）

如需切换到 GRVT，请将 `EXCHANGE=grvt` 并补充 `GRVT_API_KEY`、`GRVT_API_SECRET`、`GRVT_SUB_ACCOUNT_ID` 等变量，详细说明见 `.env.example`。

### 获取 GRVT API Key/Secret
1. 打开 <https://grvt.io/exchange/account/api-keys>
2. 点击 **Generate** 创建新的 API 组合，保存系统生成的 **API Key** 与 **钱包密钥（Wallet Secret）**
3. 页面同时会显示 **Trading Account ID**，请一并记录备用（填入 `GRVT_SUB_ACCOUNT_ID`）
4. 将上述值写入 `.env`，并妥善保管：
   ```bash
   EXCHANGE=grvt
   GRVT_API_KEY=你的GRVTKey
   GRVT_API_SECRET=你的GRVT钱包密钥
   GRVT_SUB_ACCOUNT_ID=你的TradingAccountID
   ```
5. 仍需保留 `TRADE_SYMBOL`、`PRICE_TICK` 等核心参数，确保与 GRVT 合约规则一致

> GRVT 的 API Key 和钱包密钥生成后只显示一次，请立即保存。Trading Account ID 用于区分子账户。

> 保存 `.env` 后无需手动刷新，只要重新运行命令即可生效。

---

## 5. 获取 Aster API Key/Secret
1. 打开 <https://www.asterdex.com/zh-CN/api-management>
2. 登录后创建新的 API，记录 `API Key` 与 `Secret`
3. 仅勾选必要权限，并将值填入 `.env`

切记：不要把 `.env` 上传或分享给他人。

---

## 6. 启动程序
确保仍在项目根目录：
```bash
bun run index.ts
```
- 上下方向键选择“趋势策略”或“做市策略”
- `Enter` 启动策略，`Esc` 返回菜单
- `Ctrl + C` 结束程序

常用别名：
```bash
bun run start
bun run dev
```

---

## 7. 常见问题与排查
- **提示缺少 ASTER_API_KEY/SECRET**：`.env` 未生效。确认文件在项目根目录且变量无额外空格或中文字符。
- **签名或时间戳错误**：同步电脑时间。
  - macOS：系统设置 → 通用 → 日期与时间 → 开启自动设置
  - Windows：设置 → 时间和语言 → 日期和时间 → 开启自动同步并“立即同步”
- **网络连接失败**：检查能否访问 `https://fapi.asterdex.com` 与 `wss://fstream.asterdex.com/ws`。如需代理，先在终端设置 `HTTP_PROXY` / `HTTPS_PROXY`。
- **订单被拒绝（精度/步长）**：调整 `PRICE_TICK`、`QTY_STEP` 与交易所规则一致。
- **终端界面无反应**：请在真实终端中运行，不要在只读输出窗口执行。

更多细节请参考主仓库的 [README](README.md)。

---

## 8. 继续深入
- 高级策略说明：`legacy/docs/`
- 英文文档：`README_en.md`
- 社区支持：Telegram 群组 <https://t.me/+4fdo0quY87o4Mjhh>

祝你部署顺利，交易安全！
