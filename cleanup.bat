@echo off
REM 项目清理批处理脚本 - Windows版本
REM 自动设置PowerShell执行策略并运行清理脚本

echo 🧹 Jekyll 项目清理工具 (Windows)
echo ================================

REM 检查PowerShell执行策略
powershell -Command "if ((Get-ExecutionPolicy) -eq 'Restricted') { Write-Host '⚠️  需要设置PowerShell执行策略' -ForegroundColor Yellow; Write-Host '正在临时设置执行策略...' -ForegroundColor Cyan }"

REM 根据参数运行不同的清理模式
if "%1"=="--dry-run" (
    echo 🔍 预览模式 - 显示将要删除的文件
    powershell -ExecutionPolicy Bypass -File cleanup.ps1 -DryRun
) else if "%1"=="--deep" (
    echo 🔥 深度清理模式 - 包括构建缓存
    powershell -ExecutionPolicy Bypass -File cleanup.ps1 -Deep
) else if "%1"=="--help" (
    echo 使用方法: cleanup.bat [选项]
    echo.
    echo 选项:
    echo   --dry-run    预览清理内容，不实际删除
    echo   --deep       深度清理，包括构建缓存
    echo   --help       显示此帮助信息
    echo.
    echo 示例:
    echo   cleanup.bat                 # 标准清理
    echo   cleanup.bat --dry-run       # 预览清理
    echo   cleanup.bat --deep          # 深度清理
) else (
    echo 📝 标准清理模式
    powershell -ExecutionPolicy Bypass -File cleanup.ps1
)

echo.
echo ✅ 清理完成！
pause
