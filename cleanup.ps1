# Project Cleanup Script - PowerShell Version
# Usage: .\cleanup.ps1 [Options]
# Options: -Deep (Deep clean), -DryRun (Preview only)

param(
    [switch]$DryRun,
    [switch]$Deep,
    [switch]$Help
)

# Show help
if ($Help) {
    Write-Host "Project Cleanup Script - Keep Directory Clean" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\cleanup.ps1 [Options]" -ForegroundColor White
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Yellow
    Write-Host "  -DryRun     Preview files to be deleted"
    Write-Host "  -Deep       Deep clean including build cache"
    Write-Host "  -Help       Show this help"
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Green
    Write-Host "  .\cleanup.ps1                 # Standard cleanup"
    Write-Host "  .\cleanup.ps1 -DryRun         # Preview cleanup"
    Write-Host "  .\cleanup.ps1 -Deep           # Deep cleanup"
    exit 0
}

# Print functions
function Write-Header {
    Write-Host "================================" -ForegroundColor Blue
    Write-Host "Jekyll Project Cleanup Tool" -ForegroundColor Blue
    Write-Host "================================" -ForegroundColor Blue
    Write-Host ""
}

function Write-Section {
    param($Message)
    Write-Host $Message -ForegroundColor Yellow
}

function Write-Success {
    param($Message)
    Write-Host "OK $Message" -ForegroundColor Green
}

function Write-Warning {
    param($Message)
    Write-Host "WARN $Message" -ForegroundColor Yellow
}

# Remove file/directory function
function Remove-IfExists {
    param(
        [string]$Path,
        [string]$Description
    )
    
    if (Test-Path $Path) {
        if ($DryRun) {
            Write-Host "  [DRY-RUN] Will delete: $Path ($Description)" -ForegroundColor Cyan
        } else {
            Remove-Item $Path -Recurse -Force -ErrorAction SilentlyContinue
            Write-Host "  Deleted: $Path ($Description)"
        }
        return $true
    }
    return $false
}

# Main cleanup function
function Start-Cleanup {
    Write-Header
    
    if ($DryRun) {
        Write-Warning "Preview mode - showing files to be deleted"
        Write-Host ""
    }
    
    if ($Deep) {
        Write-Warning "Deep clean mode - will delete build cache"
        Write-Host ""
    }
    
    # Check if in correct directory
    if (-not (Test-Path "_config.yml")) {
        Write-Host "ERROR: Not in Jekyll project root directory" -ForegroundColor Red
        Write-Host "Please run this script in directory containing _config.yml"
        exit 1
    }
    
    # Cleanup reports and logs
    Write-Section "Cleaning reports and logs"
    $count = 0
    
    $patterns = @(
        "*_REPORT.md", "*_LOG*.md", "*_COMPLETE*.md", "*_FIX*.md", "*_SUMMARY*.md",
        "PROJECT_CLEANUP_*.md", "LIQUID_SYNTAX_*.md", "GALLERY_*_REPORT.md",
        "WEBSITE_*_REPORT.md", "OPTIMIZATION_*.md", "IMPLEMENTATION_*.md"
    )
    
    foreach ($pattern in $patterns) {
        $files = Get-ChildItem -Name $pattern -ErrorAction SilentlyContinue
        foreach ($file in $files) {
            if ($file -ne "README.md") {
                if (Remove-IfExists $file "report") { $count++ }
            }
        }
    }
    
    $specificFiles = @(
        "FILE_CLASSIFICATION_SUMMARY.md", "PROJECT_CLEANUP_PLAN.md", "GITHUB_PAGES_FIX_SUMMARY.md"
    )
    
    foreach ($file in $specificFiles) {
        if (Remove-IfExists $file "document") { $count++ }
    }
    
    if ($count -eq 0) {
        Write-Host "  No report files found"
    } else {
        Write-Success "Cleaned $count report files"
    }
    Write-Host ""
    
    # Cleanup test files
    Write-Section "Cleaning test and debug files"
    $count = 0
    
    $testPatterns = @(
        "*test*.html", "*debug*.html", "*demo*.html", "*preview*.html",
        "*validate*.html", "*simple*.html", "gallery-test-*.html"
    )
    
    foreach ($pattern in $testPatterns) {
        $files = Get-ChildItem -Name $pattern -ErrorAction SilentlyContinue
        foreach ($file in $files) {
            if ($file -ne "index.html") {
                if (Remove-IfExists $file "test") { $count++ }
            }
        }
    }
    
    $testDirs = @("_test-pages", "_backup", "backup", "test", "tests")
    foreach ($dir in $testDirs) {
        if (Remove-IfExists $dir "test directory") { $count++ }
    }
    
    if ($count -eq 0) {
        Write-Host "  No test files found"
    } else {
        Write-Success "Cleaned $count test files"
    }
    Write-Host ""
    
    # Cleanup temp files
    Write-Section "Cleaning temporary files"
    $count = 0
    
    $tempPatterns = @("*.tmp", "*.bak", "*.swp", "*.swo", "*~", "*.orig", ".DS_Store", "Thumbs.db")
    
    foreach ($pattern in $tempPatterns) {
        $files = Get-ChildItem -Name $pattern -ErrorAction SilentlyContinue
        foreach ($file in $files) {
            if (Remove-IfExists $file "temp") { $count++ }
        }
    }
    
    $tempDirs = @(".tmp", "tmp", ".cache")
    foreach ($dir in $tempDirs) {
        if (Remove-IfExists $dir "temp directory") { $count++ }
    }
    
    if ($count -eq 0) {
        Write-Host "  No temp files found"
    } else {
        Write-Success "Cleaned $count temp files"
    }
    Write-Host ""
    
    # Deep cleanup
    if ($Deep) {
        Write-Section "Deep cleaning build cache"
        $count = 0
        
        $buildItems = @("_site", ".sass-cache", ".jekyll-cache", ".jekyll-metadata", ".bundle", "vendor", "node_modules")
        
        foreach ($item in $buildItems) {
            if (Remove-IfExists $item "build cache") { $count++ }
        }
        
        if (-not $DryRun) {
            Write-Warning "Note: Keeping Gemfile.lock for deployment compatibility"
        }
        
        if ($count -eq 0) {
            Write-Host "  No build cache found"
        } else {
            Write-Success "Cleaned $count build cache items"
        }
        Write-Host ""
    }
    
    # Summary
    Write-Section "Cleanup Summary"
    $totalFiles = (Get-ChildItem -Recurse -File | Measure-Object).Count
    $totalDirs = (Get-ChildItem -Recurse -Directory | Measure-Object).Count
    
    Write-Host "  Current files: $totalFiles"
    Write-Host "  Current directories: $totalDirs"
    
    if ($DryRun) {
        Write-Warning "This was preview mode - no files were deleted"
        Write-Host "  Run .\cleanup.ps1 to perform actual cleanup"
    } else {
        Write-Success "Project cleanup completed!"
        Write-Host "  Suggest: git add . && git commit -m 'Clean project files'"
    }
}

# Run main function
Start-Cleanup
