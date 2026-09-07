# Restore DSH profile configs from this backup and reinstall plugin deps.
# Usage:  pwsh -ExecutionPolicy Bypass -File reinstall.ps1
$ErrorActionPreference = 'Stop'
$here = $PSScriptRoot
$home = $env:USERPROFILE
foreach ($prof in @('desktop', 'web')) {
  $src = Join-Path $here "profiles\$prof\package.json"
  if (!(Test-Path $src)) { Write-Host "skip $prof (no backup)"; continue }
  $dstDir = Join-Path $home ".dsh\profiles\$prof"
  New-Item -ItemType Directory -Force $dstDir | Out-Null
  Copy-Item $src (Join-Path $dstDir 'package.json') -Force
  Write-Host "[$prof] package.json restored -> $dstDir"
  & dsh plugin --profile $prof install
  if ($LASTEXITCODE -ne 0) { Write-Warning "[$prof] pnpm install failed (check network / git proxy)" }
}
Write-Host "Done. NOTE: file: deps in desktop profile point to D:\DSH\dsh-*; keep those folders in place,"
Write-Host "or edit profiles\desktop\package.json to point elsewhere before installing."
