# 简明上手指南（给零基础小白）

这份文档一步一步教你在 Windows 或 macOS 本地把项目跑起来：从下载代码、安装工具、配置环境变量（.env）、获取 Aster API，到运行项目。每一步都尽量写得很直白。

---

## 1. 下载代码（两种方式）## 7. 运行项目（命令）
确保你已在项目根目录，并且 `.env` 已配置好：

```bash
# 使用 Bun（Windows 10 1809+ 或 macOS/Linux）
bun install       # 第一次运行需要安装依赖
bun run index.ts  # 启动程序

# 或使用 Node.js（适用于较旧的 Windows 版本）
npm install       # 第一次运行需要安装依赖
npm install -D tsx # 安装 TypeScript 支持
npm run start     # 启动程序
```

启动后，终端里会出现一个交互界面：
- 使用键盘 ↑ / ↓ 选择"趋势策略"或"做市策略"，回车启动。
- 按 `Esc` 返回菜单。
- 按 `Ctrl + C` 退出程序。

如果你更喜欢用脚本，也可以：
```bash
# 使用 Bun
bun run start
# 或
bun run dev

# 使用 Node.js
npm run start
# 或
npm run dev
```）
  1) 安装 Git：
     - Windows：到 `https://git-scm.com/download/win` 下载并安装，一路“下一步”。
     - macOS：打开“终端”（Terminal），输入 `git --version` 看是否已自带。如果提示未安装，会引导你安装 Xcode Command Line Tools，按提示安装即可。
  2) 打开命令行：
     - Windows：开始菜单搜索“PowerShell”或“Windows Terminal”→ 打开。
     - macOS：按 `⌘ + 空格` 搜索“Terminal”→ 打开。
  3) 在命令行输入（会把代码下载到当前目录下的 ritmex-bot 文件夹）：
     ```bash
     git clone https://github.com/discountry/ritmex-bot.git
     ```

- 方式 B：不用 Git，直接下压缩包
  1) 打开项目页面：`https://github.com/discountry/ritmex-bot`
  2) 点绿色的 `Code` 按钮 → `Download ZIP`
  3) 下载后解压到一个好找的位置，例如：
     - Windows：`C:\Users\你的用户名\Desktop\ritmex-bot`
     - macOS：`~/Desktop/ritmex-bot`

---

## 2. 安装 VS Code（代码编辑器）
- 下载地址：`https://code.visualstudio.com/`
- Windows/macOS 都可以一路“下一步”安装。
- 安装完成后，打开 VS Code，点“文件 → 打开文件夹（Open Folder）”，选中你刚下载/解压的 `ritmex-bot` 文件夹。

---

## 3. 安装 Bun（运行环境）
项目使用 Bun 作为运行环境（类似 Node.js，但更快，命令更简单）。

- macOS / Linux：在“终端”输入：
  ```bash
  curl -fsSL https://bun.sh/install | bash
  ```
  安装后请关闭并重新打开终端，再输入 `bun -v`，能看到版本号就说明成功。

- Windows（PowerShell）：
  ```powershell
  powershell -c "irm bun.sh/install.ps1 | iex"
  ```
  安装后关闭并重新打开 PowerShell，输入 `bun -v` 出现版本号即成功。

- **如果出现 Windows 版本兼容性警告**：
  - Bun 需要 Windows 10 1809 或更新版本
  - 如果你的系统版本较旧，建议使用 Node.js + npm 作为替代方案：
    1. 下载并安装 Node.js：`https://nodejs.org/en/download`
    2. 安装完成后，使用 npm 全局安装 bun：
       ```powershell
       npm install -g bun
       ```
    3. 或者直接使用 Node.js 运行项目：
       ```powershell
       npm install    # 安装依赖
       npm run start  # 启动项目
       ```

- 如果上述办法都不行，去 Bun 官网查看其他方式：`https://bun.com/get`

- 首次进入项目目录后，安装依赖：
  ```bash
  # 如果使用 Bun（Windows 10 1809+ 或 macOS/Linux）
  bun install
  
  # 如果使用 Node.js（适用于较旧的 Windows 版本）
  npm install
  npm install -D tsx  # 额外安装 TypeScript 支持
  ```

---

## 4. 找到项目目录，并在命令行跳转过去
- 你需要知道 `ritmex-bot` 文件夹具体在哪。
  - Windows 常见路径：`C:\Users\你的用户名\Desktop\ritmex-bot`
  - macOS 常见路径：`~/Desktop/ritmex-bot`
- 命令行使用 `cd` 跳转：
  ```bash
  # macOS 示例
  cd ~/Desktop/ritmex-bot

  # Windows 示例（注意替换“你的用户名”）
  cd C:\Users\你的用户名\Desktop\ritmex-bot
  ```
- 成功进入后，输入 `ls`（macOS）或 `dir`（Windows）应能看到 `package.json`、`index.ts` 等文件。

---

## 5. 配置环境变量（.env 文件）
项目运行需要你的 Aster API 密钥，以及一些策略参数。Bun 会自动读取根目录的 `.env` 文件。

1) 在项目根目录创建 `.env` 文件（如果没有的话）。可以先复制下面这份最小示例：
   ```bash
   # 复制以下内容到 .env（用记事本/VS Code 打开也可以）
   ASTER_API_KEY=在这里填你的Key
   ASTER_API_SECRET=在这里填你的Secret

   # 可选参数（都有默认值，不填也能跑）
   TRADE_SYMBOL=BTCUSDT
   TRADE_AMOUNT=0.001
   LOSS_LIMIT=0.03
   TRAILING_PROFIT=0.2
   TRAILING_CALLBACK_RATE=0.2
   PROFIT_LOCK_TRIGGER_USD=0.1
   PROFIT_LOCK_OFFSET_USD=0.05
   PRICE_TICK=0.1
   QTY_STEP=0.001
   ```

2) 在 Windows 下怎么编辑 `.env`？
   - 方法 A：在 VS Code 左侧资源管理器里右键新建文件，命名为 `.env`，然后把上面的内容粘贴进去保存。
   - 方法 B：在资源管理器勾选“查看 → 显示文件扩展名”，然后新建文本文件，重命名为 `.env`（注意不要叫 `.env.txt`）。用记事本或 VS Code 打开，把内容粘贴进去保存。

3) 这些变量的作用（知道大概即可）：
   - `ASTER_API_KEY` / `ASTER_API_SECRET`：你在 Aster 交易所申请的 API 凭证（必填）。
   - `TRADE_SYMBOL`：交易对，默认 `BTCUSDT`。
   - `TRADE_AMOUNT`：每次下单的数量。
   - `LOSS_LIMIT`：每笔最大允许亏损（美元计）。
   - `TRAILING_PROFIT` / `TRAILING_CALLBACK_RATE`：移动止盈的触发值与回撤百分比。
   - `PROFIT_LOCK_*`：达到一定浮盈后，自动把基础止损往有利方向移动的参数。
   - `PRICE_TICK` / `QTY_STEP`：该交易对的最小价格变动单位和最小下单步长。

> 进阶：做市策略还有一些 `MAKER_*` 参数（如 `MAKER_PRICE_CHASE`、`MAKER_REFRESH_INTERVAL_MS` 等），需要时可在 `src/config.ts` 查到名称并按需加到 `.env` 重写默认值。

---

## 6. 去哪里获取 Aster 的 API Key/Secret？
- 打开 Aster 的 API 管理页面：`https://www.asterdex.com/zh-CN/api-management`
- 登录后创建新的 API，记录下 `API Key` 和 `Secret` 并填入 `.env`。
- 权限仅勾选你需要的，谨慎保管。不要把 `.env` 上传到任何地方。

---

## 7. 运行项目（命令）
确保你已在项目根目录，并且 `.env` 已配置好：

```bash
bun install       # 第一次运行需要安装依赖
bun run index.ts  # 启动程序（等同于 npm run start，但我们用 Bun）
```

启动后，终端里会出现一个交互界面：
- 使用键盘 ↑ / ↓ 选择“趋势策略”或“做市策略”，回车启动。
- 按 `Esc` 返回菜单。
- 按 `Ctrl + C` 退出程序。

如果你更喜欢用脚本，也可以：
```bash
bun run start
# 或
bun run dev
```

---

## 8. 常见问题（简单排查）
- 运行时报错“缺少 ASTER_API_KEY/SECRET”：说明 `.env` 没正确配置或没被读取。确认 `.env` 在项目根目录，变量名拼写无误。
- 终端显示连不上：检查你的网络是否能访问 `wss://fstream.asterdex.com/ws` 和 `https://fapi.asterdex.com`。
- 显示权限错误/下单失败：到 Aster 后台检查 API 权限，确认已开启合约交易相关权限。
- 界面卡着没反应：请在“真”终端里运行（Windows Terminal、PowerShell、macOS Terminal），不要在只读的输出窗口里运行。

- API 填写错误（Key/Secret 格式问题）：
   - 确认 `.env` 中没有多余空格、引号或换行。示例：
     ```bash
     ASTER_API_KEY=你的Key
     ASTER_API_SECRET=你的Secret
     ```
   - 避免中文标点或全角字符；从网页复制后，先粘到纯文本再粘回。
   - 修改 `.env` 后，重新打开终端或重新运行命令以生效。

- 本地时间与交易所时间不同步（签名/时间戳错误）：
   - 现象：HTTP 4xx 提示 `timestamp expired` / `invalid signature`。
   - macOS：系统设置 → 通用 → 日期与时间 → 开启“自动设置日期与时间”。
   - Windows：设置 → 时间和语言 → 日期和时间 → 开启“自动设置时间”，并点击“立即同步”。
   - 命令行快速同步（可选）：
     - macOS：
       ```bash
       sudo sntp -sS time.apple.com
       ```
     - Windows（管理员 PowerShell）：
       ```powershell
       w32tm /resync
       ```
     - Linux：
       ```bash
       sudo timedatectl set-ntp true
       ```

- 无法访问外网/需要代理：
   - 现象：`curl https://bun.sh` 超时、连接 `fapi.asterdex.com` / `fstream.asterdex.com` 失败。
   - 临时为当前终端配置代理（按本地代理端口调整 7890/1080 等）：
     - macOS / Linux：
       ```bash
       export HTTP_PROXY=http://127.0.0.1:7890
       export HTTPS_PROXY=http://127.0.0.1:7890
       ```
     - Windows PowerShell：
       ```powershell
       $env:HTTP_PROXY="http://127.0.0.1:7890"
       $env:HTTPS_PROXY="http://127.0.0.1:7890"
       ```
   - 验证连通性：
     ```bash
     curl -I https://fapi.asterdex.com
     ```
   - 公司/校园网络可能屏蔽 WebSocket（wss://）；必要时切换到个人网络或 VPN。

- 下单精度/步长或交易对不匹配：
   - 现象：下单被拒，提示精度/步长错误。
   - 处理：在 `.env` 中调整 `TRADE_SYMBOL`、`PRICE_TICK`、`QTY_STEP` 与交易所规则一致。
---

## 9. 风险提示

量化策略并非稳赚不赔。请从小额开始，先在仿真或小资金环境验证，逐步加大。务必妥善保管 API 密钥，并只开启必要权限。
