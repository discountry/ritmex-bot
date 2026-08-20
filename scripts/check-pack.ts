#!/usr/bin/env bun
// 发布前闸门：阻止密钥文件进入 npm tarball。
// 0.1.0 曾把 .env 发到 registry —— .npmignore 一旦存在就完全接管 .gitignore，
// 而当时的 .npmignore 没有列 .env，.gitignore 里的规则形同虚设。

import { spawnSync } from "node:child_process";

const DENY = [
  /^\.env$/,
  /^\.env\.(?!example$)/,
  /^\.npmrc$/,
  /\.pem$/,
  /\.key$/,
  /(^|\/)id_(rsa|ed25519)$/,
];

const result = spawnSync("npm", ["pack", "--dry-run", "--json"], { encoding: "utf8" });
if (result.status !== 0) {
  console.error(result.stderr);
  process.exit(1);
}

const [meta] = JSON.parse(result.stdout) as Array<{ files: Array<{ path: string }> }>;
if (!meta) {
  console.error("无法解析 npm pack 输出，发布已中止。");
  process.exit(1);
}

const leaked = meta.files.map((file) => file.path).filter((path) => DENY.some((re) => re.test(path)));

if (leaked.length > 0) {
  console.error("\n发布已中止 —— tarball 中包含密钥文件：");
  for (const path of leaked) console.error(`  - ${path}`);
  console.error("");
  process.exit(1);
}

console.log(`pack 检查通过：${meta.files.length} 个文件，未发现密钥文件。`);
