# StandX 做市积分策略使用教程（超详细新手版）

本教程会 **手把手** 教你如何运行 StandX 做市积分策略。每一步都有详细说明，按顺序操作即可。

---

## 第一步：安装 Bun（运行环境）

本项目需要 Bun 才能运行。

### macOS / Linux 用户：
打开终端，复制粘贴以下命令后按回车：
```bash
curl -fsSL https://bun.sh/install | bash
```

### Windows 用户：
打开 PowerShell，复制粘贴以下命令后按回车：
```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

安装完成后，**关闭终端，重新打开一个新的终端窗口**，然后输入：
```bash
bun -v
```
如果显示版本号（如 `1.2.x`），说明安装成功。

---

## 第二步：下载项目并安装依赖

```bash
git clone https://github.com/discountry/ritmex-bot.git
cd ritmex-bot
bun install
```

---

## 第三步：获取 StandX API Token（最重要的一步）

> ⚠️ **这一步是 90% 新手卡住的地方，请仔细阅读！**
>
> ⚠️ **这一步是 90% 新手卡住的地方，请仔细阅读！**
>
> ⚠️ **这一步是 90% 新手卡住的地方，请仔细阅读！**

策略需要两样东西才能帮你下单：
1. **TOKEN**（API 令牌）
2. **代理钱包私钥**（用于签名交易）

### 获取步骤（图文说明）：

#### 3.1 打开 StandX 官方 API 创建页面

在浏览器打开这个网址：
```
https://standx.com/user/session
```

> **现在可以直接在 StandX 官网创建 API Token 了！**

#### 3.2 连接你的钱包并登录

如果还没登录，先连接钱包并登录你的 StandX 账户。

#### 3.3 生成 API Token

点击页面上的 **"Generate API Token"** 按钮。

你会看到类似这样的信息：
- **Token**（很长一串以 eyJ 开头的字符串）
- **Ed25519 Private Key**（Base58 格式的私钥，类似 `HdsyJD7oWgT756124j3taSPGv...`）
- **创建日期**（例如：2026-01-15）
- **有效期天数**（例如：30 天）

> 🔴 **请把这些值复制保存下来！**
>
> 🔴 **请把这些值复制保存下来！**
>
> 🔴 **请把这些值复制保存下来！**

### 什么是 Ed25519 Private Key？

- 这是系统 **自动为你生成** 的一个 Ed25519 签名私钥
- 它 **只用于签名交易请求**，不存放你的资金
- 你的资产仍然在你自己的钱包里，非常安全
- **你不需要手动创建**，生成 API Token 时系统会自动创建
- 格式为 Base58 编码（类似 `HdsyJD7oWgT756124j3taSPGv17vo5u7FafDq3vrun4f`）

---

## 第四步：配置环境变量

在项目根目录创建一个 `.env` 文件（如果已存在就修改它）。

### 4.1 创建/编辑 .env 文件

**macOS / Linux：**
```bash
nano .env
```

**Windows：**
用记事本打开项目文件夹，新建一个文本文件，命名为 `.env`（注意前面有个点）

### 4.2 填入以下内容

> ⚠️ **请务必把下面的示例值替换成你自己的！**
>
> ⚠️ **请务必把下面的示例值替换成你自己的！**
>
> ⚠️ **请务必把下面的示例值替换成你自己的！**

```bash
# ===== 交易所设置 =====
EXCHANGE=standx

# ===== 你的 API 凭证（第三步获取的） =====
# 把下面的 "你的TOKEN" 替换成你生成的 Token（很长一串以 eyJ 开头的）
STANDX_TOKEN=你的TOKEN

# 把下面的 "你的私钥" 替换成页面中显示的代理钱包私钥（按页面原样粘贴即可）
STANDX_REQUEST_PRIVATE_KEY=你的代理钱包私钥

# ===== 交易品种 =====
STANDX_SYMBOL=BTC-USD

# ===== 策略参数（新手直接用默认值就行） =====
MAKER_POINTS_ORDER_AMOUNT=0.01
MAKER_POINTS_CLOSE_THRESHOLD=0.1
MAKER_POINTS_STOP_LOSS_USD=0
MAKER_POINTS_MIN_REPRICE_BPS=3
MAKER_POINTS_BINANCE_DEPTH_WINDOW_BPS=3
MAKER_POINTS_BINANCE_DEPTH_IMBALANCE_RATIO=9

# ===== 挂单档位开关 =====
MAKER_POINTS_BAND_0_10=true
MAKER_POINTS_BAND_10_30=true
MAKER_POINTS_BAND_30_100=true

# ===== 挂单距离（可选，不填就用下面这些默认值） =====
# 每个档位挂在距 mark price 多远的地方（单位 bps，1 bps = 万分之一）
# MAKER_POINTS_BAND_0_10_BPS=9
# MAKER_POINTS_BAND_10_30_BPS=29
# MAKER_POINTS_BAND_30_100_BPS=40
# 最远不超过这个距离（超过 100 bps 就完全没有积分了）
# MAKER_POINTS_MAX_DISTANCE_BPS=95
# 远档位挪动订单的门槛倍数（越大越懒得动，订单活得越久）
# MAKER_POINTS_BAND_REPRICE_RATIO=0.15
# 万一挂单被吃掉，多远触发自动止损（单位 bps）
# MAKER_POINTS_SL_OFFSET_BPS=2

# ===== Token 过期时间配置（推荐配置） =====
# 填写你创建 API Token 时显示的创建日期和有效期天数
# 创建日期格式：YYYY-MM-DD（例如：2026-01-15）
STANDX_TOKEN_CREATE_DATE=2026-01-15
# 有效期天数（例如：30）
STANDX_TOKEN_VALIDITY_DAYS=30

# ===== Telegram 通知配置（可选） =====
# 配置后，策略会通过 Telegram 发送重要通知（订单成交、开仓、平仓、止损、Token过期等）
# 如何获取 Bot Token：在 Telegram 搜索 @BotFather，发送 /newbot 创建机器人，获取 Token
# 如何获取 Chat ID：在 Telegram 搜索 @userinfobot，发送任意消息即可看到你的 Chat ID
# TELEGRAM_BOT_TOKEN=你的BotToken
# TELEGRAM_CHAT_ID=你的ChatID
# TELEGRAM_ACCOUNT_LABEL=我的账户（可选，用于区分多个账户的通知）
```

### 正确填写示例

假设你生成的 API Token 信息是：
- Token: `eyJhbGciOiJFUzI1NiIsImtpZCI6IlhnaEJQSVNuN0RQVHlMcWJtLUVHVkVhOU1lMFpwdU9iMk1Qc2gtbUFlencifQ...`
- Ed25519 Private Key: `HdsyJD7oWgT756124j3taSPGv17vo5u7FafDq3vrun4f`
- 创建日期: `2026-01-15`
- 有效期: `30` 天

那么你的 `.env` 应该这样写：

```bash
EXCHANGE=standx
STANDX_TOKEN=eyJhbGciOiJFUzI1NiIsImtpZCI6IlhnaEJQSVNuN0RQVHlMcWJtLUVHVkVhOU1lMFpwdU9iMk1Qc2gtbUFlencifQ...
STANDX_REQUEST_PRIVATE_KEY=HdsyJD7oWgT756124j3taSPGv17vo5u7FafDq3vrun4f
STANDX_SYMBOL=BTC-USD
MAKER_POINTS_ORDER_AMOUNT=0.01
MAKER_POINTS_CLOSE_THRESHOLD=0.1
MAKER_POINTS_STOP_LOSS_USD=0
MAKER_POINTS_MIN_REPRICE_BPS=3
MAKER_POINTS_BINANCE_DEPTH_WINDOW_BPS=3
MAKER_POINTS_BINANCE_DEPTH_IMBALANCE_RATIO=9
MAKER_POINTS_BAND_0_10=true
MAKER_POINTS_BAND_10_30=true
MAKER_POINTS_BAND_30_100=true
STANDX_TOKEN_CREATE_DATE=2026-01-15
STANDX_TOKEN_VALIDITY_DAYS=30
# TELEGRAM_BOT_TOKEN=你的BotToken
# TELEGRAM_CHAT_ID=你的ChatID
```

> 🔴 **不要加引号！不要加空格！直接粘贴值！**
>
> 🔴 **不要加引号！不要加空格！直接粘贴值！**
>
> 🔴 **不要加引号！不要加空格！直接粘贴值！**

---

## 第五步：启动策略

### 普通启动（看实时仪表盘）
```bash
bun run index.ts --strategy maker-points --exchange standx
```

### 后台运行（推荐长期挂机）
```bash
bun run pm2:start:maker-points
```

---

## 配置参数说明

| 参数 | 含义 | 新手建议 |
|------|------|----------|
| `STANDX_TOKEN` | API 令牌 | 必填，从第三步获取 |
| `STANDX_REQUEST_PRIVATE_KEY` | 代理钱包私钥 | 必填，从第三步获取 |
| `STANDX_SYMBOL` | 交易品种 | 默认 `BTC-USD` |
| `MAKER_POINTS_ORDER_AMOUNT` | 每笔挂单数量 | 建议 `0.01` 起步 |
| `MAKER_POINTS_CLOSE_THRESHOLD` | 持仓达到多少开始平仓 | 设为 `0` 表示不自动平仓 |
| `MAKER_POINTS_STOP_LOSS_USD` | 亏损多少美元强制平仓 | 设为 `0` 表示关闭止损 |
| `MAKER_POINTS_BINANCE_DEPTH_WINDOW_BPS` | Binance 失衡检测窗口（bps） | 默认 `3` |
| `MAKER_POINTS_BINANCE_DEPTH_IMBALANCE_RATIO` | Binance 失衡比例阈值 | 默认 `9` |
| `MAKER_POINTS_BAND_*` | 三个挂单档位的开关 | 全部 `true` 即可 |
| `MAKER_POINTS_BAND_*_BPS` | 各档位挂多远（bps） | 不填，默认 `9` / `29` / `40` |
| `MAKER_POINTS_MAX_DISTANCE_BPS` | 挂单距离上限（bps） | 不填，默认 `95` |
| `MAKER_POINTS_BAND_REPRICE_RATIO` | 远档挪单门槛倍数 | 不填，默认 `0.15` |
| `MAKER_POINTS_SL_OFFSET_BPS` | 被吃后止损触发距离（bps） | 不填，默认 `2` |
| `STANDX_TOKEN_CREATE_DATE` | Token 创建日期 | 推荐配置，格式 YYYY-MM-DD |
| `STANDX_TOKEN_VALIDITY_DAYS` | Token 有效期天数 | 推荐配置，与创建日期配合使用 |
| `TELEGRAM_BOT_TOKEN` | Telegram 机器人 Token | 可选，用于接收通知 |
| `TELEGRAM_CHAT_ID` | Telegram 聊天 ID | 可选，配合 Bot Token 使用 |
| `TELEGRAM_ACCOUNT_LABEL` | Telegram 通知账户标签 | 可选，用于区分多个账户 |

### 挂单距离配置详解

> 💡 **这一整节都可以跳过。** 上面 4 个 `# 注释掉` 的参数不填就是默认值，策略照常运行，
> 默认值就是按 StandX 当前活动规则调好的。想微调再往下看。

#### 先搞懂积分是怎么算的

StandX 按你的挂单**距离 mark price 有多远**给积分倍率，越近给得越多：

| 距离 | 倍率 |
|------|------|
| 2 bps | 88% |
| 5 bps | 70% |
| 10 bps | 40% |
| 20 bps | 26.25% |
| 29 bps | 13.9% |
| 40 bps | 10.7% |
| 50 bps | 8.9% |
| 99 bps | 0.18% |
| **100 bps 以上** | **0（一分没有）** |

注意两件事：

1. **100 bps 是断崖**，超过一点就完全不得分。所以有了 `MAKER_POINTS_MAX_DISTANCE_BPS=95`，
   留 5 bps 安全边际，防止 mark price 跳动时你的单被甩出去白挂。
2. **挂得越近积分越多，但也越容易被真的成交。** 本策略的目标是只赚挂单积分、不产生真实成交，
   所以默认值是偏保守的一组，不是积分最大化的一组。

#### 三个档位默认挂多远

| 档位 | 默认距离 | 倍率 | 说明 |
|------|----------|------|------|
| `BAND_0_10` | 9 bps | 46% | 最近，积分最高，也最容易被吃 |
| `BAND_10_30` | 29 bps | 13.9% | 中距离 |
| `BAND_30_100` | 40 bps | 10.7% | 最远，最安全 |

**为什么第三档是 40 而不是贴着 99？** 因为 StandX 改成线性倍率之后，99 bps 只有 0.18% 倍率，
是 40 bps 的六十分之一——挂了等于没挂，还白占保证金。40 bps 既远离盘口又能保住 10.7%。

**想更保守**（更不容易被成交，但积分少）：把三档都往大调，例如

```bash
MAKER_POINTS_BAND_0_10_BPS=10
MAKER_POINTS_BAND_10_30_BPS=35
MAKER_POINTS_BAND_30_100_BPS=55
```

或者干脆关掉最近的一档：`MAKER_POINTS_BAND_0_10=false`。

**想更激进**（积分多，但被成交的风险明显上升）：

```bash
MAKER_POINTS_BAND_0_10_BPS=5
MAKER_POINTS_BAND_10_30_BPS=20
MAKER_POINTS_BAND_30_100_BPS=32
```

> ⚠️ 如果你把某档距离调得比 `MAKER_POINTS_MAX_DISTANCE_BPS` 还大，策略会**自动把上限提到该档位**，
> 不会把你的挂单硬拽回盘口附近。上限最高锁在 100 bps。

#### `MAKER_POINTS_BAND_REPRICE_RATIO` 是干什么的

StandX 规定**挂单要在盘口停留超过 3 秒才计分**，而且频繁撤挂会被判定刷量、剔除出奖励。
所以策略不会价格一动就重挂，而是给每个档位一个"容忍范围"，漂出去了才动：

```
容忍范围 = max(MAKER_POINTS_MIN_REPRICE_BPS, 该档距离 × MAKER_POINTS_BAND_REPRICE_RATIO)
```

按默认值（`MIN_REPRICE_BPS=3`、`RATIO=0.15`）算出来是：

| 档位 | 距离 | 容忍范围 | 实测平均存活 |
|------|------|----------|--------------|
| 0-10 | 9 bps | ±3 bps | 约 8 秒 |
| 10-30 | 29 bps | ±4.35 bps | 约 16 秒 |
| 30-100 | 40 bps | ±6 bps | 约 28 秒 |

远的档位挪得更少，因为价格小幅波动对它影响本来就小。三档平均存活都远超 3 秒门槛。

**调大 ratio**（例如 `0.25`）→ 订单更少被挪动、更容易跨过 3 秒门槛，但挂单距离会偏离目标更多。
**调小 ratio**（例如 `0.08`）→ 距离更精准，但撤挂更频繁，有跌破 3 秒门槛的风险。**不建议低于 0.1。**

> 无论容忍范围设多大，出现这三种情况都会**立刻撤单**，不受影响：挂单穿到了 mark price 另一侧、
> 挂单掉出积分范围、目标价前方的盘口深度不够。插针行情下撤单永远畅通。

#### `MAKER_POINTS_SL_OFFSET_BPS` 是干什么的

万一挂单还是被成交了，策略会给它附带一个止损单立刻平掉，避免留下仓位。
这个参数控制止损触发价离成交价多远，默认 `2` bps。

设成 `0` 表示不附带止损（不推荐，除非你自己有别的风控）。

---

### Token 过期时间配置详解

`STANDX_TOKEN_CREATE_DATE` 和 `STANDX_TOKEN_VALIDITY_DAYS` 用于设置 Token 的过期时间。配置后，策略会：

1. **Token 过期前 1 小时**：在日志中提醒你 Token 即将过期
2. **Token 过期后**：
   - 如果有持仓：进入**平仓模式**，只允许平仓和止损，不再开新仓
   - 如果无持仓但有挂单：**自动取消所有挂单**
   - 如果无持仓无挂单：进入**静默模式**，只接收数据，不下单

**推荐配置方式（创建日期 + 有效期天数）：**

在 StandX 官网生成 API Token 时，页面会显示创建日期和有效期天数，直接填入即可：

```bash
# 创建日期（格式：YYYY-MM-DD）
STANDX_TOKEN_CREATE_DATE=2026-01-15
# 有效期天数
STANDX_TOKEN_VALIDITY_DAYS=30
```

**示例计算：**
- 创建日期：2026-01-15
- 有效期：30 天
- 过期时间：2025-02-14 00:00:00 UTC

**兼容旧版配置（直接指定过期时间戳）：**

如果你之前使用的是 `STANDX_TOKEN_EXPIRY`，仍然可以继续使用：

```bash
# 方式1：使用时间戳（秒）
STANDX_TOKEN_EXPIRY=1735689600

# 方式2：使用 ISO 日期字符串
STANDX_TOKEN_EXPIRY=2025-01-01T00:00:00Z
```

> 💡 **提示**：推荐使用新的创建日期 + 有效期天数方式，更直观易懂。

### Telegram 通知配置详解

配置 Telegram 通知后，策略会在以下情况发送通知：

- 📝 **订单成交**：挂单被成交时
- 📈 **开仓**：持仓从 0 变为非 0 时
- 📉 **平仓**：持仓从非 0 变为 0 时
- 🛑 **止损触发**：触发止损平仓时
- ⏰ **Token 过期**：Token 过期时

**配置步骤：**

1. **创建 Telegram 机器人**：
   - 在 Telegram 搜索 `@BotFather`
   - 发送 `/newbot` 命令
   - 按提示设置机器人名称和用户名
   - 获取 Bot Token（格式类似：`123456789:ABCdefGHIjklMNOpqrsTUVwxyz`）

2. **获取你的 Chat ID**：
   - 在 Telegram 搜索 `@userinfobot`
   - 发送任意消息
   - 机器人会返回你的 Chat ID（一串数字，例如：`123456789`）

3. **配置环境变量**：
   ```bash
   TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
   TELEGRAM_CHAT_ID=123456789
   TELEGRAM_ACCOUNT_LABEL=我的账户（可选）
   ```

4. **测试通知**：
   - 启动策略后，如果配置正确，会在 Token 过期或重要事件时收到通知
   - 如果收不到通知，检查 Bot Token 和 Chat ID 是否正确

> 💡 **提示**：`TELEGRAM_ACCOUNT_LABEL` 是可选的，如果你有多个账户在运行策略，可以用这个标签区分不同账户的通知。

---

## 常见问题

### Q：报错说 Token 无效怎么办？

重新去 https://standx.com/user/session 生成新的 API Token。Token 可能过期了。

### Q：Ed25519 Private Key 从哪来的？

在 StandX 官网（https://standx.com/user/session）点击 "Generate API Token" 按钮时会显示。
私钥格式为 Base58 编码（类似 `HdsyJD7oWgT756124j3taSPGv17vo5u7FafDq3vrun4f`）。
**你不需要自己创建，系统会自动生成！**
**你不需要自己创建，系统会自动生成！**
**你不需要自己创建，系统会自动生成！**

### Q：.env 文件放在哪？

放在项目根目录，就是 `ritmex-bot` 文件夹里，和 `package.json` 同一个目录。

### Q：为什么策略没有下单？

1. 检查账户里有没有足够的保证金
2. 检查 TOKEN 和私钥是否正确填写
3. 检查 .env 文件是否保存成功

### Q：我升级了代码，需要改 .env 吗？

**不需要。** 新增的 `MAKER_POINTS_BAND_*_BPS`、`MAKER_POINTS_MAX_DISTANCE_BPS`、
`MAKER_POINTS_BAND_REPRICE_RATIO`、`MAKER_POINTS_SL_OFFSET_BPS` 全部有默认值，
不填就按默认值跑。老的 `.env` 直接用就行。

### Q：仪表盘上挂单的 `Rest` 那一列是什么？

是这张挂单已经在盘口停留了多少秒。StandX 只对**停留超过 3 秒**的挂单计分，
所以数字前面带 `!` 的（不足 3 秒）暂时还不产生积分。正常运行时大部分单会稳定在十几秒以上。

### Q：档位那几行显示的 `×10.71%` 是什么意思？

是这个档位当前挂单对应的**积分倍率**。旁边的 `38.9bps` 是实际距离 mark price 多远。
如果倍率显示 `0.00%`，说明挂单已经跑到 100 bps 之外了，这时候是白挂——检查一下你的档位距离配置。

### Q：担心平掉我手动开的仓位？

把 `MAKER_POINTS_CLOSE_THRESHOLD` 设为 `0` 或者设置成一个比你持仓大的数字。

### Q：如何知道 Token 什么时候过期？

配置 `STANDX_TOKEN_CREATE_DATE`（创建日期）和 `STANDX_TOKEN_VALIDITY_DAYS`（有效期天数），策略会在 Token 过期前 1 小时提醒你。这两个值在生成 API Token 时会显示。Token 过期后，如果有持仓会进入平仓模式，只允许平仓和止损。

### Q：Telegram 通知收不到怎么办？

1. 检查 `TELEGRAM_BOT_TOKEN` 和 `TELEGRAM_CHAT_ID` 是否正确填写
2. 确保没有在 Bot Token 和 Chat ID 前后加引号或空格
3. 在 Telegram 中先给机器人发送一条消息（任意内容），然后再启动策略
4. 检查网络连接是否正常

---

## 安全提示

1. **绝对不要把 TOKEN 和私钥分享给任何人！**
2. **绝对不要把 TOKEN 和私钥分享给任何人！**
3. **绝对不要把 TOKEN 和私钥分享给任何人！**

代理钱包只用于签名，你的资产始终在你自己的主钱包里。但如果泄露了 TOKEN，别人可以用你的账户交易。

---

## 还是不会？

把你的报错信息截图发到 Telegram 群里，会有人帮你：

Telegram 群：https://t.me/+4fdo0quY87o4Mjhh
