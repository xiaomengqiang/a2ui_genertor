#!/usr/bin/env node
// 视觉与交互测试：playwright 按 baseline manifest 跑每个场景
//   goto + interactions + assertClasses/assertTexts + 截图 + 与基线像素 diff
// 用法：node visual-test.mjs <PRODUCT_PATH> <BASELINE_DIR>
// 输出：<PRODUCT_PATH>/.visual-result.json
//
// 需要 Node 18+；依赖 playwright/pngjs/pixelmatch，缺失时自动装到 PRODUCT_PATH。

import fs from 'fs';
import path from 'path';
import { spawn, spawnSync } from 'child_process';

const productRoot = path.resolve(process.argv[2] || process.cwd());
const baselineDir = path.resolve(process.argv[3]);

if (!baselineDir || !fs.existsSync(baselineDir)) {
  console.error('[visual] BASELINE_DIR 缺失，跳过视觉层');
  process.exit(2);
}

const manifestPath = path.join(baselineDir, 'manifest.json');
if (!fs.existsSync(manifestPath)) {
  console.error(`[visual] manifest.json 未找到: ${manifestPath}`);
  process.exit(2);
}
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// 依赖检查 + 自动装
let chromium, PNG, pixelmatch;
async function loadDeps() {
  ({ chromium } = await import('playwright'));
  ({ PNG } = await import('pngjs'));
  ({ default: pixelmatch } = await import('pixelmatch'));
}
try {
  await loadDeps();
} catch (e) {
  console.error('[visual] 依赖缺失，安装到 PRODUCT_PATH...', e.message);
  spawnSync('npm', ['install', '-D', 'playwright', 'pngjs', 'pixelmatch'], {
    cwd: productRoot, shell: true, stdio: 'inherit'
  });
  spawnSync('npx', ['playwright', 'install', 'chromium'], {
    cwd: productRoot, shell: true, stdio: 'inherit'
  });
  await loadDeps();
}

// 起 dev server
const devProc = spawn('npm', ['run', 'dev'], {
  cwd: productRoot, shell: true,
  stdio: ['ignore', 'pipe', 'pipe'],
});
let devOut = '';
devProc.stdout.on('data', d => { devOut += d.toString(); });
devProc.stderr.on('data', d => { devOut += d.toString(); });

await new Promise(r => setTimeout(r, 8000));

let port = 5173;
const m = devOut.match(/localhost:(\d+)/);
if (m) port = parseInt(m[1], 10);
const baseUrl = manifest.devUrl || `http://localhost:${port}`;

function killDev() {
  if (process.platform === 'win32') {
    try { spawnSync('taskkill', ['/pid', String(devProc.pid), '/f', '/t'], { shell: true }); } catch {}
  } else {
    try { devProc.kill('SIGTERM'); } catch {}
    try { spawnSync('pkill', ['-f', 'vite'], { shell: true }); } catch {}
  }
}

// 探活
let devUp = false;
for (const p of [port, 5173, 5174, 5175]) {
  try {
    const res = await fetch(`http://localhost:${p}/`, { signal: AbortSignal.timeout(3000) });
    if (res.status > 0) { devUp = true; if (p !== port) { port = p; } break; }
  } catch {}
}
if (!devUp) {
  killDev();
  const out = { summary: { total: 0, passed: 0, failed: 0 }, cases: [], error: `dev server 未起来，端口 ${port}` };
  fs.writeFileSync(path.join(productRoot, '.visual-result.json'), JSON.stringify(out, null, 2));
  console.error(`[visual] dev server 未起来`);
  process.exit(1);
}

// 跑 case
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: manifest.viewport || { width: 1280, height: 720 },
});
const results = [];

for (const c of manifest.cases) {
  const page = await context.newPage();
  const failures = [];

  // goto
  try {
    await page.goto(baseUrl + (c.path || '/'), {
      waitUntil: 'networkidle',
      timeout: c.waitTimeout || manifest.waitTimeout || 5000,
    });
  } catch (e) {
    failures.push(`goto 失败: ${e.message}`);
  }

  // interactions
  for (const step of (c.interactions || [])) {
    try {
      switch (step.type) {
        case 'click': await page.click(step.selector); break;
        case 'fill': await page.fill(step.selector, step.value); break;
        case 'hover': await page.hover(step.selector); break;
        case 'select': await page.selectOption(step.selector, step.value); break;
        case 'wait':
          if (step.timeout) await page.waitForTimeout(step.timeout);
          else if (step.selector) await page.waitForSelector(step.selector, { timeout: 5000 });
          break;
        case 'keyboard': await page.keyboard.press(step.key); break;
        case 'eval': await page.evaluate(step.script); break;
        default: failures.push(`未知 interaction type: ${step.type}`);
      }
    } catch (e) {
      failures.push(`interaction ${step.type} 失败: ${e.message}`);
    }
  }

  // assertClasses
  for (const a of (c.assertClasses || [])) {
    try {
      const handle = await page.$(a.selector);
      if (!handle) { failures.push(`assertClasses: ${a.selector} 未找到`); continue; }
      const cls = (await handle.getAttribute('class')) || '';
      const tokens = cls.split(/\s+/);
      if (a.has && !tokens.includes(a.has)) failures.push(`assertClasses: ${a.selector} 缺类 ${a.has}（实际 class="${cls}"）`);
      if (a.lacks && tokens.includes(a.lacks)) failures.push(`assertClasses: ${a.selector} 不应有类 ${a.lacks}（实际 class="${cls}"）`);
    } catch (e) {
      failures.push(`assertClasses 异常: ${e.message}`);
    }
  }

  // assertTexts
  for (const a of (c.assertTexts || [])) {
    try {
      const handle = await page.$(a.selector);
      if (!handle) { failures.push(`assertTexts: ${a.selector} 未找到`); continue; }
      const text = ((await handle.textContent()) || '').trim();
      if (a.equals && text !== a.equals) failures.push(`assertTexts: ${a.selector} 应为 "${a.equals}"，实际 "${text}"`);
      if (a.contains && !text.includes(a.contains)) failures.push(`assertTexts: ${a.selector} 应含 "${a.contains}"，实际 "${text}"`);
    } catch (e) {
      failures.push(`assertTexts 异常: ${e.message}`);
    }
  }

  // 截图 + 像素 diff
  let diffRatio = 1;
  const tolerance = c.tolerance ?? manifest.tolerance ?? 0.05;
  const baselinePath = path.join(baselineDir, c.baseline);

  if (!fs.existsSync(baselinePath)) {
    failures.push(`基线截图未找到: ${c.baseline}`);
  } else {
    try {
      const fullPage = c.screenshotFullPage ?? manifest.screenshotFullPage ?? false;
      const curBuf = await page.screenshot({ fullPage });
      const basePng = PNG.sync.read(fs.readFileSync(baselinePath));
      const curPng = PNG.sync.read(curBuf);

      // 收集 ignoreRegions（selector → boundingBox）
      const ignoreRegions = [];
      for (const r of (c.ignoreRegions || [])) {
        if (r.selector) {
          const box = await page.locator(r.selector).boundingBox();
          if (box) ignoreRegions.push({ x: Math.round(box.x), y: Math.round(box.y), width: Math.round(box.width), height: Math.round(box.height) });
        } else if (r.x !== undefined) {
          ignoreRegions.push({ x: r.x, y: r.y, width: r.width, height: r.height });
        }
      }

      // mask 函数：把区域置零（pixelmatch 视为相同）
      const mask = (png) => {
        for (const reg of ignoreRegions) {
          for (let yy = Math.max(0, reg.y); yy < Math.min(png.height, reg.y + reg.height); yy++) {
            for (let xx = Math.max(0, reg.x); xx < Math.min(png.width, reg.x + reg.width); xx++) {
              const idx = (png.width * yy + xx) * 4;
              png.data[idx] = png.data[idx + 1] = png.data[idx + 2] = png.data[idx + 3] = 0;
            }
          }
        }
      };
      mask(basePng);
      mask(curPng);

      if (curPng.width !== basePng.width || curPng.height !== basePng.height) {
        failures.push(`截图尺寸不一致: baseline ${basePng.width}x${basePng.height}, current ${curPng.width}x${curPng.height}`);
        diffRatio = 1;
      } else {
        const { width, height } = basePng;
        const diff = new PNG({ width, height });
        const mismatched = pixelmatch(basePng.data, curPng.data, diff.data, width, height, { threshold: 0.1 });
        diffRatio = mismatched / (width * height);
        if (diffRatio > tolerance) {
          failures.push(`像素差异 ${(diffRatio * 100).toFixed(1)}% 超过容差 ${(tolerance * 100).toFixed(1)}%`);
        }
      }
    } catch (e) {
      failures.push(`截图/diff 异常: ${e.message}`);
    }
  }

  results.push({
    id: c.id,
    passed: failures.length === 0,
    diffRatio: Number(diffRatio.toFixed(4)),
    tolerance,
    failures,
  });
  await page.close();
}

await browser.close();
killDev();

const summary = {
  total: results.length,
  passed: results.filter(r => r.passed).length,
  failed: results.filter(r => !r.passed).length,
};
const out = { summary, cases: results };
fs.writeFileSync(path.join(productRoot, '.visual-result.json'), JSON.stringify(out, null, 2));
console.log(JSON.stringify(out));
