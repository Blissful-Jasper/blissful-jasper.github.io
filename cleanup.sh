#!/bin/bash
# 项目清理脚本 - 保持目录干净整洁
# 使用方法: ./cleanup.sh [选项]
# 选项: --deep (深度清理), --dry-run (仅显示将要删除的文件)

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置选项
DRY_RUN=false
DEEP_CLEAN=false

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --deep)
            DEEP_CLEAN=true
            shift
            ;;
        -h|--help)
            echo "项目清理脚本 - 保持目录干净整洁"
            echo ""
            echo "使用方法: $0 [选项]"
            echo ""
            echo "选项:"
            echo "  --dry-run    仅显示将要删除的文件，不实际删除"
            echo "  --deep       深度清理，包括缓存和构建文件"
            echo "  -h, --help   显示此帮助信息"
            echo ""
            echo "示例:"
            echo "  $0                 # 标准清理"
            echo "  $0 --dry-run       # 预览清理内容"
            echo "  $0 --deep          # 深度清理"
            exit 0
            ;;
        *)
            echo -e "${RED}错误: 未知选项 $1${NC}"
            echo "使用 $0 --help 查看帮助"
            exit 1
            ;;
    esac
done

# 打印函数
print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}🧹 Jekyll 项目清理工具${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
}

print_section() {
    echo -e "${YELLOW}$1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 删除文件/目录函数
remove_if_exists() {
    local path="$1"
    local description="$2"
    
    if [[ -e "$path" ]]; then
        if [[ "$DRY_RUN" == "true" ]]; then
            echo "  [DRY-RUN] 将删除: $path ($description)"
        else
            rm -rf "$path"
            echo "  删除: $path ($description)"
        fi
        return 0
    else
        return 1
    fi
}

# 清理函数
cleanup_logs_and_reports() {
    print_section "🗑️  清理日志和报告文件"
    local count=0
    
    # 清理各种报告文件
    local patterns=(
        "*_REPORT.md"
        "*_LOG*.md"
        "*_COMPLETE*.md"
        "*_FIX*.md"
        "*_SUMMARY*.md"
        "PROJECT_CLEANUP_*.md"
        "LIQUID_SYNTAX_*.md"
        "GALLERY_*_REPORT.md"
        "WEBSITE_*_REPORT.md"
        "OPTIMIZATION_*.md"
        "IMPLEMENTATION_*.md"
        "TROUBLESHOOTING_*.md"
        "DIAGNOSTIC_*.md"
        "VALIDATION_*.md"
    )
    
    for pattern in "${patterns[@]}"; do
        for file in $pattern; do
            if [[ -f "$file" && "$file" != "README.md" ]]; then
                if remove_if_exists "$file" "开发报告"; then
                    ((count++))
                fi
            fi
        done
    done
    
    # 清理特定的报告文件
    local specific_files=(
        "FILE_CLASSIFICATION_SUMMARY.md"
        "PROJECT_CLEANUP_PLAN.md"
        "GITHUB_PAGES_FIX_SUMMARY.md"
    )
    
    for file in "${specific_files[@]}"; do
        if remove_if_exists "$file" "项目文档"; then
            ((count++))
        fi
    done
    
    if [[ $count -eq 0 ]]; then
        echo "  没有找到需要清理的报告文件"
    else
        print_success "清理了 $count 个报告文件"
    fi
}

cleanup_test_files() {
    print_section "🧪 清理测试和调试文件"
    local count=0
    
    # 测试HTML文件
    local test_patterns=(
        "*test*.html"
        "*debug*.html"
        "*demo*.html"
        "*preview*.html"
        "*validate*.html"
        "*simple*.html"
        "gallery-test-*.html"
        "static-image-*.html"
    )
    
    for pattern in "${test_patterns[@]}"; do
        for file in $pattern; do
            if [[ -f "$file" && "$file" != "index.html" ]]; then
                if remove_if_exists "$file" "测试文件"; then
                    ((count++))
                fi
            fi
        done
    done
    
    # 测试目录
    local test_dirs=(
        "_test-pages"
        "_backup"
        "backup"
        "test"
        "tests"
    )
    
    for dir in "${test_dirs[@]}"; do
        if remove_if_exists "$dir" "测试目录"; then
            ((count++))
        fi
    done
    
    if [[ $count -eq 0 ]]; then
        echo "  没有找到需要清理的测试文件"
    else
        print_success "清理了 $count 个测试文件/目录"
    fi
}

cleanup_temp_files() {
    print_section "🗂️  清理临时文件"
    local count=0
    
    # 临时文件模式
    local temp_patterns=(
        "*.tmp"
        "*.bak"
        "*.swp"
        "*.swo"
        "*~"
        "*.orig"
        "*.rej"
        ".DS_Store"
        "Thumbs.db"
    )
    
    for pattern in "${temp_patterns[@]}"; do
        for file in $pattern; do
            if [[ -f "$file" ]]; then
                if remove_if_exists "$file" "临时文件"; then
                    ((count++))
                fi
            fi
        done
    done
    
    # 临时目录
    local temp_dirs=(
        ".tmp"
        "tmp"
        ".cache"
    )
    
    for dir in "${temp_dirs[@]}"; do
        if remove_if_exists "$dir" "临时目录"; then
            ((count++))
        fi
    done
    
    if [[ $count -eq 0 ]]; then
        echo "  没有找到需要清理的临时文件"
    else
        print_success "清理了 $count 个临时文件/目录"
    fi
}

cleanup_build_cache() {
    print_section "🏗️  清理构建缓存 (深度清理)"
    local count=0
    
    if [[ "$DEEP_CLEAN" == "true" ]]; then
        # Jekyll 构建文件
        local build_items=(
            "_site"
            ".sass-cache"
            ".jekyll-cache"
            ".jekyll-metadata"
            ".bundle"
            "vendor"
            "node_modules"
        )
        
        for item in "${build_items[@]}"; do
            if remove_if_exists "$item" "构建缓存"; then
                ((count++))
            fi
        done
        
        # Gemfile.lock (如果需要重新生成)
        if [[ "$DRY_RUN" == "false" ]]; then
            print_warning "注意: 保留 Gemfile.lock 用于部署兼容性"
        fi
        
        if [[ $count -eq 0 ]]; then
            echo "  没有找到需要清理的构建缓存"
        else
            print_success "清理了 $count 个构建缓存项"
        fi
    else
        echo "  跳过构建缓存清理 (使用 --deep 选项启用)"
    fi
}

cleanup_logs() {
    print_section "📝 清理日志目录"
    local count=0
    
    # 日志目录
    local log_dirs=(
        "logs"
        "_logs"
        ".logs"
    )
    
    for dir in "${log_dirs[@]}"; do
        if remove_if_exists "$dir" "日志目录"; then
            ((count++))
        fi
    done
    
    # 日志文件
    local log_patterns=(
        "*.log"
        "npm-debug.log*"
        "yarn-debug.log*"
        "yarn-error.log*"
    )
    
    for pattern in "${log_patterns[@]}"; do
        for file in $pattern; do
            if [[ -f "$file" ]]; then
                if remove_if_exists "$file" "日志文件"; then
                    ((count++))
                fi
            fi
        done
    done
    
    if [[ $count -eq 0 ]]; then
        echo "  没有找到需要清理的日志文件"
    else
        print_success "清理了 $count 个日志项"
    fi
}

update_gitignore() {
    print_section "📋 更新 .gitignore"
    
    if [[ "$DRY_RUN" == "true" ]]; then
        echo "  [DRY-RUN] 将检查并更新 .gitignore"
        return
    fi
    
    # 确保 .gitignore 包含清理规则
    local gitignore_rules=(
        "# 自动清理的文件类型"
        "*_REPORT.md"
        "*_LOG*.md"
        "*_COMPLETE*.md"
        "*_FIX*.md"
        "*test*.html"
        "*debug*.html"
        "*demo*.html"
        "_test-pages/"
        "_backup/"
        "backup/"
        "*.tmp"
        "*.bak"
        "*~"
    )
    
    local added=false
    for rule in "${gitignore_rules[@]}"; do
        if ! grep -q "^$rule$" .gitignore 2>/dev/null; then
            echo "$rule" >> .gitignore
            added=true
        fi
    done
    
    if [[ "$added" == "true" ]]; then
        print_success "更新了 .gitignore 规则"
    else
        echo "  .gitignore 已是最新"
    fi
}

show_summary() {
    print_section "📊 清理总结"
    
    # 统计当前文件数量
    local total_files=$(find . -type f | wc -l)
    local total_dirs=$(find . -type d | wc -l)
    
    echo "  当前文件数量: $total_files"
    echo "  当前目录数量: $total_dirs"
    
    if [[ "$DRY_RUN" == "true" ]]; then
        print_warning "这是预览模式，没有实际删除文件"
        echo "  运行 $(basename $0) 执行实际清理"
    else
        print_success "项目清理完成!"
        echo "  建议运行: git add . && git commit -m '清理项目文件'"
    fi
}

# 主函数
main() {
    print_header
    
    if [[ "$DRY_RUN" == "true" ]]; then
        print_warning "预览模式 - 仅显示将要删除的文件"
        echo ""
    fi
    
    if [[ "$DEEP_CLEAN" == "true" ]]; then
        print_warning "深度清理模式 - 将删除构建缓存"
        echo ""
    fi
    
    # 检查是否在正确的目录
    if [[ ! -f "_config.yml" ]]; then
        print_error "错误: 当前目录不是 Jekyll 项目根目录"
        echo "请在包含 _config.yml 的目录中运行此脚本"
        exit 1
    fi
    
    # 执行清理
    cleanup_logs_and_reports
    echo ""
    
    cleanup_test_files
    echo ""
    
    cleanup_temp_files
    echo ""
    
    cleanup_logs
    echo ""
    
    cleanup_build_cache
    echo ""
    
    update_gitignore
    echo ""
    
    show_summary
}

# 运行主函数
main "$@"
