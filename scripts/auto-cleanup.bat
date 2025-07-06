@echo off
REM auto-cleanup.bat - Windows批处理包装器
REM 用于启动PowerShell自动清理脚本

setlocal enabledelayedexpansion

REM 获取脚本目录
set "SCRIPT_DIR=%~dp0"
set "PS_SCRIPT=%SCRIPT_DIR%auto-cleanup.ps1"

REM 检查PowerShell脚本是否存在
if not exist "%PS_SCRIPT%" (
    echo 错误: 找不到 auto-cleanup.ps1 脚本
    echo 请确保文件存在: %PS_SCRIPT%
    pause
    exit /b 1
)

REM 显示使用说明
if "%1"=="" (
    echo.
    echo 自动清理工具 - Windows批处理包装器
    echo.
    echo 用法: %~nx0 [选项]
    echo.
    echo 选项:
    echo   cleanup-now     立即执行一次清理
    echo   dry-run         预览模式，显示将要清理的文件但不删除
    echo   watch           启动监控模式，持续监控文件变化
    echo   daemon          作为后台服务运行
    echo   stop            停止后台服务
    echo   status          显示后台服务状态
    echo   help            显示帮助信息
    echo.
    echo 示例:
    echo   %~nx0 cleanup-now
    echo   %~nx0 watch
    echo   %~nx0 daemon
    echo.
    pause
    exit /b 0
)

REM 解析参数并调用PowerShell脚本
if /i "%1"=="cleanup-now" (
    powershell -ExecutionPolicy Bypass -File "%PS_SCRIPT%" -CleanupNow
) else if /i "%1"=="dry-run" (
    powershell -ExecutionPolicy Bypass -File "%PS_SCRIPT%" -DryRun
) else if /i "%1"=="watch" (
    echo 启动监控模式...
    echo 按 Ctrl+C 停止监控
    powershell -ExecutionPolicy Bypass -File "%PS_SCRIPT%" -Watch
) else if /i "%1"=="daemon" (
    powershell -ExecutionPolicy Bypass -File "%PS_SCRIPT%" -Daemon
) else if /i "%1"=="stop" (
    powershell -ExecutionPolicy Bypass -File "%PS_SCRIPT%" -Stop
) else if /i "%1"=="status" (
    powershell -ExecutionPolicy Bypass -File "%PS_SCRIPT%" -Status
) else if /i "%1"=="help" (
    powershell -ExecutionPolicy Bypass -File "%PS_SCRIPT%" -Help
) else (
    echo 未知选项: %1
    echo 使用 'help' 查看帮助信息
    exit /b 1
)

REM 如果不是daemon模式，暂停以查看输出
if not /i "%1"=="daemon" (
    echo.
    pause
)

endlocal
