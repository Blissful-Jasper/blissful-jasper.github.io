#!/bin/bash

# test-cleanup-system.sh - 测试自动清理系统的所有功能
# 创建测试文件并验证清理工具是否正常工作

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 获取脚本目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
TEST_DIR="$PROJECT_ROOT/.cleanup-test"

echo -e "${CYAN}=== 自动清理系统测试 ===${NC}"
echo

# 测试结果计数器
TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TESTS=0

# 测试函数
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_result="$3"  # "pass" or "fail"
    
    ((TOTAL_TESTS++))
    echo -e "${BLUE}测试 $TOTAL_TESTS: $test_name${NC}"
    
    if eval "$test_command" >/dev/null 2>&1; then
        if [[ "$expected_result" == "pass" ]]; then
            echo -e "${GREEN}  ✓ 通过${NC}"
            ((TESTS_PASSED++))
        else
            echo -e "${RED}  ✗ 失败 (期望失败但成功了)${NC}"
            ((TESTS_FAILED++))
        fi
    else
        if [[ "$expected_result" == "fail" ]]; then
            echo -e "${GREEN}  ✓ 通过 (期望失败)${NC}"
            ((TESTS_PASSED++))
        else
            echo -e "${RED}  ✗ 失败${NC}"
            ((TESTS_FAILED++))
        fi
    fi
}

# 创建测试环境
setup_test_environment() {
    echo -e "${BLUE}创建测试环境...${NC}"
    
    # 创建测试目录
    mkdir -p "$TEST_DIR"
    cd "$PROJECT_ROOT"
    
    # 创建各种测试文件
    echo "test log content" > "test.log"
    echo "temp file" > "temp.tmp"
    echo "backup file" > "backup.bak"
    echo "vim swap" > "test.swp"
    echo "emacs backup" > "test~"
    touch ".DS_Store"
    touch "Thumbs.db"
    echo "jekyll metadata" > ".jekyll-metadata"
    
    # 创建测试目录和文件
    mkdir -p "_site/test"
    echo "build output" > "_site/test/index.html"
    
    mkdir -p ".sass-cache/test"
    echo "sass cache" > ".sass-cache/test/style.css"
    
    mkdir -p ".jekyll-cache/test"
    echo "jekyll cache" > ".jekyll-cache/test/data"
    
    # 创建报告文件
    echo "test report" > "TEST_REPORT.md"
    echo "log file" > "DEBUG_LOG.md"
    echo "completion report" > "PROJECT_CLEANUP_COMPLETE.md"
    
    # 创建开发文件
    echo $$ > "test.pid"
    echo "lock file" > "test.lock.tmp"
    echo "debug info" > "debug.log"
    
    echo -e "${GREEN}测试环境创建完成${NC}"
    echo "创建的测试文件:"
    find . -maxdepth 2 -name "test*" -o -name "*.log" -o -name "*.tmp" -o -name "*.bak" | head -10
}

# 清理测试环境
cleanup_test_environment() {
    echo -e "${BLUE}清理测试环境...${NC}"
    
    # 删除测试文件
    rm -rf "$TEST_DIR" 2>/dev/null || true
    
    # 删除可能残留的测试文件
    find "$PROJECT_ROOT" -maxdepth 1 -name "test*" -delete 2>/dev/null || true
    find "$PROJECT_ROOT" -name "*.log" -not -path "*/.git/*" -delete 2>/dev/null || true
    find "$PROJECT_ROOT" -name "*.tmp" -delete 2>/dev/null || true
    find "$PROJECT_ROOT" -name "*.bak" -delete 2>/dev/null || true
    find "$PROJECT_ROOT" -name "*~" -delete 2>/dev/null || true
    find "$PROJECT_ROOT" -name ".DS_Store" -delete 2>/dev/null || true
    find "$PROJECT_ROOT" -name "Thumbs.db" -delete 2>/dev/null || true
    find "$PROJECT_ROOT" -name "*.pid" -delete 2>/dev/null || true
    
    echo -e "${GREEN}测试环境清理完成${NC}"
}

# 测试基础清理脚本
test_basic_cleanup() {
    echo -e "\n${CYAN}=== 测试基础清理脚本 ===${NC}"
    
    setup_test_environment
    
    # 测试dry-run模式
    if [[ -f "$PROJECT_ROOT/cleanup.sh" ]]; then
        run_test "基础清理脚本存在性" "test -f '$PROJECT_ROOT/cleanup.sh'" "pass"
        run_test "基础清理dry-run模式" "bash '$PROJECT_ROOT/cleanup.sh' --dry-run" "pass"
        
        # 测试实际清理
        run_test "基础清理执行" "bash '$PROJECT_ROOT/cleanup.sh'" "pass"
        
        # 验证文件是否被清理
        run_test "临时文件被清理" "test ! -f '$PROJECT_ROOT/test.tmp'" "pass"
    else
        echo -e "${YELLOW}跳过基础清理测试 (脚本不存在)${NC}"
    fi
}

# 测试快速清理脚本
test_quick_cleanup() {
    echo -e "\n${CYAN}=== 测试快速清理脚本 ===${NC}"
    
    setup_test_environment
    
    if [[ -f "$SCRIPT_DIR/quick-clean.sh" ]]; then
        run_test "快速清理脚本存在性" "test -f '$SCRIPT_DIR/quick-clean.sh'" "pass"
        run_test "快速清理执行" "bash '$SCRIPT_DIR/quick-clean.sh'" "pass"
    else
        echo -e "${YELLOW}跳过快速清理测试 (脚本不存在)${NC}"
    fi
}

# 测试自动清理脚本
test_auto_cleanup() {
    echo -e "\n${CYAN}=== 测试自动清理脚本 ===${NC}"
    
    setup_test_environment
    
    if [[ -f "$SCRIPT_DIR/auto-cleanup.sh" ]]; then
        run_test "自动清理脚本存在性" "test -f '$SCRIPT_DIR/auto-cleanup.sh'" "pass"
        run_test "自动清理help" "bash '$SCRIPT_DIR/auto-cleanup.sh' --help" "pass"
        run_test "自动清理dry-run" "bash '$SCRIPT_DIR/auto-cleanup.sh' --dry-run" "pass"
        run_test "自动清理执行" "bash '$SCRIPT_DIR/auto-cleanup.sh' --cleanup-now" "pass"
    else
        echo -e "${YELLOW}跳过自动清理测试 (脚本不存在)${NC}"
    fi
}

# 测试智能清理脚本
test_smart_cleanup() {
    echo -e "\n${CYAN}=== 测试智能清理脚本 ===${NC}"
    
    setup_test_environment
    
    if [[ -f "$SCRIPT_DIR/smart-cleanup.sh" ]]; then
        run_test "智能清理脚本存在性" "test -f '$SCRIPT_DIR/smart-cleanup.sh'" "pass"
        run_test "智能清理help" "bash '$SCRIPT_DIR/smart-cleanup.sh' --help" "pass"
        
        # 测试不同模式
        run_test "智能清理-标准模式" "bash '$SCRIPT_DIR/smart-cleanup.sh' --cleanup-now standard" "pass"
        
        setup_test_environment  # 重新创建测试文件
        run_test "智能清理-构建模式" "bash '$SCRIPT_DIR/smart-cleanup.sh' --cleanup-now build" "pass"
        
        setup_test_environment  # 重新创建测试文件
        run_test "智能清理-开发模式" "bash '$SCRIPT_DIR/smart-cleanup.sh' --cleanup-now dev" "pass"
        
        # 测试统计功能
        run_test "智能清理统计" "bash '$SCRIPT_DIR/smart-cleanup.sh' --stats" "pass"
    else
        echo -e "${YELLOW}跳过智能清理测试 (脚本不存在)${NC}"
    fi
}

# 测试配置文件
test_configuration() {
    echo -e "\n${CYAN}=== 测试配置文件 ===${NC}"
    
    run_test "配置文件存在性" "test -f '$SCRIPT_DIR/auto-cleanup.config'" "pass"
    
    if [[ -f "$SCRIPT_DIR/auto-cleanup.config" ]]; then
        run_test "配置文件语法检查" "grep -q 'WATCH_INTERVAL' '$SCRIPT_DIR/auto-cleanup.config'" "pass"
        run_test "配置文件完整性" "grep -q 'CLEANUP_DELAY' '$SCRIPT_DIR/auto-cleanup.config'" "pass"
    fi
}

# 测试Git Hook
test_git_hooks() {
    echo -e "\n${CYAN}=== 测试Git Hook ===${NC}"
    
    if [[ -f "$SCRIPT_DIR/install-hooks.sh" ]]; then
        run_test "Git Hook安装脚本存在性" "test -f '$SCRIPT_DIR/install-hooks.sh'" "pass"
        run_test "pre-commit hook脚本存在性" "test -f '$SCRIPT_DIR/pre-commit-hook.sh'" "pass"
    else
        echo -e "${YELLOW}跳过Git Hook测试 (脚本不存在)${NC}"
    fi
}

# 测试跨平台脚本
test_cross_platform() {
    echo -e "\n${CYAN}=== 测试跨平台脚本 ===${NC}"
    
    # PowerShell脚本
    if command -v powershell >/dev/null 2>&1; then
        if [[ -f "$SCRIPT_DIR/auto-cleanup.ps1" ]]; then
            run_test "PowerShell自动清理脚本存在性" "test -f '$SCRIPT_DIR/auto-cleanup.ps1'" "pass"
        fi
        
        if [[ -f "$SCRIPT_DIR/quick-clean.ps1" ]]; then
            run_test "PowerShell快速清理脚本存在性" "test -f '$SCRIPT_DIR/quick-clean.ps1'" "pass"
        fi
    else
        echo -e "${YELLOW}跳过PowerShell测试 (PowerShell不可用)${NC}"
    fi
    
    # 批处理脚本
    if [[ -f "$SCRIPT_DIR/auto-cleanup.bat" ]]; then
        run_test "批处理包装器存在性" "test -f '$SCRIPT_DIR/auto-cleanup.bat'" "pass"
    fi
}

# 测试配置脚本
test_setup_scripts() {
    echo -e "\n${CYAN}=== 测试配置脚本 ===${NC}"
    
    if [[ -f "$SCRIPT_DIR/setup-auto-cleanup.sh" ]]; then
        run_test "Bash配置脚本存在性" "test -f '$SCRIPT_DIR/setup-auto-cleanup.sh'" "pass"
    fi
    
    if [[ -f "$SCRIPT_DIR/setup-auto-cleanup.ps1" ]]; then
        run_test "PowerShell配置脚本存在性" "test -f '$SCRIPT_DIR/setup-auto-cleanup.ps1'" "pass"
    fi
}

# 性能测试
test_performance() {
    echo -e "\n${CYAN}=== 性能测试 ===${NC}"
    
    # 创建大量测试文件
    echo -e "${BLUE}创建性能测试环境...${NC}"
    for i in {1..100}; do
        echo "test$i" > "test_$i.log"
        echo "temp$i" > "temp_$i.tmp"
    done
    
    # 测试清理性能
    if [[ -f "$SCRIPT_DIR/auto-cleanup.sh" ]]; then
        echo -e "${BLUE}测试清理性能...${NC}"
        local start_time=$(date +%s)
        bash "$SCRIPT_DIR/auto-cleanup.sh" --cleanup-now >/dev/null 2>&1
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        
        if [[ $duration -lt 30 ]]; then
            echo -e "${GREEN}  ✓ 性能测试通过 (用时: ${duration}秒)${NC}"
            ((TESTS_PASSED++))
        else
            echo -e "${RED}  ✗ 性能测试失败 (用时: ${duration}秒，超过30秒)${NC}"
            ((TESTS_FAILED++))
        fi
        ((TOTAL_TESTS++))
    fi
}

# 主测试函数
main() {
    echo "开始测试自动清理系统..."
    echo "项目根目录: $PROJECT_ROOT"
    echo "脚本目录: $SCRIPT_DIR"
    echo
    
    # 检查项目环境
    if [[ ! -f "$PROJECT_ROOT/_config.yml" ]]; then
        echo -e "${RED}错误: 不是有效的Jekyll项目目录${NC}"
        exit 1
    fi
    
    # 运行所有测试
    test_basic_cleanup
    test_quick_cleanup
    test_auto_cleanup
    test_smart_cleanup
    test_configuration
    test_git_hooks
    test_cross_platform
    test_setup_scripts
    test_performance
    
    # 清理测试环境
    cleanup_test_environment
    
    # 显示测试结果
    echo -e "\n${CYAN}=== 测试结果总结 ===${NC}"
    echo -e "总测试数: $TOTAL_TESTS"
    echo -e "${GREEN}通过: $TESTS_PASSED${NC}"
    echo -e "${RED}失败: $TESTS_FAILED${NC}"
    
    if [[ $TESTS_FAILED -eq 0 ]]; then
        echo -e "\n${GREEN}🎉 所有测试通过！自动清理系统工作正常。${NC}"
        exit 0
    else
        echo -e "\n${RED}❌ 有 $TESTS_FAILED 个测试失败，请检查配置。${NC}"
        exit 1
    fi
}

# 显示帮助信息
if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
    cat << EOF
自动清理系统测试脚本

用法: $0 [选项]

选项:
  --help, -h     显示此帮助信息

此脚本将测试所有清理工具的功能:
• 基础清理脚本
• 快速清理脚本  
• 自动监控清理
• 智能清理系统
• 配置文件
• Git Hook
• 跨平台脚本
• 性能测试

测试过程中会创建临时文件，测试结束后自动清理。
EOF
    exit 0
fi

# 运行测试
main "$@"
