# validate-and-sync.ps1 —— A2UI 工作流唯一维护脚本（自包含单文件）
# 本脚本位于 .opencode/skills/ict-html-mix/scripts/（ict-html-mix 技能文件夹），
# 路径基准：上溯 4 级 = 项目根（html-previewpc/）。
# 两个互斥模式：
#   校验模式（默认）：-InputFile output/xxx.json
#     ① JSON 语法校验（lint 前置：解析失败即 FAIL）
#     ② 项目 lint：(a) flex 方向类必配 flex/inline-flex（漏则容器停留 block、高度塌缩）
#                  (b) *Chart 组件必含显式 h- 高度类（缺则 DOM 塌 10px，RO 按 0/10px 重绘）
#     ③ PASS 后生成 .data.js 孪生（file:// 直开用）
#     注：A2UI 结构校验（三键结构/元素键锁/id 唯一/children/path）不在本脚本职责内，
#         由 ict-coder 技能生成侧校验兜底；本项目只管渲染关切（lint）。
#   元信息模式：-GenMeta
#     从 ict-coder 技能运行时（.opencode/skills/ict-coder/scripts/previewdist/index.prototype.html）
#     提取 styles+scripts 清单，回写渲染器内嵌块（__A2UI_EMBEDDED_META__，file:// 免服务器直开用），
#     **扇出同步全部渲染器**（唯一源 + 运行时副本）：
#       a) 唯一权威源：本技能 scripts/PreviewRenderer.js（与本脚本同目录）
#       b) 运行时副本：项目根 previewdist/PreviewRenderer.js（集中式承载页引用）
#       c) 各 <页目录>/previewdist/PreviewRenderer.js 本地运行时副本（本地化承载页引用）
#     previewdist 重新构建后必须重跑（bundle 文件名带 hash 会变；本地副本的 assets/ 需另行重拷）。
#     注意：会改写渲染器 → 需 bump 各宿主页 ?v=（本地副本版本号独立）并硬刷新。
#
# 用法（在项目根目录执行）：
#   powershell -ExecutionPolicy Bypass -File .\.opencode\skills\ict-html-mix\scripts\validate-and-sync.ps1 -InputFile output/xxx.json
#   powershell -ExecutionPolicy Bypass -File .\.opencode\skills\ict-html-mix\scripts\validate-and-sync.ps1 -GenMeta
# 退出码：0 = 成功；1 = 失败/用法错误。
param(
  [string]$InputFile,
  [switch]$GenMeta
)

$ErrorActionPreference = 'Continue'
try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 } catch {}
$root = Split-Path -Parent $MyInvocation.MyCommand.Path                                # .../ict-html-mix/scripts
$projRoot = [System.IO.Path]::GetFullPath((Join-Path $root '..\..\..\..'))             # 项目根 html-previewpc/

function Show-Usage {
  Write-Output "Usage:"
  Write-Output "  validate  : validate-and-sync.ps1 -InputFile output/<name>.json"
  Write-Output "  gen meta  : validate-and-sync.ps1 -GenMeta   (after previewdist rebuild; bumps renderer file)"
}

# ─────────────────────────────────────────────────────────────
# 模式 B：元信息模式（-GenMeta）——回写渲染器内嵌块（扇出：源 + 全部生效副本）
# ─────────────────────────────────────────────────────────────
if ($GenMeta) {
  if ($InputFile) { Show-Usage; exit 1 }

  # 元信息来源：ict-coder 技能运行时（页面本地 previewdist 副本的标准来源，previewdist 不从项目根取）
  $indexHtml = Join-Path $projRoot '.opencode\skills\ict-coder\scripts\previewdist\index.prototype.html'
  # 渲染器唯一权威源：本技能 scripts/ 目录（与本脚本同目录）
  $rendererFile = Join-Path $root 'PreviewRenderer.js'
  # 运行时副本：项目根 previewdist/（集中式承载页引用）
  $liveCopy = Join-Path $projRoot 'previewdist\PreviewRenderer.js'

  if (-not (Test-Path -LiteralPath $indexHtml)) {
    Write-Output "FATAL: ict-coder runtime entry not found: $indexHtml"
    exit 1
  }
  if (-not (Test-Path -LiteralPath $rendererFile)) {
    Write-Output "FATAL: renderer source not found: $rendererFile"
    exit 1
  }

  $raw = Get-Content -LiteralPath $indexHtml -Raw -Encoding UTF8

  # 提取全部 <style> 块（含 type 属性，如 text/tailwindcss）
  $styles = @()
  foreach ($m in [regex]::Matches($raw, '(?s)<style([^>]*)>(.*?)</style>')) {
    $attrs = $m.Groups[1].Value
    $text = $m.Groups[2].Value
    $type = $null
    if ($attrs -match 'type="([^"]+)"') { $type = $matches[1] }
    $styles += @{ text = $text; type = $type }
  }

  # 提取 <script src>，排除 data.js（数据由各实例单独注入）；保留原始相对 src（./ 前缀由渲染器归一化）
  $scripts = @()
  foreach ($m in [regex]::Matches($raw, '<script[^>]*\ssrc="([^"]+)"')) {
    $src = $m.Groups[1].Value
    if ($src -and $src -notmatch '(^|/)data\.js$') { $scripts += $src }
  }

  # 组装内嵌块；以标记行为锚做字符串替换（避开正则转义问题）；UTF-8 无 BOM 读写防止中文注释损坏
  $meta = @{ styles = $styles; scripts = $scripts }
  $json = ConvertTo-Json -InputObject $meta -Depth 5
  $beginMark = '// __A2UI_FILE_META_BEGIN__'
  $endMark = '// __A2UI_FILE_META_END__'
  $block = "$beginMark`nvar __A2UI_EMBEDDED_META__ = $json;`n$endMark"

  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  $js = [System.IO.File]::ReadAllText($rendererFile, $utf8NoBom)
  $idxB = $js.IndexOf($beginMark)
  $idxE = $js.IndexOf($endMark)
  if ($idxB -lt 0 -or $idxE -lt 0 -or $idxE -lt $idxB) {
    Write-Output "FATAL: meta markers not found in PreviewRenderer.js (expected $beginMark / $endMark)"
    exit 1
  }
  $newJs = $js.Substring(0, $idxB) + $block + $js.Substring($idxE + $endMark.Length)

  # 扇出同步全部渲染器（单点失败 WARN 不中断）：
  #   a) 唯一权威源：本技能 scripts/PreviewRenderer.js
  #   b) 运行时副本：项目根 previewdist/（http 承载页引用；旧文件可能 ACL 拒写）
  #   c) 各 <页目录>/previewdist/ 本地运行时副本（本地化承载页引用）
  $targets = @($rendererFile, $liveCopy)
  $localCopies = Get-ChildItem (Join-Path $projRoot '*\previewdist\PreviewRenderer.js') -ErrorAction SilentlyContinue
  if ($localCopies) { $targets += $localCopies.FullName }
  foreach ($t in ($targets | Select-Object -Unique)) {
    try {
      [System.IO.File]::WriteAllText($t, $newJs, $utf8NoBom)
      Write-Output "OK: renderer synced -> $t"
    } catch {
      Write-Output "WARN: cannot write $t ($($_.Exception.GetType().Name)); source already updated, sync manually if needed."
    }
  }
  Write-Output "  styles: $($styles.Count) block(s), scripts: $($scripts.Count) entry(ies)"
  $scripts | ForEach-Object { Write-Output "  - $_" }
  Write-Output "  NOTE: renderer changed -> bump host pages ?v= and hard-refresh (Ctrl+Shift+R)"
  exit 0
}

# ─────────────────────────────────────────────────────────────
# 模式 A：校验模式（-InputFile）：JSON 语法 + 项目 lint + 孪生生成
# ─────────────────────────────────────────────────────────────
if (-not $InputFile) { Show-Usage; exit 1 }

if (-not (Test-Path -LiteralPath $InputFile)) {
  Write-Output "FATAL: File not found: $InputFile"
  exit 1
}
# UTF8 显式编码：PS5.1 对无 BOM 的 UTF-8 JSON 默认按 ANSI 误解码中文，必须显式指定
$raw = Get-Content -LiteralPath $InputFile -Raw -Encoding UTF8

# =============================================================
# ① JSON 语法校验（lint 的前置条件：解析不了就没法查 className）
# =============================================================
$json = $null
try {
  $json = $raw | ConvertFrom-Json
} catch {
  Write-Output "=========================================="
  Write-Output "RESULT: FAIL (json syntax)"
  Write-Output "FATAL: INVALID JSON SYNTAX"
  Write-Output "(structure/schema validation is ict-coder's job; here only syntax is checked)"
  Write-Output "=========================================="
  Write-Output $_.Exception.Message
  $lines = $raw -split "`n"
  if ($_.Exception.Message -match '\((\d+)\)') {
    $errLine = [int]$matches[1]
    $start = [Math]::Max(0, $errLine - 3)
    $end = [Math]::Min($lines.Count - 1, $errLine + 3)
    Write-Output ""
    Write-Output "Context:"
    for ($i = $start; $i -le $end; $i++) {
      $marker = if ($i + 1 -eq $errLine) { '>>>' } else { '   ' }
      Write-Output ("{0} {1}: {2}" -f $marker, ($i+1), $lines[$i])
    }
  }
  exit 1
}

Write-Output "JSON syntax: VALID"

# =============================================================
# ② 项目 lint（本项目渲染关切，告警级，建议清零后再挂载）：
#    (a) flex 方向类必配 flex/inline-flex：Tailwind 方向类只设 flex-direction 不设 display，
#        漏 flex 则容器停留在 block，子项 flex-1 失效、高度塌缩（图表卡重灾区）
#    (b) 图表组件（*Chart）className 必须含显式 h- 高度类：图表 DOM 拿到真实 CSS 高度是
#        渲染唯一硬杠杆；缺 h- 则 DOM 塌成 10px，ResizeObserver 只能按 0/10px 重绘
# =============================================================
$extras = @()
if ($json.elements) {
  $elemArray = @($json.elements)
  Write-Output "Elements: $($elemArray.Count) checked"

  foreach ($e in $elemArray) {
    $comp = $e.component
    $cn = $e.props.className
    $tokens = if ($cn -is [string]) { $cn.Trim() -split '\s+' | Where-Object { $_.Length -gt 0 } } else { @() }

    $hasFlex = ($tokens -contains 'flex') -or ($tokens -contains 'inline-flex')
    $dirs = @('flex-row','flex-row-reverse','flex-col','flex-col-reverse','flex-wrap','wrap-reverse')
    $found = @($tokens | Where-Object { $_ -in $dirs })
    if ($found.Count -gt 0 -and -not $hasFlex) {
      $extras += "'$($e.id)' has [$($found -join ', ')] but no 'flex'/'inline-flex' -> display stays block, flex-direction ineffective (add 'flex')"
    }

    if ($comp -is [string] -and $comp -match 'Chart$') {
      $hasH = @($tokens | Where-Object { $_ -match '^h-' }).Count -gt 0
      if (-not $hasH) {
        $extras += "'$($e.id)' ($comp) className missing explicit height class (h-) -> chart DOM has no real height; HuiCharts RO can only re-render at 0/10px (add 'h-full' or 'h-64' etc.)"
      }
    }
  }
}

# =============================================================
# 汇总（FAIL 仅源于语法错误；lint 为告警）
# =============================================================
Write-Output ""
Write-Output "=========================================="
Write-Output "RESULT: PASS"
if ($extras.Count -gt 0) {
  Write-Output "Project lint warnings ($($extras.Count)):"
  foreach ($w in $extras) { Write-Output "  ! $w" }
}

# =============================================================
# ③ .data.js 孪生生成：file:// 免服务器直开时，渲染器无法 fetch JSON（CORS），
#    改以 <script> 加载本孪生（window.__A2UI_FILE_DATA__）。JSON 为唯一事实源，随校验自动同步。
# =============================================================
$finalRaw = [System.IO.File]::ReadAllText($InputFile, (New-Object System.Text.UTF8Encoding($false)))
$twinPath = $InputFile -replace '\.json$', '.data.js'
$utf8NoBom2 = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($twinPath, "window.__A2UI_FILE_DATA__ = $finalRaw`n", $utf8NoBom2)
Write-Output ""
Write-Output "File-data twin: $twinPath (for file:// no-server access)"
exit 0
