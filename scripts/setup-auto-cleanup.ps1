# setup-auto-cleanup.ps1 - 一键配置自动清理系统 (PowerShell版本)
# 快速设置和启动自动清理功能

param(
    [switch]$QuickSetup,
    [switch]$Help
)

# 获取脚本目录
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir

# 显示标题
Write-Host "=== Jekyll项目自动清理系统配置 ===" -ForegroundColor Cyan
Write-Host ""

# 检查项目根目录
if (-not (Test-Path (Join-Path $ProjectRoot "_config.yml"))) {
    Write-Host "错误: 未找到Jekyll项目配置文件" -ForegroundColor Red
    Write-Host "请确保在Jekyll项目根目录运行此脚本"
    exit 1
}

Write-Host "✓ 检测到Jekyll项目: $ProjectRoot" -ForegroundColor Green

if ($Help) {
    Write-Host @"

📖 自动清理系统使用说明:

🔧 基础清理:
  .\cleanup.ps1                    # 标准清理
  .\cleanup.ps1 -DryRun            # 预览清理内容
  .\cleanup.ps1 -Deep              # 深度清理

⚡ 快速清理:
  .\scripts\quick-clean.ps1        # 快速清理常见临时文件

🤖 自动监控清理:
  .\scripts\auto-cleanup.ps1 -CleanupNow    # 立即清理
  .\scripts\auto-cleanup.ps1 -Watch         # 监控模式  
  .\scripts\auto-cleanup.ps1 -Daemon        # 后台服务
  .\scripts\auto-cleanup.ps1 -Status        # 查看状态

🧠 智能清理系统:
  .\scripts\smart-cleanup.sh [模式]         # 多模式清理 (需要Bash)

清理模式:
• standard: 标准清理 - 临时文件和日志
• build: 构建清理 - 缓存和构建文件  
• dev: 开发清理 - 开发工具临时文件
• deep: 深度清理 - 所有类型文件

🔗 Git集成:
使用 Git Hook 在每次commit前自动清理

📊 统计功能:
查看清理历史和性能指标

批处理包装器:
  .\scripts\auto-cleanup.bat cleanup-now   # Windows批处理方式
  .\scripts\auto-cleanup.bat watch         # 监控模式
  .\scripts\auto-cleanup.bat daemon        # 后台服务

"@
    exit 0
}

if ($QuickSetup) {
    Write-Host "=== 快速配置模式 ===" -ForegroundColor Green
    
    # 1. 检查Git Hook
    Write-Host "检查Git pre-commit hook..." -ForegroundColor Blue
    $hookScript = Join-Path $ScriptDir "install-hooks.sh"
    if (Test-Path $hookScript) {
        try {
            & bash $hookScript
            Write-Host "✓ Git Hook 配置完成" -ForegroundColor Green
        } catch {
            Write-Host "⚠ Git Hook 配置失败 (需要Bash环境)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "⚠ Git Hook 脚本未找到" -ForegroundColor Yellow
    }
    
    # 2. 执行初始清理
    Write-Host "`n执行初始清理..." -ForegroundColor Blue
    $cleanupScript = Join-Path $ScriptDir "auto-cleanup.ps1"
    if (Test-Path $cleanupScript) {
        & powershell -ExecutionPolicy Bypass -File $cleanupScript -CleanupNow
        Write-Host "✓ 初始清理完成" -ForegroundColor Green
    } else {
        Write-Host "⚠ 自动清理脚本未找到，使用基础清理" -ForegroundColor Yellow
        $basicCleanup = Join-Path $ProjectRoot "cleanup.ps1"
        if (Test-Path $basicCleanup) {
            & powershell -ExecutionPolicy Bypass -File $basicCleanup
        }
    }
    
    # 3. 显示完成信息
    Write-Host "`n=== 快速配置完成 ===" -ForegroundColor Cyan
    Write-Host "现在你可以:" -ForegroundColor Green
    Write-Host "• 立即清理: .\scripts\auto-cleanup.ps1 -CleanupNow"
    Write-Host "• 监控模式: .\scripts\auto-cleanup.ps1 -Watch"
    Write-Host "• 后台服务: .\scripts\auto-cleanup.ps1 -Daemon"
    Write-Host "• 批处理方式: .\scripts\auto-cleanup.bat cleanup-now"
    
    $response = Read-Host "`n是否立即启动监控模式? [y/N]"
    if ($response -match "^[Yy]$") {
        Write-Host "启动监控模式..." -ForegroundColor Green
        & powershell -ExecutionPolicy Bypass -File $cleanupScript -Watch
    }
    
    exit 0
}

# 显示交互式菜单
Write-Host "`n可用的清理工具:" -ForegroundColor Blue
Write-Host "1. 基础清理脚本 (cleanup.ps1)"
Write-Host "2. 快速清理脚本 (quick-clean.ps1)"  
Write-Host "3. 自动监控清理 (auto-cleanup.ps1)"
Write-Host "4. 智能清理系统 (smart-cleanup.sh - 需要Bash)"
Write-Host "5. Git Hook 自动清理 (需要Bash环境)"

Write-Host "`n选择配置选项:" -ForegroundColor Yellow
Write-Host "a) 快速配置 - 使用推荐设置"
Write-Host "b) 自定义配置 - 手动选择功能"
Write-Host "c) 启动监控模式"
Write-Host "d) 立即清理一次"
Write-Host "e) 显示使用说明"
Write-Host "q) 退出"

do {
    $choice = Read-Host "`n请选择 [a/b/c/d/e/q]"
    
    switch ($choice.ToLower()) {
        'a' {
            Write-Host "`n=== 快速配置模式 ===" -ForegroundColor Green
            
            # 执行清理
            Write-Host "执行初始清理..." -ForegroundColor Blue
            $cleanupScript = Join-Path $ScriptDir "auto-cleanup.ps1"
            if (Test-Path $cleanupScript) {
                & powershell -ExecutionPolicy Bypass -File $cleanupScript -CleanupNow
                Write-Host "✓ 清理完成" -ForegroundColor Green
            }
            
            Write-Host "`n=== 配置完成 ===" -ForegroundColor Cyan
            Write-Host "推荐的清理命令:" -ForegroundColor Green
            Write-Host "• .\scripts\auto-cleanup.ps1 -CleanupNow    # 立即清理"
            Write-Host "• .\scripts\auto-cleanup.ps1 -Watch         # 监控模式"
            Write-Host "• .\scripts\auto-cleanup.bat cleanup-now    # 批处理方式"
            
            $response = Read-Host "`n是否立即启动监控模式? [y/N]"
            if ($response -match "^[Yy]$") {
                Write-Host "启动监控模式..." -ForegroundColor Green
                & powershell -ExecutionPolicy Bypass -File $cleanupScript -Watch
            }
            return
        }
        
        'b' {
            Write-Host "`n=== 自定义配置模式 ===" -ForegroundColor Green
            
            # 清理选项
            Write-Host "选择清理选项:"
            Write-Host "1) 仅清理日志文件"
            Write-Host "2) 清理临时文件"
            Write-Host "3) 清理构建缓存"
            Write-Host "4) 完整清理"
            $cleanOption = Read-Host "选择 [1-4]"
            
            # 监控设置
            $enableWatch = Read-Host "启用文件监控? [Y/n]"
            
            if ($enableWatch -notmatch "^[Nn]$") {
                $watchInterval = Read-Host "监控间隔(秒) [5]"
                if ([string]::IsNullOrEmpty($watchInterval)) { $watchInterval = 5 }
                
                $cleanupDelay = Read-Host "清理延迟(秒) [30]"
                if ([string]::IsNullOrEmpty($cleanupDelay)) { $cleanupDelay = 30 }
            }
            
            Write-Host "`n应用自定义配置..." -ForegroundColor Blue
            
            # 执行清理
            $cleanupScript = Join-Path $ScriptDir "auto-cleanup.ps1"
            if (Test-Path $cleanupScript) {
                & powershell -ExecutionPolicy Bypass -File $cleanupScript -CleanupNow
                Write-Host "✓ 清理完成" -ForegroundColor Green
            }
            
            if ($enableWatch -notmatch "^[Nn]$") {
                Write-Host "启动监控模式..." -ForegroundColor Green
                & powershell -ExecutionPolicy Bypass -File $cleanupScript -Watch
            }
            return
        }
        
        'c' {
            Write-Host "`n=== 启动监控模式 ===" -ForegroundColor Green
            $cleanupScript = Join-Path $ScriptDir "auto-cleanup.ps1"
            if (Test-Path $cleanupScript) {
                Write-Host "启动文件监控..." -ForegroundColor Blue
                & powershell -ExecutionPolicy Bypass -File $cleanupScript -Watch
            } else {
                Write-Host "找不到监控脚本" -ForegroundColor Red
            }
            return
        }
        
        'd' {
            Write-Host "`n=== 立即清理 ===" -ForegroundColor Green
            $cleanupScript = Join-Path $ScriptDir "auto-cleanup.ps1"
            if (Test-Path $cleanupScript) {
                & powershell -ExecutionPolicy Bypass -File $cleanupScript -CleanupNow
                Write-Host "✓ 清理完成" -ForegroundColor Green
            } else {
                Write-Host "找不到清理脚本，尝试基础清理..." -ForegroundColor Yellow
                $basicScript = Join-Path $ProjectRoot "cleanup.ps1"
                if (Test-Path $basicScript) {
                    & powershell -ExecutionPolicy Bypass -File $basicScript
                }
            }
            return
        }
        
        'e' {
            Write-Host "`n=== 使用说明 ===" -ForegroundColor Cyan
            Write-Host @"

📖 PowerShell清理工具使用说明:

🔧 基础清理:
  .\cleanup.ps1                    # 标准清理
  .\cleanup.ps1 -DryRun            # 预览清理内容

⚡ 快速清理:
  .\scripts\quick-clean.ps1        # 快速清理

🤖 自动监控清理:
  .\scripts\auto-cleanup.ps1 -CleanupNow    # 立即清理
  .\scripts\auto-cleanup.ps1 -Watch         # 监控模式
  .\scripts\auto-cleanup.ps1 -Daemon        # 后台服务

🖥️ 批处理包装器:
  .\scripts\auto-cleanup.bat cleanup-now    # 立即清理
  .\scripts\auto-cleanup.bat watch          # 监控模式
  .\scripts\auto-cleanup.bat daemon         # 后台服务

执行策略设置:
如果遇到执行策略限制，请以管理员身份运行:
  Set-ExecutionPolicy RemoteSigned

或者使用批处理包装器，无需修改执行策略。

"@
            Read-Host "按Enter继续"
        }
        
        'q' {
            Write-Host "退出配置" -ForegroundColor Yellow
            exit 0
        }
        
        default {
            Write-Host "无效选择，请重新输入" -ForegroundColor Red
        }
    }
} while ($true)

Write-Host "`n=== 配置完成 ===" -ForegroundColor Green
Write-Host "感谢使用Jekyll自动清理系统！" -ForegroundColor Cyan
Write-Host "`n更多帮助信息:"
Write-Host "• 查看完整文档: Get-Content .\scripts\README.md"
Write-Host "• 快速配置: .\scripts\setup-auto-cleanup.ps1 -QuickSetup"
Write-Host "• 显示帮助: .\scripts\setup-auto-cleanup.ps1 -Help"
