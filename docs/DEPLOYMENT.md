# 部署指南

## 概览

本指南详细介绍如何在不同环境中部署 ritmex-bot，包括开发环境、测试环境和生产环境的配置。

## 系统要求

### 最低要求
- **操作系统**: macOS 10.15+, Ubuntu 18.04+, Windows 10+ (推荐 WSL2)
- **内存**: 最少 2GB RAM，推荐 4GB+
- **存储**: 最少 1GB 可用空间
- **网络**: 稳定的互联网连接，延迟 < 100ms

### 推荐配置
- **CPU**: 2+ 核心
- **内存**: 8GB+ RAM
- **存储**: SSD 硬盘
- **网络**: 专线或高质量宽带

## 环境准备

### 1. 安装 Bun

#### macOS / Linux
```bash
curl -fsSL https://bun.sh/install | bash
```

#### Windows (PowerShell)
```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

#### 验证安装
```bash
bun --version
# 应显示 1.2.0 或更高版本
```

### 2. 安装 Git (可选)
```bash
# Ubuntu/Debian
sudo apt-get install git

# macOS (如果未安装 Xcode Command Line Tools)
xcode-select --install

# Windows
# 从 https://git-scm.com/download/win 下载安装
```

### 3. 配置防火墙
确保以下端口可以访问：
- **443 (HTTPS)**: API 请求
- **443/8443 (WSS)**: WebSocket 连接

## 获取源代码

### 方式 1: Git 克隆 (推荐)
```bash
git clone https://github.com/discountry/ritmex-bot.git
cd ritmex-bot
```

### 方式 2: 下载 ZIP
1. 访问 [GitHub 仓库](https://github.com/discountry/ritmex-bot)
2. 点击 "Code" → "Download ZIP"
3. 解压到目标目录

## 依赖安装

```bash
# 进入项目目录
cd ritmex-bot

# 安装依赖
bun install

# 验证安装
bun run --version
```

## 环境配置

### 1. 创建配置文件
```bash
cp .env.example .env
```

### 2. 基础配置
编辑 `.env` 文件，配置基本参数：

```bash
# 交易所选择 (必需)
EXCHANGE=aster

# 交易配置 (必需)
TRADE_SYMBOL=BTCUSDT
TRADE_AMOUNT=0.001

# 风险控制 (推荐)
LOSS_LIMIT=0.04
MAX_CLOSE_SLIPPAGE_PCT=0.05
```

### 3. 交易所 API 配置

#### Aster 配置
```bash
ASTER_API_KEY=your_api_key_here
ASTER_API_SECRET=your_api_secret_here
```

#### GRVT 配置
```bash
GRVT_API_KEY=your_api_key_here
GRVT_API_SECRET=your_wallet_secret_here
GRVT_SUB_ACCOUNT_ID=your_trading_account_id
GRVT_ENV=prod  # 或 testnet
```

#### Lighter 配置
```bash
LIGHTER_ACCOUNT_INDEX=0
LIGHTER_API_PRIVATE_KEY=0x...  # 40字节十六进制私钥
LIGHTER_ENV=testnet  # 或 mainnet
```

#### Backpack 配置
```bash
BACKPACK_API_KEY=your_api_key_here
BACKPACK_API_SECRET=your_api_secret_here
BACKPACK_PASSWORD=your_password_here
BACKPACK_SANDBOX=false  # true 为沙箱环境
```

#### Paradex 配置
```bash
PARADEX_PRIVATE_KEY=0x...  # EVM 私钥
PARADEX_WALLET_ADDRESS=0x...  # EVM 钱包地址
PARADEX_SANDBOX=false  # true 为测试网
```

## 测试部署

### 1. 快速测试
```bash
# 测试配置是否正确
bun run index.ts --help

# 测试连接
bun run index.ts --strategy trend --silent --test-mode
```

### 2. 运行测试套件
```bash
# 运行所有测试
bun test

# 监视模式
bun test --watch
```

### 3. 交互式测试
```bash
# 启动 CLI 界面
bun run index.ts

# 或直接启动
bun start
```

## 生产部署

### 1. 环境变量验证
创建验证脚本：

```bash
# 创建 scripts/validate-env.ts
cat > scripts/validate-env.ts << 'EOF'
import { config } from 'dotenv';
config();

const requiredVars = [
  'EXCHANGE',
  'TRADE_SYMBOL',
  'TRADE_AMOUNT'
];

const exchangeVars = {
  aster: ['ASTER_API_KEY', 'ASTER_API_SECRET'],
  grvt: ['GRVT_API_KEY', 'GRVT_API_SECRET', 'GRVT_SUB_ACCOUNT_ID'],
  lighter: ['LIGHTER_ACCOUNT_INDEX', 'LIGHTER_API_PRIVATE_KEY'],
  backpack: ['BACKPACK_API_KEY', 'BACKPACK_API_SECRET', 'BACKPACK_PASSWORD'],
  paradex: ['PARADEX_PRIVATE_KEY', 'PARADEX_WALLET_ADDRESS']
};

function validateEnv() {
  const missing: string[] = [];
  
  // 检查基础变量
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }
  
  // 检查交易所特定变量
  const exchange = process.env.EXCHANGE as keyof typeof exchangeVars;
  if (exchange && exchangeVars[exchange]) {
    for (const varName of exchangeVars[exchange]) {
      if (!process.env[varName]) {
        missing.push(varName);
      }
    }
  }
  
  if (missing.length > 0) {
    console.error('❌ 缺少必需的环境变量:');
    missing.forEach(varName => console.error(`  - ${varName}`));
    process.exit(1);
  }
  
  console.log('✅ 环境变量验证通过');
}

validateEnv();
EOF

# 运行验证
bun run scripts/validate-env.ts
```

### 2. 使用 PM2 部署

#### 安装 PM2
```bash
# 全局安装
npm install -g pm2

# 或本地安装
bun add -D pm2
```

#### 创建 PM2 配置
```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'ritmex-trend',
      script: 'bun',
      args: 'run index.ts --strategy trend --silent',
      cwd: '/path/to/ritmex-bot',
      env: {
        NODE_ENV: 'production'
      },
      // 重启策略
      restart_delay: 5000,
      max_restarts: 10,
      min_uptime: '10s',
      
      // 日志配置
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // 监控
      monitoring: false,
      
      // 实例数量
      instances: 1,
      exec_mode: 'fork'
    },
    {
      name: 'ritmex-maker',
      script: 'bun',
      args: 'run index.ts --strategy maker --silent',
      cwd: '/path/to/ritmex-bot',
      env: {
        NODE_ENV: 'production'
      },
      restart_delay: 5000,
      max_restarts: 10,
      min_uptime: '10s'
    },
    {
      name: 'ritmex-grid',
      script: 'bun',
      args: 'run index.ts --strategy grid --silent',
      cwd: '/path/to/ritmex-bot',
      env: {
        NODE_ENV: 'production'
      },
      restart_delay: 5000,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
};
```

#### PM2 命令
```bash
# 启动应用
pm2 start ecosystem.config.js

# 查看状态
pm2 status

# 查看日志
pm2 logs

# 重启应用
pm2 restart all

# 停止应用
pm2 stop all

# 删除应用
pm2 delete all

# 保存当前配置
pm2 save

# 开机自启
pm2 startup
```

### 3. 使用 Docker 部署

#### 创建 Dockerfile
```dockerfile
# Dockerfile
FROM oven/bun:1.2-alpine

WORKDIR /app

# 复制依赖文件
COPY package.json bun.lockb ./

# 安装依赖
RUN bun install --frozen-lockfile

# 复制源代码
COPY . .

# 创建日志目录
RUN mkdir -p logs

# 设置权限
RUN chown -R bun:bun /app

USER bun

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD bun run healthcheck.ts

# 默认命令
CMD ["bun", "run", "index.ts"]
```

#### 创建 docker-compose.yml
```yaml
version: '3.8'

services:
  ritmex-trend:
    build: .
    container_name: ritmex-trend
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    command: ["bun", "run", "index.ts", "--strategy", "trend", "--silent"]
    volumes:
      - ./logs:/app/logs
      - ./.env:/app/.env:ro
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    
  ritmex-maker:
    build: .
    container_name: ritmex-maker
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    command: ["bun", "run", "index.ts", "--strategy", "maker", "--silent"]
    volumes:
      - ./logs:/app/logs
      - ./.env:/app/.env:ro
    
  ritmex-grid:
    build: .
    container_name: ritmex-grid
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    command: ["bun", "run", "index.ts", "--strategy", "grid", "--silent"]
    volumes:
      - ./logs:/app/logs
      - ./.env:/app/.env:ro
```

#### Docker 命令
```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 重启服务
docker-compose restart
```

## 监控和日志

### 1. 日志配置
创建日志目录：
```bash
mkdir -p logs
```

### 2. 日志轮转配置
```bash
# 安装 logrotate (Ubuntu/Debian)
sudo apt-get install logrotate

# 创建配置文件
sudo cat > /etc/logrotate.d/ritmex-bot << 'EOF'
/path/to/ritmex-bot/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    copytruncate
}
EOF
```

### 3. 系统监控
创建简单的监控脚本：

```bash
# scripts/monitor.sh
#!/bin/bash

LOG_FILE="logs/monitor.log"
ALERT_EMAIL="admin@example.com"

check_process() {
    if ! pgrep -f "ritmex" > /dev/null; then
        echo "$(date): ❌ ritmex-bot process not running" >> $LOG_FILE
        # 发送告警邮件
        echo "ritmex-bot stopped" | mail -s "Alert: ritmex-bot down" $ALERT_EMAIL
        return 1
    fi
    return 0
}

check_memory() {
    MEMORY_USAGE=$(ps -o pid,ppid,cmd,%mem,%cpu --sort=-%mem -C bun | awk 'NR==2{print $4}')
    if (( $(echo "$MEMORY_USAGE > 80" | bc -l) )); then
        echo "$(date): ⚠️  High memory usage: ${MEMORY_USAGE}%" >> $LOG_FILE
    fi
}

check_disk() {
    DISK_USAGE=$(df -h . | awk 'NR==2{print $5}' | sed 's/%//')
    if [ $DISK_USAGE -gt 85 ]; then
        echo "$(date): ⚠️  High disk usage: ${DISK_USAGE}%" >> $LOG_FILE
    fi
}

# 运行检查
check_process
check_memory
check_disk

echo "$(date): ✅ Monitoring check completed" >> $LOG_FILE
```

### 4. Crontab 定时监控
```bash
# 添加到 crontab
crontab -e

# 每5分钟检查一次
*/5 * * * * /path/to/ritmex-bot/scripts/monitor.sh
```

## 安全配置

### 1. 环境变量安全
```bash
# 设置文件权限
chmod 600 .env

# 确保 .env 不被提交
echo ".env" >> .gitignore
```

### 2. API 密钥轮换
定期更换 API 密钥：
```bash
# 创建密钥轮换脚本
cat > scripts/rotate-keys.sh << 'EOF'
#!/bin/bash

# 备份当前配置
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)

# 提示用户更新密钥
echo "请在交易所生成新的 API 密钥"
echo "更新 .env 文件中的以下字段："
echo "- ASTER_API_KEY"
echo "- ASTER_API_SECRET"
echo ""
echo "更新完成后，重启应用程序。"
EOF

chmod +x scripts/rotate-keys.sh
```

### 3. 网络安全
```bash
# UFW 防火墙配置 (Ubuntu)
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow out 443
sudo ufw deny in 443
```

## 故障排除

### 1. 常见问题

#### 环境变量未加载
```bash
# 检查文件是否存在
ls -la .env

# 检查文件权限
ls -la .env

# 手动加载测试
source .env && echo $EXCHANGE
```

#### 依赖安装失败
```bash
# 清理缓存重新安装
rm -rf node_modules bun.lockb
bun install
```

#### 网络连接问题
```bash
# 测试网络连接
curl -I https://fapi.asterdex.com/
curl -I https://api.grvt.io/

# 检查 DNS 解析
nslookup fapi.asterdex.com
```

#### 权限问题
```bash
# 检查文件所有者
ls -la

# 修复权限
sudo chown -R $USER:$USER .
chmod +x scripts/*.sh
```

### 2. 调试模式
```bash
# 启用详细日志
DEBUG=1 bun run index.ts

# 启用特定交易所调试
ASTER_DEBUG=true bun run index.ts
GRVT_DEBUG=true bun run index.ts
```

### 3. 日志分析
```bash
# 查看最近错误
tail -f logs/error.log

# 搜索特定错误
grep -i "error" logs/*.log

# 统计错误类型
grep -i "error" logs/*.log | cut -d' ' -f3- | sort | uniq -c
```

## 性能优化

### 1. 系统调优
```bash
# 增加文件描述符限制
ulimit -n 65536

# 优化网络参数
echo 'net.core.rmem_max = 16777216' >> /etc/sysctl.conf
echo 'net.core.wmem_max = 16777216' >> /etc/sysctl.conf
sysctl -p
```

### 2. 应用调优
```bash
# 设置 Bun 优化参数
export BUN_JSC_memory_pressure_threshold=0.8
export BUN_JSC_memory_pressure_interval=1000
```

## 备份策略

### 1. 配置备份
```bash
# 创建备份脚本
cat > scripts/backup.sh << 'EOF'
#!/bin/bash

BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

# 备份配置文件
cp .env $BACKUP_DIR/
cp package.json $BACKUP_DIR/
cp ecosystem.config.js $BACKUP_DIR/ 2>/dev/null

# 备份日志
cp -r logs $BACKUP_DIR/ 2>/dev/null

# 压缩备份
tar -czf $BACKUP_DIR.tar.gz $BACKUP_DIR
rm -rf $BACKUP_DIR

echo "备份完成: $BACKUP_DIR.tar.gz"
EOF

chmod +x scripts/backup.sh
```

### 2. 自动备份
```bash
# 添加到 crontab
0 2 * * * /path/to/ritmex-bot/scripts/backup.sh
```

---

*部署完成后，请确保定期检查日志、监控性能，并保持 API 密钥的安全。如有问题，请参考故障排除部分或联系技术支持。*