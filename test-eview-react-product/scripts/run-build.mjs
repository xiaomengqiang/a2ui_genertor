#!/usr/bin/env node
// 构建与运行检查：npm install → npm run build → 后台起 npm run dev → 探活 → kill
// 用法：node run-build.mjs <PRODUCT_PATH>
// 输出：<PRODUCT_PATH>/.build-result.json
//
// 需要 Node 18+（用 fetch / AbortSignal.timeout）。

import fs from 'fs';
import path from 'path';
import { spawn, spawnSync } from 'child_process';

const productRoot = path.resolve(process.argv[2] || process.cwd());

function runSync(args, timeout = 180000) {
  const r = spawnSync('npm', args, { cwd: productRoot, encoding: 'utf8', shell: true, timeout });
  return { ok: r.status === 0, stdout: r.stdout || '', stderr: r.stderr || '' };
}

function pickErrors(text, max = 10) {
  return text.split(/\r?\n/)
    .filter(l => /error|failed|cannot|exception|ERR_|not found|unresolved|Failed to resolve/i.test(l))
    .map(l => l.trim())
    .filter(l => l.length > 0)
    .slice(-max);
}

const out = {
  install: { ok: false, errors: [] },
  build:   { ok: false, errors: [] },
  dev:     { ok: false, started: false, httpOk: false, port: null, errors: [] },
};

// 1. install
const inst = runSync(['install'], 300000);
out.install = { ok: inst.ok, errors: inst.ok ? [] : pickErrors(inst.stderr + inst.stdout) };

if (inst.ok) {
  // 2. build
  const b = runSync(['run', 'build'], 180000);
  out.build = { ok: b.ok, errors: b.ok ? [] : pickErrors((b.stderr || '') + (b.stdout || '')) };

  // 3. dev（后台起，探活后 kill）
  const devProc = spawn('npm', ['run', 'dev'], {
    cwd: productRoot, shell: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let devOut = '';
  devProc.stdout.on('data', d => { devOut += d.toString(); });
  devProc.stderr.on('data', d => { devOut += d.toString(); });

  // 等待 dev server 起来
  await new Promise(r => setTimeout(r, 8000));

  // 从输出 parse 端口（vite 输出 "Local: http://localhost:5173/"）
  let port = 5173;
  const m = devOut.match(/localhost:(\d+)/);
  if (m) port = parseInt(m[1], 10);
  out.dev.port = port;

  // 探活：先试 parse 出来的端口，再退化试常见端口
  let httpOk = false;
  const tryPorts = [port, 5173, 5174, 5175, 5176];
  for (const p of tryPorts) {
    try {
      const res = await fetch(`http://localhost:${p}/`, { signal: AbortSignal.timeout(3000) });
      if (res.status > 0) { httpOk = true; out.dev.port = p; break; }
    } catch {}
  }

  // kill dev server（Windows 用 taskkill 杀进程树）
  if (process.platform === 'win32') {
    try { spawnSync('taskkill', ['/pid', String(devProc.pid), '/f', '/t'], { shell: true }); } catch {}
  } else {
    try { devProc.kill('SIGTERM'); } catch {}
    try { spawnSync('pkill', ['-f', 'vite'], { shell: true }); } catch {}
  }

  out.dev = {
    ok: httpOk,
    started: devOut.length > 0,
    httpOk,
    port: out.dev.port,
    errors: httpOk ? [] : pickErrors(devOut),
  };
} else {
  out.build.errors = ['install 失败，跳过 build'];
  out.dev.errors = ['install 失败，跳过 dev'];
}

fs.writeFileSync(path.join(productRoot, '.build-result.json'), JSON.stringify(out, null, 2));
console.log(JSON.stringify(out));
