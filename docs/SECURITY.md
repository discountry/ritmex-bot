# 安全指南

## 概览

ritmex-bot 处理敏感的交易信息和 API 密钥，因此安全性至关重要。本指南涵盖了保护你的交易机器人和资金的最佳实践。

## 🔐 API 密钥安全

### 1. 密钥生成最佳实践

#### 权限最小化原则
为 ritmex-bot 创建专用的 API 密钥，只授予必要的权限：

**推荐权限**：
- ✅ 读取账户信息
- ✅ 读取订单信息  
- ✅ 读取持仓信息
- ✅ 创建订单
- ✅ 取消订单
- ❌ 提现权限
- ❌ 转账权限
- ❌ API 管理权限

#### IP 白名单设置
在支持的交易所中启用 IP 白名单：

```bash
# 获取服务器公网 IP
curl ifconfig.me

# 在交易所后台添加到 API 密钥的 IP 白名单中
```

### 2. 密钥存储

#### 环境变量存储
```bash
# 正确方式：使用 .env 文件
ASTER_API_KEY=your_api_key_here
ASTER_API_SECRET=your_api_secret_here

# 错误方式：直接写入代码
const apiKey = "your_api_key_here"; // 🚫 绝对不要这样做
```

#### 文件权限设置
```bash
# 设置 .env 文件权限，仅所有者可读写
chmod 600 .env

# 验证权限
ls -la .env
# 应显示：-rw------- 1 user user
```

#### 版本控制排除
```bash
# 确保 .env 文件不被提交到 Git
echo ".env" >> .gitignore
echo ".env.*" >> .gitignore

# 检查是否已被 Git 跟踪
git status --ignored
```

### 3. 密钥轮换

#### 定期更换策略
```bash
# 建议每 30-90 天更换一次 API 密钥
# 创建轮换提醒脚本

cat > scripts/key-rotation-reminder.sh << 'EOF'
#!/bin/bash

LAST_ROTATION_FILE=".last_key_rotation"
ROTATION_INTERVAL_DAYS=30

if [ -f "$LAST_ROTATION_FILE" ]; then
    LAST_ROTATION=$(cat $LAST_ROTATION_FILE)
    DAYS_SINCE=$(( ($(date +%s) - $LAST_ROTATION) / 86400 ))
    
    if [ $DAYS_SINCE -ge $ROTATION_INTERVAL_DAYS ]; then
        echo "⚠️  API 密钥需要轮换！距离上次轮换已过 $DAYS_SINCE 天"
        echo "请访问交易所后台更新 API 密钥"
    else
        echo "✅ API 密钥状态良好，距下次轮换还有 $(($ROTATION_INTERVAL_DAYS - $DAYS_SINCE)) 天"
    fi
else
    echo $(date +%s) > $LAST_ROTATION_FILE
    echo "📝 已记录首次密钥设置时间"
fi
EOF

chmod +x scripts/key-rotation-reminder.sh
```

#### 轮换流程
1. 在交易所生成新的 API 密钥
2. 更新 `.env` 文件
3. 重启 ritmex-bot
4. 删除旧的 API 密钥
5. 记录轮换时间：`echo $(date +%s) > .last_key_rotation`

## 🌐 网络安全

### 1. 传输层安全

#### HTTPS/WSS 验证
```typescript
// 确保所有 API 调用使用 HTTPS
const apiUrl = 'https://api.exchange.com'; // ✅ 使用 HTTPS
const wsUrl = 'wss://ws.exchange.com';    // ✅ 使用 WSS

// 避免不安全的连接
const badUrl = 'http://api.exchange.com'; // 🚫 不安全
```

#### 证书验证
```typescript
// 在生产环境中启用严格的 SSL 验证
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';

// 仅在开发环境中禁用（不推荐）
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}
```

### 2. 防火墙配置

#### UFW 防火墙 (Ubuntu)
```bash
# 启用防火墙
sudo ufw enable

# 允许 SSH (如果需要远程访问)
sudo ufw allow ssh

# 允许 HTTPS 出站连接
sudo ufw allow out 443

# 拒绝不必要的入站连接
sudo ufw default deny incoming
sudo ufw default allow outgoing

# 查看规则
sudo ufw status verbose
```

#### iptables 防火墙
```bash
# 创建防火墙脚本
cat > scripts/setup-firewall.sh << 'EOF'
#!/bin/bash

# 清空现有规则
iptables -F
iptables -X
iptables -t nat -F
iptables -t nat -X

# 设置默认策略
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# 允许本地回环
iptables -A INPUT -i lo -j ACCEPT

# 允许已建立的连接
iptables -A INPUT -m state --state RELATED,ESTABLISHED -j ACCEPT

# 允许 SSH (根据需要调整端口)
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# 允许 HTTPS 出站
iptables -A OUTPUT -p tcp --dport 443 -j ACCEPT

# 保存规则
iptables-save > /etc/iptables/rules.v4

echo "防火墙配置完成"
EOF

chmod +x scripts/setup-firewall.sh
sudo ./scripts/setup-firewall.sh
```

### 3. VPN 和代理

#### 使用 VPN 保护
```bash
# 如果使用 VPN，确保所有流量都通过 VPN
# 检查 IP 地址
curl ifconfig.me

# 检查 DNS 泄露
nslookup api.binance.com
```

#### 代理配置 (可选)
```bash
# 设置 HTTP 代理
export HTTP_PROXY=http://proxy-server:port
export HTTPS_PROXY=https://proxy-server:port

# 在 .env 中配置代理
HTTP_PROXY=http://proxy-server:port
HTTPS_PROXY=https://proxy-server:port
```

## 💰 资金安全

### 1. 账户隔离

#### 专用交易账户
- 为量化交易创建专门的子账户
- 只在交易账户中保留必要资金
- 定期将盈利转移到主账户

#### 资金限额设置
```bash
# 在 .env 中设置严格的风险限制
LOSS_LIMIT=0.02                    # 单笔最大亏损 2%
MAX_POSITION_SIZE=0.001            # 最大持仓限制
DAILY_LOSS_LIMIT=0.05              # 日亏损限制 5%
```

### 2. 风险控制

#### 止损设置
```typescript
// 确保所有策略都有止损保护
interface RiskConfig {
  maxLossPerTrade: number;      // 单笔最大亏损
  maxDailyLoss: number;         // 日最大亏损
  maxDrawdown: number;          // 最大回撤
  stopTradingThreshold: number; // 停止交易阈值
}

const riskConfig: RiskConfig = {
  maxLossPerTrade: 0.02,
  maxDailyLoss: 0.05,
  maxDrawdown: 0.10,
  stopTradingThreshold: 0.15,
};
```

#### 实时监控
```bash
# 创建资金监控脚本
cat > scripts/fund-monitor.sh << 'EOF'
#!/bin/bash

BALANCE_LOG="logs/balance.log"
ALERT_THRESHOLD=0.05  # 5% 亏损告警

# 获取当前余额 (需要根据实际 API 调整)
CURRENT_BALANCE=$(bun run scripts/get-balance.ts)

# 记录余额
echo "$(date): $CURRENT_BALANCE" >> $BALANCE_LOG

# 检查是否触发告警
if [ -f ".initial_balance" ]; then
    INITIAL_BALANCE=$(cat .initial_balance)
    LOSS_PCT=$(echo "scale=4; ($INITIAL_BALANCE - $CURRENT_BALANCE) / $INITIAL_BALANCE" | bc)
    
    if (( $(echo "$LOSS_PCT > $ALERT_THRESHOLD" | bc -l) )); then
        echo "🚨 ALERT: 资金亏损超过 ${ALERT_THRESHOLD}%"
        # 发送告警邮件或通知
        echo "Current: $CURRENT_BALANCE, Initial: $INITIAL_BALANCE, Loss: $LOSS_PCT" | \
            mail -s "Trading Alert: High Loss" admin@example.com
    fi
else
    echo $CURRENT_BALANCE > .initial_balance
fi
EOF

chmod +x scripts/fund-monitor.sh
```

## 🖥️ 系统安全

### 1. 服务器安全

#### 操作系统加固
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 配置自动安全更新
sudo apt install unattended-upgrades
sudo dpkg-reconfigure unattended-upgrades

# 禁用不必要的服务
sudo systemctl disable bluetooth
sudo systemctl disable cups

# 配置 SSH 安全
sudo nano /etc/ssh/sshd_config
# 修改以下设置：
# Port 2222                    # 更改默认端口
# PermitRootLogin no           # 禁止 root 登录
# PasswordAuthentication no    # 禁用密码认证
# PubkeyAuthentication yes     # 启用密钥认证
```

#### 用户权限管理
```bash
# 创建专用用户运行 bot
sudo useradd -m -s /bin/bash ritmex
sudo usermod -aG sudo ritmex

# 设置 SSH 密钥认证
sudo -u ritmex ssh-keygen -t rsa -b 4096
sudo -u ritmex mkdir ~/.ssh
sudo -u ritmex chmod 700 ~/.ssh

# 复制公钥到服务器 (在本地执行)
ssh-copy-id ritmex@server-ip
```

### 2. 进程安全

#### 进程隔离
```bash
# 使用 systemd 服务运行 bot
sudo cat > /etc/systemd/system/ritmex-bot.service << 'EOF'
[Unit]
Description=Ritmex Trading Bot
After=network.target

[Service]
Type=simple
User=ritmex
Group=ritmex
WorkingDirectory=/home/ritmex/ritmex-bot
ExecStart=/home/ritmex/.bun/bin/bun run index.ts --strategy trend --silent
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

# 安全选项
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/home/ritmex/ritmex-bot

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable ritmex-bot
sudo systemctl start ritmex-bot
```

#### 资源限制
```bash
# 限制进程资源使用
sudo cat > /etc/security/limits.d/ritmex.conf << 'EOF'
ritmex soft nproc 1024
ritmex hard nproc 2048
ritmex soft nofile 4096
ritmex hard nofile 8192
ritmex soft memlock 256
ritmex hard memlock 512
EOF
```

## 📊 监控和审计

### 1. 日志安全

#### 敏感信息过滤
```typescript
// 确保日志中不包含敏感信息
class SecureLogger {
  private sanitize(message: string): string {
    // 移除 API 密钥
    const apiKeyPattern = /[A-Za-z0-9]{32,64}/g;
    message = message.replace(apiKeyPattern, '[REDACTED]');
    
    // 移除私钥
    const privateKeyPattern = /0x[a-fA-F0-9]{64}/g;
    message = message.replace(privateKeyPattern, '0x[REDACTED]');
    
    return message;
  }

  log(level: string, message: string, data?: any): void {
    const sanitizedMessage = this.sanitize(message);
    const sanitizedData = data ? this.sanitize(JSON.stringify(data)) : '';
    
    console.log(`[${level}] ${sanitizedMessage} ${sanitizedData}`);
  }
}
```

#### 日志权限
```bash
# 设置日志文件权限
chmod 640 logs/*.log
chown ritmex:ritmex logs/*.log

# 配置 logrotate 安全删除
sudo cat > /etc/logrotate.d/ritmex-bot << 'EOF'
/home/ritmex/ritmex-bot/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    copytruncate
    su ritmex ritmex
    shred
}
EOF
```

### 2. 异常监控

#### 安全事件告警
```typescript
// 创建安全监控模块
class SecurityMonitor {
  private alertHandlers: Array<(event: SecurityEvent) => void> = [];

  checkForSuspiciousActivity(): void {
    // 检查异常登录
    this.checkFailedLogins();
    
    // 检查异常订单
    this.checkAbnormalOrders();
    
    // 检查资金异动
    this.checkUnusualTransfers();
  }

  private checkFailedLogins(): void {
    // 实现登录失败检测逻辑
  }

  private checkAbnormalOrders(): void {
    // 检测异常订单模式
    const recentOrders = this.getRecentOrders();
    
    for (const order of recentOrders) {
      if (this.isAbnormalOrder(order)) {
        this.triggerAlert({
          type: 'abnormal_order',
          details: `Unusual order detected: ${order.id}`,
          severity: 'high',
          timestamp: Date.now(),
        });
      }
    }
  }

  private triggerAlert(event: SecurityEvent): void {
    this.alertHandlers.forEach(handler => handler(event));
  }
}
```

### 3. 审计跟踪

#### 操作记录
```typescript
// 审计日志记录
class AuditLogger {
  logAction(action: string, details: any): void {
    const auditEvent = {
      timestamp: new Date().toISOString(),
      action,
      details,
      user: process.env.USER || 'unknown',
      pid: process.pid,
      sessionId: this.getSessionId(),
    };

    // 写入审计日志
    this.writeAuditLog(auditEvent);
  }

  private writeAuditLog(event: any): void {
    const logEntry = JSON.stringify(event) + '\n';
    require('fs').appendFileSync('logs/audit.log', logEntry);
  }
}

// 使用示例
const auditLogger = new AuditLogger();

// 记录订单创建
auditLogger.logAction('ORDER_CREATED', {
  symbol: 'BTCUSDT',
  side: 'buy',
  amount: 0.001,
  price: 45000,
});

// 记录配置变更
auditLogger.logAction('CONFIG_CHANGED', {
  parameter: 'LOSS_LIMIT',
  oldValue: 0.03,
  newValue: 0.02,
});
```

## 🚨 应急响应

### 1. 安全事件处理

#### 密钥泄露处理
```bash
# 创建应急响应脚本
cat > scripts/emergency-response.sh << 'EOF'
#!/bin/bash

echo "🚨 安全事件应急响应"
echo "1. 立即停止所有交易机器人"

# 停止所有相关进程
pkill -f "ritmex"
pm2 stop all

echo "2. 撤销所有开放订单"
# 使用紧急撤单脚本
bun run scripts/emergency-cancel-all.ts

echo "3. 禁用 API 密钥"
echo "请立即前往以下交易所禁用 API 密钥："
echo "- Aster: https://www.asterdex.com/api-management"
echo "- GRVT: https://grvt.io/exchange/account/api-keys"
echo "- 其他配置的交易所..."

echo "4. 生成事件报告"
cat > incident-report-$(date +%Y%m%d_%H%M%S).txt << 'REPORT'
安全事件报告
================
发生时间: $(date)
检测到的问题: [请手动填写]
影响范围: [请评估]
采取的行动: 
- 停止交易机器人
- 撤销所有订单
- 禁用 API 密钥

后续行动:
- [ ] 更换所有 API 密钥
- [ ] 检查账户余额
- [ ] 分析日志文件
- [ ] 更新安全措施
REPORT

echo "✅ 应急响应完成，请查看生成的事件报告"
EOF

chmod +x scripts/emergency-response.sh
```

#### 紧急撤单脚本
```typescript
// scripts/emergency-cancel-all.ts
import { createAdapter } from '../src/exchanges/create-adapter';

async function emergencyCancelAll() {
  try {
    console.log('🚨 执行紧急撤单...');
    
    const adapter = await createAdapter();
    await adapter.connect();
    
    // 获取所有开放订单
    const openOrders = await adapter.getOpenOrders();
    console.log(`发现 ${openOrders.length} 个开放订单`);
    
    // 批量撤销
    for (const order of openOrders) {
      try {
        await adapter.cancelOrder(order.id);
        console.log(`✅ 已撤销订单: ${order.id}`);
      } catch (error) {
        console.error(`❌ 撤销订单失败 ${order.id}:`, error.message);
      }
    }
    
    console.log('🔒 紧急撤单完成');
  } catch (error) {
    console.error('❌ 紧急撤单失败:', error);
  }
}

emergencyCancelAll();
```

### 2. 数据恢复

#### 备份策略
```bash
# 创建自动备份脚本
cat > scripts/backup-security.sh << 'EOF'
#!/bin/bash

BACKUP_DIR="security-backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

# 备份配置文件 (移除敏感信息)
cat .env | sed 's/=.*/=[REDACTED]/' > $BACKUP_DIR/env-template
cp package.json $BACKUP_DIR/
cp ecosystem.config.js $BACKUP_DIR/ 2>/dev/null

# 备份日志文件
cp -r logs $BACKUP_DIR/ 2>/dev/null

# 备份安全配置
cp scripts/setup-firewall.sh $BACKUP_DIR/ 2>/dev/null

# 创建系统信息快照
uname -a > $BACKUP_DIR/system-info.txt
ps aux | grep ritmex > $BACKUP_DIR/processes.txt
netstat -tulpn > $BACKUP_DIR/network-connections.txt

# 压缩备份
tar -czf $BACKUP_DIR.tar.gz $BACKUP_DIR
rm -rf $BACKUP_DIR

echo "安全备份完成: $BACKUP_DIR.tar.gz"
EOF

chmod +x scripts/backup-security.sh
```

## 📋 安全检查清单

### 部署前检查
- [ ] API 密钥权限已最小化
- [ ] IP 白名单已配置
- [ ] .env 文件权限正确 (600)
- [ ] .env 已添加到 .gitignore
- [ ] 防火墙规则已配置
- [ ] SSL/TLS 证书验证已启用
- [ ] 日志不包含敏感信息
- [ ] 风险限制参数已设置

### 运行时检查
- [ ] 监控脚本正常运行
- [ ] 日志文件定期轮转
- [ ] 系统资源使用正常
- [ ] 网络连接安全
- [ ] 账户余额在预期范围内
- [ ] 异常告警机制工作正常

### 定期维护
- [ ] API 密钥定期轮换 (30-90 天)
- [ ] 系统安全更新
- [ ] 日志文件清理
- [ ] 备份文件验证
- [ ] 安全策略审查
- [ ] 应急响应流程测试

## 🆘 联系和支持

### 安全问题报告
如果发现安全漏洞，请通过以下方式私下报告：
- 邮箱: security@ritmex-bot.example.com
- Telegram: @security_ritmex
- 加密通信: 使用项目公钥加密

### 紧急联系
- 项目维护者: [GitHub 用户名]
- 社区支持: [Telegram 群组]
- 技术支持: [邮箱地址]

---

**⚠️ 重要提醒**: 
- 量化交易具有风险，请谨慎操作
- 定期检查和更新安全措施
- 始终使用最新版本的软件
- 不要在公共网络或不受信任的环境中运行