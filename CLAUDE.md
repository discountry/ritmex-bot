# RitMEX Bot — Claude Instructions

## Package Manager

**You must use Bun** — this project uses Bun as both the package manager and the runtime. Every command that can be run with Bun must use Bun:

- Install dependencies: `bun install`
- Run scripts: `bun run <script>`
- Execute tests: `bun test`

**Do not use npm, yarn, or npx.**

## Source-Only Execution

This project must always run from the local repository. The following are forbidden — they fetch the upstream author's published npm package, not this fork:

```
npm install -g ritmex-bot
npx ritmex-bot
npm install ritmex-bot
```

The only valid entry point is `bun run index.ts` from the repository root.
