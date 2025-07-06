# auto-cleanup.ps1 - 自动清理脚本 (PowerShell版本)
# 在文件修改后自动清理相关日志和临时文件

param(
    [switch]$Watch,
    [switch]$CleanupNow,
    [switch]$DryRun,
    [switch]$Daemon,
    [switch]$Stop,
    [switch]$Status,
    [switch]$Help
)

# 配置
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$LogFile = Join-Path $ProjectRoot ".auto-cleanup.log"
$PidFile = Join-Path $ProjectRoot ".auto-cleanup.pid"
$WatchInterval = 5  # 监控间隔（秒）
$CleanupDelay = 30  # 文件修改后等待时间（秒）

# 需要清理的文件类型和模式
$CleanupPatterns = @(
    "*.log",
    "*.tmp",
    "*~",
    ".DS_Store",
    "Thumbs.db",
    "*.swp",
    "*.swo",
    ".jekyll-metadata",
    "_site\*",
    ".sass-cache\*",
    ".jekyll-cache\*",
    "node_modules\.cache\*",
    "*.pid",
    "*.lock.tmp",
    ".bundle\cache\*"
)

# 日志函数
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "$timestamp [$Level] $Message"
    
    switch ($Level) {
        "ERROR" { Write-Host $logMessage -ForegroundColor Red }
        "WARNING" { Write-Host $logMessage -ForegroundColor Yellow }
        "SUCCESS" { Write-Host $logMessage -ForegroundColor Green }
        "INFO" { Write-Host $logMessage -ForegroundColor Blue }
        default { Write-Host $logMessage }
    }
    
    Add-Content -Path $LogFile -Value $logMessage -Encoding UTF8
}

# 显示帮助信息
function Show-Help {
    Write-Host @"
自动清理脚本 - 监控文件变化并自动清理临时文件

用法: .\auto-cleanup.ps1 [选项]

选项:
  -Watch             启动监控模式，持续监控文件变化
  -CleanupNow        立即执行一次清理
  -DryRun            预览模式，显示将要清理的文件但不删除
  -Daemon            作为后台服务运行
  -Stop              停止后台服务
  -Status            显示后台服务状态
  -Help              显示此帮助信息

示例:
  .\auto-cleanup.ps1 -CleanupNow    # 立即清理一次
  .\auto-cleanup.ps1 -Watch         # 启动监控模式
  .\auto-cleanup.ps1 -Daemon        # 作为后台服务运行
  .\auto-cleanup.ps1 -Stop          # 停止后台服务

配置:
  监控间隔: $WatchInterval 秒
  清理延迟: $CleanupDelay 秒
  日志文件: $LogFile
"@
}

# 清理函数
function Start-Cleanup {
    param([bool]$DryRunMode = $false)
    
    Write-Log "开始清理临时文件..." "INFO"
    
    $cleanedCount = 0
    Set-Location $ProjectRoot
    
    foreach ($pattern in $CleanupPatterns) {
        try {
            $files = Get-ChildItem -Path . -Filter $pattern -Recurse -Force -ErrorAction SilentlyContinue
            
            foreach ($file in $files) {
                # 跳过 .git 目录
                if ($file.FullName -match "\.git\\") { continue }
                
                if ($DryRunMode) {
                    Write-Log "将删除: $($file.FullName)" "INFO"
                } else {
                    try {
                        if ($file.PSIsContainer) {
                            Remove-Item -Path $file.FullName -Recurse -Force -ErrorAction SilentlyContinue
                        } else {
                            Remove-Item -Path $file.FullName -Force -ErrorAction SilentlyContinue
                        }
                        Write-Log "已删除: $($file.FullName)" "INFO"
                    } catch {
                        Write-Log "删除失败: $($file.FullName) - $($_.Exception.Message)" "WARNING"
                    }
                }
                $cleanedCount++
            }
        } catch {
            Write-Log "处理模式 '$pattern' 时出错: $($_.Exception.Message)" "WARNING"
        }
    }
    
    # 清理空目录
    if (-not $DryRunMode) {
        try {
            Get-ChildItem -Path . -Directory -Recurse | 
                Where-Object { $_.FullName -notmatch "\.git\\" -and (Get-ChildItem -Path $_.FullName -Force | Measure-Object).Count -eq 0 } |
                Remove-Item -Force -ErrorAction SilentlyContinue
        } catch {
            Write-Log "清理空目录时出错: $($_.Exception.Message)" "WARNING"
        }
    }
    
    if ($DryRunMode) {
        Write-Log "预览模式：发现 $cleanedCount 个文件/目录可以清理" "INFO"
    } else {
        Write-Log "清理完成：删除了 $cleanedCount 个文件/目录" "SUCCESS"
    }
}

# 获取后台服务PID
function Get-DaemonPid {
    if (Test-Path $PidFile) {
        try {
            $pid = Get-Content $PidFile -ErrorAction SilentlyContinue
            if ($pid -and (Get-Process -Id $pid -ErrorAction SilentlyContinue)) {
                return $pid
            } else {
                Remove-Item $PidFile -Force -ErrorAction SilentlyContinue
            }
        } catch {
            Remove-Item $PidFile -Force -ErrorAction SilentlyContinue
        }
    }
    return $null
}

# 停止后台服务
function Stop-Daemon {
    $pid = Get-DaemonPid
    if ($pid) {
        Write-Log "停止后台服务 (PID: $pid)..." "INFO"
        try {
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            Start-Sleep -Seconds 2
            Remove-Item $PidFile -Force -ErrorAction SilentlyContinue
            Write-Log "后台服务已停止" "SUCCESS"
            return $true
        } catch {
            Write-Log "停止后台服务失败: $($_.Exception.Message)" "ERROR"
            return $false
        }
    } else {
        Write-Log "后台服务未运行" "WARNING"
        return $false
    }
}

# 显示后台服务状态
function Show-Status {
    $pid = Get-DaemonPid
    if ($pid) {
        Write-Log "后台服务正在运行 (PID: $pid)" "INFO"
        Write-Log "日志文件: $LogFile" "INFO"
        return $true
    } else {
        Write-Log "后台服务未运行" "INFO"
        return $false
    }
}

# 监控文件变化
function Start-FileWatcher {
    Write-Log "启动文件监控模式..." "INFO"
    
    $lastCheck = Get-Date
    $watcher = New-Object System.IO.FileSystemWatcher
    $watcher.Path = $ProjectRoot
    $watcher.IncludeSubdirectories = $true
    $watcher.EnableRaisingEvents = $true
    
    # 排除不需要监控的目录
    $excludePatterns = @("\.git", "_site", "\.jekyll-cache", "\.sass-cache", "node_modules")
    
    $action = {
        $path = $Event.SourceEventArgs.FullPath
        $changeType = $Event.SourceEventArgs.ChangeType
        
        # 检查是否应该排除此路径
        $shouldExclude = $false
        foreach ($pattern in $excludePatterns) {
            if ($path -match $pattern) {
                $shouldExclude = $true
                break
            }
        }
        
        if (-not $shouldExclude) {
            Write-Log "检测到文件变化: $changeType $path" "INFO"
            
            # 等待一段时间，避免频繁清理
            Start-Sleep -Seconds $CleanupDelay
            
            # 执行清理
            Start-Cleanup $false
        }
    }
    
    Register-ObjectEvent -InputObject $watcher -EventName "Created" -Action $action
    Register-ObjectEvent -InputObject $watcher -EventName "Changed" -Action $action
    Register-ObjectEvent -InputObject $watcher -EventName "Deleted" -Action $action
    Register-ObjectEvent -InputObject $watcher -EventName "Renamed" -Action $action
    
    try {
        Write-Log "文件监控已启动，按 Ctrl+C 停止..." "INFO"
        while ($true) {
            Start-Sleep -Seconds 1
        }
    } finally {
        $watcher.EnableRaisingEvents = $false
        $watcher.Dispose()
        Get-EventSubscriber | Unregister-Event
        Write-Log "文件监控已停止" "INFO"
    }
}

# 启动后台服务
function Start-Daemon {
    $pid = Get-DaemonPid
    if ($pid) {
        Write-Log "后台服务已在运行 (PID: $pid)" "WARNING"
        return $false
    }
    
    Write-Log "启动自动清理后台服务..." "INFO"
    
    try {
        # 创建新的PowerShell进程作为后台服务
        $scriptBlock = {
            param($ProjectRoot, $LogFile, $PidFile, $WatchInterval, $CleanupDelay, $CleanupPatterns)
            
            # 记录PID
            $PID | Out-File -FilePath $PidFile -Encoding UTF8
            
            # 监控循环
            $lastCheck = Get-Date
            while ($true) {
                $currentTime = Get-Date
                
                # 检查最近修改的文件
                $recentFiles = Get-ChildItem -Path $ProjectRoot -Recurse -File | 
                    Where-Object { 
                        $_.LastWriteTime -gt $lastCheck -and
                        $_.FullName -notmatch "\.git\\" -and
                        $_.FullName -notmatch "_site\\" -and
                        $_.FullName -notmatch "\.jekyll-cache\\" -and
                        $_.FullName -notmatch "\.sass-cache\\" -and
                        $_.FullName -notmatch "node_modules\\"
                    } | Select-Object -First 10
                
                if ($recentFiles) {
                    Add-Content -Path $LogFile -Value "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') [INFO] 检测到文件修改" -Encoding UTF8
                    Start-Sleep -Seconds $CleanupDelay
                    
                    # 执行清理（简化版）
                    $cleanedCount = 0
                    foreach ($pattern in $CleanupPatterns) {
                        $files = Get-ChildItem -Path $ProjectRoot -Filter $pattern -Recurse -Force -ErrorAction SilentlyContinue
                        foreach ($file in $files) {
                            if ($file.FullName -notmatch "\.git\\") {
                                Remove-Item -Path $file.FullName -Force -Recurse -ErrorAction SilentlyContinue
                                $cleanedCount++
                            }
                        }
                    }
                    Add-Content -Path $LogFile -Value "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') [SUCCESS] 清理完成：删除了 $cleanedCount 个文件/目录" -Encoding UTF8
                }
                
                $lastCheck = $currentTime
                Start-Sleep -Seconds $WatchInterval
            }
        }
        
        $job = Start-Job -ScriptBlock $scriptBlock -ArgumentList $ProjectRoot, $LogFile, $PidFile, $WatchInterval, $CleanupDelay, $CleanupPatterns
        
        Start-Sleep -Seconds 2
        
        if ($job.State -eq "Running") {
            Write-Log "后台服务已启动 (Job ID: $($job.Id))" "SUCCESS"
            Write-Log "使用 '.\auto-cleanup.ps1 -Stop' 停止后台服务" "INFO"
            Write-Log "使用 '.\auto-cleanup.ps1 -Status' 查看状态" "INFO"
            return $true
        } else {
            Write-Log "后台服务启动失败" "ERROR"
            return $false
        }
    } catch {
        Write-Log "启动后台服务时出错: $($_.Exception.Message)" "ERROR"
        return $false
    }
}

# 主函数
function Main {
    # 确保在项目根目录
    if (-not (Test-Path (Join-Path $ProjectRoot "_config.yml"))) {
        Write-Log "请在Jekyll项目根目录运行此脚本" "ERROR"
        exit 1
    }
    
    # 创建日志文件
    if (-not (Test-Path $LogFile)) {
        New-Item -Path $LogFile -ItemType File -Force | Out-Null
    }
    
    # 解析参数
    if ($Help) {
        Show-Help
    } elseif ($CleanupNow) {
        Write-Log "执行立即清理..." "INFO"
        Start-Cleanup $false
    } elseif ($DryRun) {
        Write-Log "执行预览清理..." "INFO"
        Start-Cleanup $true
    } elseif ($Watch) {
        Start-FileWatcher
    } elseif ($Daemon) {
        Start-Daemon
    } elseif ($Stop) {
        Stop-Daemon
    } elseif ($Status) {
        Show-Status
    } else {
        Write-Log "Execute standard cleanup..." "INFO"
        Start-Cleanup $false
    }
}

# Run main function
Main
