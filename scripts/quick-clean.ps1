# 快速清理脚本 - 仅清理最常见的临时文件 (PowerShell版本)
# 适合在开发过程中频繁使用

Write-Host "🚀 快速清理模式" -ForegroundColor Green
Write-Host "================" -ForegroundColor Green

$count = 0

# 清理最常见的临时文件
$patterns = @(
    "*_REPORT.md",
    "*_LOG*.md", 
    "*_COMPLETE*.md",
    "*test*.html",
    "*debug*.html",
    "*.tmp",
    "*.bak",
    "*~",
    ".DS_Store",
    "Thumbs.db"
)

foreach ($pattern in $patterns) {
    $files = Get-ChildItem -Name $pattern -ErrorAction SilentlyContinue
    foreach ($file in $files) {
        if ($file -ne "README.md") {
            Remove-Item $file -Force -ErrorAction SilentlyContinue
            Write-Host "删除: $file"
            $count++
        }
    }
}

# 清理空的测试目录
$testDirs = @("_test-pages", "_backup", "backup")
foreach ($dir in $testDirs) {
    if ((Test-Path $dir) -and ((Get-ChildItem $dir | Measure-Object).Count -eq 0)) {
        Remove-Item $dir -Force
        Write-Host "删除空目录: $dir"
        $count++
    }
}

if ($count -eq 0) {
    Write-Host "✅ 项目已是干净状态" -ForegroundColor Green
} else {
    Write-Host "✅ 快速清理完成，删除了 $count 个项目" -ForegroundColor Green
}
