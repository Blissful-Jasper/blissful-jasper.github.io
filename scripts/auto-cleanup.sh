#!/bin/bash

# auto-cleanup.sh - 自动清理脚本
# 在文件修改后自动清理相关日志和临时文件

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LOG_FILE="$PROJECT_ROOT/.auto-cleanup.log"
WATCH_INTERVAL=5  # 监控间隔（秒）
CLEANUP_DELAY=30  # 文件修改后等待时间（秒）

# 需要清理的文件类型和模式
CLEANUP_PATTERNS=(
    "*.log"
    "*.tmp"
    "*~"
    ".DS_Store"
    "Thumbs.db"
    "*.swp"
    "*.swo"
    ".jekyll-metadata"
    "_site/*"
    ".sass-cache/*"
    ".jekyll-cache/*"
    "node_modules/.cache/*"
    "*.pid"
    "*.lock.tmp"
    ".bundle/cache/*"
)

# 日志函数
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') $1" | tee -a "$LOG_FILE"
}

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
    log "[INFO] $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
    log "[SUCCESS] $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
    log "[WARNING] $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    log "[ERROR] $1"
}

# 显示帮助信息
show_help() {
    cat << EOF
自动清理脚本 - 监控文件变化并自动清理临时文件

用法: $0 [选项]

选项:
  --watch             启动监控模式，持续监控文件变化
  --cleanup-now       立即执行一次清理
  --dry-run           预览模式，显示将要清理的文件但不删除
  --daemon            作为守护进程运行
  --stop              停止守护进程
  --status            显示守护进程状态
  --help              显示此帮助信息

示例:
  $0 --cleanup-now    # 立即清理一次
  $0 --watch          # 启动监控模式
  $0 --daemon         # 作为守护进程运行
  $0 --stop           # 停止守护进程

配置:
  监控间隔: ${WATCH_INTERVAL}秒
  清理延迟: ${CLEANUP_DELAY}秒
  日志文件: $LOG_FILE
EOF
}

# 检查是否安装了必要工具
check_dependencies() {
    local missing_tools=()
    
    if ! command -v inotifywait >/dev/null 2>&1; then
        if [[ "$OSTYPE" == "linux-gnu"* ]]; then
            missing_tools+=("inotify-tools")
        fi
    fi
    
    if [[ ${#missing_tools[@]} -gt 0 ]]; then
        log_warning "缺少依赖工具: ${missing_tools[*]}"
        log_info "在Ubuntu/Debian上安装: sudo apt-get install ${missing_tools[*]}"
        log_info "在CentOS/RHEL上安装: sudo yum install ${missing_tools[*]}"
        log_info "将使用轮询模式代替inotify"
    fi
}

# 清理函数
cleanup_files() {
    local dry_run=${1:-false}
    local cleaned_count=0
    
    log_info "开始清理临时文件..."
    
    cd "$PROJECT_ROOT"
    
    for pattern in "${CLEANUP_PATTERNS[@]}"; do
        # 使用find查找匹配的文件
        while IFS= read -r -d '' file; do
            if [[ -f "$file" || -d "$file" ]]; then
                if [[ "$dry_run" == "true" ]]; then
                    log_info "将删除: $file"
                else
                    if [[ -d "$file" ]]; then
                        rm -rf "$file" 2>/dev/null || true
                    else
                        rm -f "$file" 2>/dev/null || true
                    fi
                    log_info "已删除: $file"
                fi
                ((cleaned_count++))
            fi
        done < <(find . -name "$pattern" -type f -o -name "$pattern" -type d 2>/dev/null | head -100 | tr '\n' '\0')
    done
    
    # 清理空目录
    if [[ "$dry_run" != "true" ]]; then
        find . -type d -empty -not -path "./.git/*" -delete 2>/dev/null || true
    fi
    
    if [[ "$dry_run" == "true" ]]; then
        log_info "预览模式：发现 $cleaned_count 个文件/目录可以清理"
    else
        log_success "清理完成：删除了 $cleaned_count 个文件/目录"
    fi
}

# 获取守护进程PID
get_daemon_pid() {
    local pidfile="$PROJECT_ROOT/.auto-cleanup.pid"
    if [[ -f "$pidfile" ]]; then
        local pid=$(cat "$pidfile")
        if kill -0 "$pid" 2>/dev/null; then
            echo "$pid"
            return 0
        else
            rm -f "$pidfile"
        fi
    fi
    return 1
}

# 停止守护进程
stop_daemon() {
    local pid=$(get_daemon_pid)
    if [[ -n "$pid" ]]; then
        log_info "停止守护进程 (PID: $pid)..."
        kill "$pid" 2>/dev/null || true
        sleep 2
        if kill -0 "$pid" 2>/dev/null; then
            log_warning "强制停止守护进程..."
            kill -9 "$pid" 2>/dev/null || true
        fi
        rm -f "$PROJECT_ROOT/.auto-cleanup.pid"
        log_success "守护进程已停止"
        return 0
    else
        log_warning "守护进程未运行"
        return 1
    fi
}

# 显示守护进程状态
show_status() {
    local pid=$(get_daemon_pid)
    if [[ -n "$pid" ]]; then
        log_info "守护进程正在运行 (PID: $pid)"
        log_info "日志文件: $LOG_FILE"
        return 0
    else
        log_info "守护进程未运行"
        return 1
    fi
}

# 监控文件变化
watch_files() {
    local use_inotify=false
    
    # 检查是否可以使用inotify
    if command -v inotifywait >/dev/null 2>&1; then
        use_inotify=true
        log_info "使用inotify监控文件变化"
    else
        log_info "使用轮询模式监控文件变化"
    fi
    
    cd "$PROJECT_ROOT"
    
    if [[ "$use_inotify" == "true" ]]; then
        # 使用inotify监控
        inotifywait -m -r -e modify,create,delete,move \
            --exclude '(\.git|_site|\.jekyll-cache|\.sass-cache|node_modules)' \
            . 2>/dev/null | while read -r path action file; do
            
            log_info "检测到文件变化: $action $path$file"
            
            # 等待一段时间，避免频繁清理
            sleep "$CLEANUP_DELAY"
            
            # 执行清理
            cleanup_files false
        done
    else
        # 使用轮询模式
        local last_check=$(date +%s)
        while true; do
            local current_time=$(date +%s)
            
            # 检查最近修改的文件
            local recent_files=$(find . -type f -newermt "@$last_check" \
                ! -path "./.git/*" \
                ! -path "./_site/*" \
                ! -path "./.jekyll-cache/*" \
                ! -path "./.sass-cache/*" \
                ! -path "./node_modules/*" \
                2>/dev/null | head -10)
            
            if [[ -n "$recent_files" ]]; then
                log_info "检测到文件修改"
                sleep "$CLEANUP_DELAY"
                cleanup_files false
            fi
            
            last_check=$current_time
            sleep "$WATCH_INTERVAL"
        done
    fi
}

# 启动守护进程
start_daemon() {
    local pid=$(get_daemon_pid)
    if [[ -n "$pid" ]]; then
        log_warning "守护进程已在运行 (PID: $pid)"
        return 1
    fi
    
    log_info "启动自动清理守护进程..."
    
    # 创建守护进程
    (
        # 重定向输出到日志文件
        exec >> "$LOG_FILE" 2>&1
        
        # 记录PID
        echo $$ > "$PROJECT_ROOT/.auto-cleanup.pid"
        
        # 设置trap处理信号
        trap 'rm -f "$PROJECT_ROOT/.auto-cleanup.pid"; exit 0' EXIT INT TERM
        
        log_info "守护进程启动 (PID: $$)"
        
        # 开始监控
        watch_files
    ) &
    
    local daemon_pid=$!
    sleep 1
    
    if kill -0 "$daemon_pid" 2>/dev/null; then
        log_success "守护进程已启动 (PID: $daemon_pid)"
        log_info "使用 '$0 --stop' 停止守护进程"
        log_info "使用 '$0 --status' 查看状态"
    else
        log_error "守护进程启动失败"
        return 1
    fi
}

# 主函数
main() {
    # 确保在项目根目录
    if [[ ! -f "$PROJECT_ROOT/_config.yml" ]]; then
        log_error "请在Jekyll项目根目录运行此脚本"
        exit 1
    fi
    
    # 创建日志文件
    touch "$LOG_FILE"
    
    # 解析参数
    case "${1:-}" in
        --help|-h)
            show_help
            ;;
        --cleanup-now)
            log_info "执行立即清理..."
            cleanup_files false
            ;;
        --dry-run)
            log_info "执行预览清理..."
            cleanup_files true
            ;;
        --watch)
            log_info "启动监控模式..."
            check_dependencies
            watch_files
            ;;
        --daemon)
            check_dependencies
            start_daemon
            ;;
        --stop)
            stop_daemon
            ;;
        --status)
            show_status
            ;;
        "")
            log_info "执行标准清理..."
            cleanup_files false
            ;;
        *)
            log_error "未知选项: $1"
            echo "使用 --help 查看帮助信息"
            exit 1
            ;;
    esac
}

# 运行主函数
main "$@"
