# auto-cleanup-simple.ps1 - Simple Auto Cleanup Script (PowerShell)
# Automatically clean related logs and temporary files after modifications

param(
    [switch]$Watch,
    [switch]$CleanupNow,
    [switch]$DryRun,
    [switch]$Daemon,
    [switch]$Stop,
    [switch]$Status,
    [switch]$Help
)

# Configuration
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$LogFile = Join-Path $ProjectRoot ".auto-cleanup.log"
$PidFile = Join-Path $ProjectRoot ".auto-cleanup.pid"

# File patterns to clean
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
    "*.pid",
    "*.lock.tmp"
)

# Logging function
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

# Show help
function Show-Help {
    Write-Host @"
Auto Cleanup Script - Monitor file changes and automatically clean temporary files

Usage: .\auto-cleanup-simple.ps1 [Options]

Options:
  -Watch             Start monitoring mode, continuously monitor file changes
  -CleanupNow        Execute cleanup immediately
  -DryRun            Preview mode, show files to be cleaned but don't delete
  -Daemon            Run as background service
  -Stop              Stop background service
  -Status            Show background service status
  -Help              Show this help information

Examples:
  .\auto-cleanup-simple.ps1 -CleanupNow    # Clean immediately
  .\auto-cleanup-simple.ps1 -Watch         # Start monitoring mode
  .\auto-cleanup-simple.ps1 -DryRun        # Preview mode

Log file: $LogFile
"@
}

# Cleanup function
function Start-Cleanup {
    param([bool]$DryRunMode = $false)
    
    Write-Log "Starting cleanup of temporary files..." "INFO"
    
    $cleanedCount = 0
    Set-Location $ProjectRoot
    
    foreach ($pattern in $CleanupPatterns) {
        try {
            $files = Get-ChildItem -Path . -Filter $pattern -Recurse -Force -ErrorAction SilentlyContinue
            
            foreach ($file in $files) {
                # Skip .git directory
                if ($file.FullName -match "\.git\\") { continue }
                
                if ($DryRunMode) {
                    Write-Log "Would delete: $($file.FullName)" "INFO"
                } else {
                    try {
                        if ($file.PSIsContainer) {
                            Remove-Item -Path $file.FullName -Recurse -Force -ErrorAction SilentlyContinue
                        } else {
                            Remove-Item -Path $file.FullName -Force -ErrorAction SilentlyContinue
                        }
                        Write-Log "Deleted: $($file.FullName)" "INFO"
                    } catch {
                        Write-Log "Failed to delete: $($file.FullName) - $($_.Exception.Message)" "WARNING"
                    }
                }
                $cleanedCount++
            }
        } catch {
            Write-Log "Error processing pattern '$pattern': $($_.Exception.Message)" "WARNING"
        }
    }
    
    if ($DryRunMode) {
        Write-Log "Preview mode: Found $cleanedCount files/directories that can be cleaned" "INFO"
    } else {
        Write-Log "Cleanup completed: Deleted $cleanedCount files/directories" "SUCCESS"
    }
}

# Start file watcher
function Start-FileWatcher {
    Write-Log "Starting file monitoring mode..." "INFO"
    
    $watcher = New-Object System.IO.FileSystemWatcher
    $watcher.Path = $ProjectRoot
    $watcher.IncludeSubdirectories = $true
    $watcher.EnableRaisingEvents = $true
    
    $action = {
        $path = $Event.SourceEventArgs.FullPath
        $changeType = $Event.SourceEventArgs.ChangeType
        
        # Check if should exclude this path
        $shouldExclude = $false
        $excludePatterns = @("\.git", "_site", "\.jekyll-cache", "\.sass-cache", "node_modules")
        foreach ($pattern in $excludePatterns) {
            if ($path -match $pattern) {
                $shouldExclude = $true
                break
            }
        }
        
        if (-not $shouldExclude) {
            Write-Log "Detected file change: $changeType $path" "INFO"
            Start-Sleep -Seconds 30
            Start-Cleanup $false
        }
    }
    
    Register-ObjectEvent -InputObject $watcher -EventName "Created" -Action $action
    Register-ObjectEvent -InputObject $watcher -EventName "Changed" -Action $action
    Register-ObjectEvent -InputObject $watcher -EventName "Deleted" -Action $action
    Register-ObjectEvent -InputObject $watcher -EventName "Renamed" -Action $action
    
    try {
        Write-Log "File monitoring started, press Ctrl+C to stop..." "INFO"
        while ($true) {
            Start-Sleep -Seconds 1
        }
    } finally {
        $watcher.EnableRaisingEvents = $false
        $watcher.Dispose()
        Get-EventSubscriber | Unregister-Event
        Write-Log "File monitoring stopped" "INFO"
    }
}

# Main function
function Main {
    # Ensure we're in a Jekyll project directory
    if (-not (Test-Path (Join-Path $ProjectRoot "_config.yml"))) {
        Write-Log "Please run this script in a Jekyll project root directory" "ERROR"
        exit 1
    }
    
    # Create log file
    if (-not (Test-Path $LogFile)) {
        New-Item -Path $LogFile -ItemType File -Force | Out-Null
    }
    
    # Parse arguments
    if ($Help) {
        Show-Help
    } elseif ($CleanupNow) {
        Write-Log "Executing immediate cleanup..." "INFO"
        Start-Cleanup $false
    } elseif ($DryRun) {
        Write-Log "Executing preview cleanup..." "INFO"
        Start-Cleanup $true
    } elseif ($Watch) {
        Start-FileWatcher
    } elseif ($Daemon) {
        Write-Log "Daemon mode not implemented yet, using watch mode instead" "INFO"
        Start-FileWatcher
    } elseif ($Stop) {
        Write-Log "Stop function not implemented yet" "INFO"
    } elseif ($Status) {
        Write-Log "Status function not implemented yet" "INFO"
    } else {
        Write-Log "Executing standard cleanup..." "INFO"
        Start-Cleanup $false
    }
}

# Run main function
Main
