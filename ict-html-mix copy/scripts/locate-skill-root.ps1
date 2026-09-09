# locate-skill-root.ps1 —— 集中解析 $Skills（技能根 = ict-html-mix 所在的 skills 目录）
# 自包含：从脚本自身位置上溯推导，不依赖 CWD、不硬编码技能路径。
# SKILL.md 的技能根定位 / ict-coder 依赖检查、validate-and-sync.ps1 的 -GenMeta ict-coder 路径解析共用本脚本。
#
# 用法：
#   $Skills = & '<ict-html-mix 技能目录>\scripts\locate-skill-root.ps1'                 # 仅解析，stdout 输出 $Skills 绝对路径
#   $Skills = & '<ict-html-mix 技能目录>\scripts\locate-skill-root.ps1' -CheckIctCoder  # 解析 + 校验 ict-coder；缺失即 Write-Error + exit 1
# 被同进程调用时（如 validate-and-sync.ps1 内）建议以子进程方式调用以隔离 exit：
#   $sRoot = & powershell -NoProfile -File "$root\locate-skill-root.ps1"
# 退出码：0 = 成功；1 = 未定位到技能根 / ict-coder 缺失。

param([switch]$CheckIctCoder)

try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 } catch {}

# 从脚本自身位置上溯：.../ict-html-mix/scripts/locate-skill-root.ps1 → skills 根
$scriptPath = $MyInvocation.MyCommand.Path
$scriptDir  = Split-Path -Parent $scriptPath        # .../ict-html-mix/scripts
$skillDir   = Split-Path -Parent $scriptDir        # .../ict-html-mix（本技能文件夹）
$Skills     = Split-Path -Parent $skillDir        # .../skills（技能根）

# 自检：skillDir 下应有 SKILL.md（确认脚本确在 ict-html-mix/scripts 内）；否则兜底项目根 .opencode\skills
if (-not (Test-Path -LiteralPath (Join-Path $skillDir 'SKILL.md'))) {
    $fallback = Join-Path (Get-Location).Path '.opencode\skills'
    if (Test-Path -LiteralPath (Join-Path $fallback 'ict-html-mix')) {
        $Skills = $fallback
    } else {
        Write-Error "技能根未定位到：自推导路径 '$skillDir' 无 SKILL.md，且项目根 .opencode\skills 亦无 ict-html-mix"
        exit 1
    }
}

if (-not (Test-Path -LiteralPath $Skills)) {
    Write-Error "技能根不存在：$Skills"
    exit 1
}

if ($CheckIctCoder) {
    $ictCoder = Join-Path $Skills 'ict-coder'
    if (-not (Test-Path -LiteralPath $ictCoder)) {
        Write-Error "ict-coder 技能未安装（期望路径：$ictCoder）。本工作流无法生成 JSON / 拷贝 previewdist 运行时，请先安装 ict-coder 技能。"
        exit 1
    }
}

Write-Output $Skills
exit 0
