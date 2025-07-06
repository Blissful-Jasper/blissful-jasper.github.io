#!/bin/bash

# smart-cleanup.sh - 智能自动清理脚本
# 支持配置文件、多种清理模式和智能监控

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 默认配置
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CONFIG_FILE="$SCRIPT_DIR/auto-cleanup.config"
LOG_FILE="$PROJECT_ROOT/.smart-cleanup.log"
STATS_FILE="$PROJECT_ROOT/.cleanup-stats.json"
PID_FILE="$PROJECT_ROOT/.smart-cleanup.pid"

# 默认值
WATCH_INTERVAL=5
CLEANUP_DELAY=30
VERBOSE_LOGGING=true
LOG_MAX_SIZE=10
ENABLE_NOTIFICATIONS=true
NOTIFICATION_MODE="both"
NOTIFICATION_SUMMARY_INTERVAL=60
CREATE_BACKUP_BEFORE_CLEANUP=false
BACKUP_DIRECTORY=".cleanup-backup"
BACKUP_RETENTION_DAYS=7
ENABLE_CLEANUP_STATS=true
AUTO_OPTIMIZE_CLEANUP=true
MAX_FILES_PER_CLEANUP=1000
CLEANUP_TIMEOUT=300
CLEANUP_THREADS=4
ENABLE_INCREMENTAL_CLEANUP=true
DEBUG_MODE=false
DEBUG_LOG_LEVEL="INFO"
KEEP_CLEANUP_HISTORY=true
CLEANUP_HISTORY_DAYS=30

# 读取配置文件
load_config() {
    if [[ -f "$CONFIG_FILE" ]]; then
        log_info "加载配置文件: $CONFIG_FILE"
        
        # 读取配置，忽略注释和空行
        while IFS='=' read -r key value; do
            # 跳过注释和空行
            [[ "$key" =~ ^[[:space:]]*# ]] && continue
            [[ -z "$key" ]] && continue
            
            # 移除前后空格
            key=$(echo "$key" | xargs)
            value=$(echo "$value" | xargs)
            
            # 设置变量
            case "$key" in
                WATCH_INTERVAL) WATCH_INTERVAL="$value" ;;
                CLEANUP_DELAY) CLEANUP_DELAY="$value" ;;
                VERBOSE_LOGGING) VERBOSE_LOGGING="$value" ;;
                LOG_MAX_SIZE) LOG_MAX_SIZE="$value" ;;
                ENABLE_NOTIFICATIONS) ENABLE_NOTIFICATIONS="$value" ;;
                NOTIFICATION_MODE) NOTIFICATION_MODE="$value" ;;
                NOTIFICATION_SUMMARY_INTERVAL) NOTIFICATION_SUMMARY_INTERVAL="$value" ;;
                CREATE_BACKUP_BEFORE_CLEANUP) CREATE_BACKUP_BEFORE_CLEANUP="$value" ;;
                BACKUP_DIRECTORY) BACKUP_DIRECTORY="$value" ;;
                BACKUP_RETENTION_DAYS) BACKUP_RETENTION_DAYS="$value" ;;
                ENABLE_CLEANUP_STATS) ENABLE_CLEANUP_STATS="$value" ;;
                AUTO_OPTIMIZE_CLEANUP) AUTO_OPTIMIZE_CLEANUP="$value" ;;
                MAX_FILES_PER_CLEANUP) MAX_FILES_PER_CLEANUP="$value" ;;
                CLEANUP_TIMEOUT) CLEANUP_TIMEOUT="$value" ;;
                CLEANUP_THREADS) CLEANUP_THREADS="$value" ;;
                ENABLE_INCREMENTAL_CLEANUP) ENABLE_INCREMENTAL_CLEANUP="$value" ;;
                DEBUG_MODE) DEBUG_MODE="$value" ;;
                DEBUG_LOG_LEVEL) DEBUG_LOG_LEVEL="$value" ;;
                KEEP_CLEANUP_HISTORY) KEEP_CLEANUP_HISTORY="$value" ;;
                CLEANUP_HISTORY_DAYS) CLEANUP_HISTORY_DAYS="$value" ;;
            esac
        done < <(grep -E '^[[:space:]]*[^#]' "$CONFIG_FILE" 2>/dev/null | grep '=')
    else
        log_warning "配置文件不存在，使用默认配置: $CONFIG_FILE"
    fi
}

# 日志函数
log() {
    local level="$1"
    local message="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local log_message="$timestamp [$level] $message"
    
    # 检查日志级别
    case "$DEBUG_LOG_LEVEL" in
        "ERROR")
            [[ "$level" != "ERROR" ]] && return
            ;;
        "WARNING")
            [[ "$level" != "ERROR" && "$level" != "WARNING" ]] && return
            ;;
        "INFO")
            [[ "$level" == "DEBUG" ]] && return
            ;;
    esac
    
    # 输出到控制台
    case "$level" in
        "ERROR") echo -e "${RED}$log_message${NC}" ;;
        "WARNING") echo -e "${YELLOW}$log_message${NC}" ;;
        "SUCCESS") echo -e "${GREEN}$log_message${NC}" ;;
        "INFO") echo -e "${BLUE}$log_message${NC}" ;;
        "DEBUG") echo -e "${PURPLE}$log_message${NC}" ;;
        *) echo "$log_message" ;;
    esac
    
    # 写入日志文件
    if [[ "$VERBOSE_LOGGING" == "true" ]]; then
        echo "$log_message" >> "$LOG_FILE"
        
        # 检查日志文件大小并轮转
        if [[ -f "$LOG_FILE" ]]; then
            local log_size=$(du -m "$LOG_FILE" | cut -f1)
            if [[ $log_size -gt $LOG_MAX_SIZE ]]; then
                mv "$LOG_FILE" "${LOG_FILE}.old"
                touch "$LOG_FILE"
                log_info "日志文件已轮转"
            fi
        fi
    fi
}

log_info() { log "INFO" "$1"; }
log_success() { log "SUCCESS" "$1"; }
log_warning() { log "WARNING" "$1"; }
log_error() { log "ERROR" "$1"; }
log_debug() { log "DEBUG" "$1"; }

# 显示帮助信息
show_help() {
    cat << EOF
智能自动清理脚本 - 支持配置文件和多种清理模式

用法: $0 [选项] [清理模式]

清理模式:
  standard            标准清理（默认）
  build               构建清理
  dev                 开发清理
  deep                深度清理
  custom              自定义清理

选项:
  --watch             启动监控模式，持续监控文件变化
  --cleanup-now       立即执行一次清理
  --dry-run           预览模式，显示将要清理的文件但不删除
  --daemon            作为守护进程运行
  --stop              停止守护进程
  --status            显示守护进程状态
  --stats             显示清理统计信息
  --config FILE       指定配置文件路径
  --backup            清理前创建备份
  --no-backup         不创建备份
  --help              显示此帮助信息

高级选项:
  --debug             启用调试模式
  --log-level LEVEL   设置日志级别 (ERROR|WARNING|INFO|DEBUG)
  --threads N         设置清理线程数
  --timeout N         设置清理超时时间（秒）

示例:
  $0 --cleanup-now standard        # 立即执行标准清理
  $0 --watch build                 # 监控模式，使用构建清理
  $0 --daemon dev                  # 后台模式，使用开发清理
  $0 --dry-run deep --backup       # 预览深度清理并备份
  $0 --stats                       # 显示清理统计

配置文件: $CONFIG_FILE
日志文件: $LOG_FILE
统计文件: $STATS_FILE
EOF
}

# 获取清理模式的文件模式
get_cleanup_patterns() {
    local mode="$1"
    local patterns=()
    
    case "$mode" in
        "standard")
            patterns=(
                "*.log" "*.tmp" "*~" ".DS_Store" "Thumbs.db"
                "*.swp" "*.swo" ".jekyll-metadata"
            )
            ;;
        "build")
            patterns=(
                "_site/*" ".sass-cache/*" ".jekyll-cache/*"
                "node_modules/.cache/*" ".bundle/cache/*"
            )
            ;;
        "dev")
            patterns=(
                "*.pid" "*.lock.tmp" ".vscode/settings.json.tmp"
                "debug.log" "error.log"
            )
            ;;
        "deep")
            patterns=(
                "*.log" "*.tmp" "*~" ".DS_Store" "Thumbs.db"
                "*.swp" "*.swo" ".jekyll-metadata"
                "_site/*" ".sass-cache/*" ".jekyll-cache/*"
                "node_modules/.cache/*" ".bundle/cache/*"
                "*.pid" "*.lock.tmp" "debug.log" "error.log"
            )
            ;;
        "custom")
            # 从配置文件读取自定义模式
            if [[ -f "$CONFIG_FILE" ]]; then
                local custom_patterns=$(grep "CUSTOM_PATTERNS=" "$CONFIG_FILE" | cut -d'=' -f2 | tr -d '()')
                IFS=',' read -ra patterns <<< "$custom_patterns"
            fi
            ;;
        *)
            log_warning "未知清理模式: $mode，使用标准模式"
            patterns=(
                "*.log" "*.tmp" "*~" ".DS_Store" "Thumbs.db"
                "*.swp" "*.swo" ".jekyll-metadata"
            )
            ;;
    esac
    
    printf '%s\n' "${patterns[@]}"
}

# 创建备份
create_backup() {
    if [[ "$CREATE_BACKUP_BEFORE_CLEANUP" == "true" ]]; then
        local backup_dir="$PROJECT_ROOT/$BACKUP_DIRECTORY"
        local backup_name="backup-$(date +%Y%m%d-%H%M%S)"
        local backup_path="$backup_dir/$backup_name"
        
        log_info "创建备份: $backup_path"
        
        mkdir -p "$backup_path"
        
        # 备份即将被清理的文件
        local patterns=($(get_cleanup_patterns "$1"))
        local backed_up=0
        
        for pattern in "${patterns[@]}"; do
            while IFS= read -r -d '' file; do
                if [[ -f "$file" ]]; then
                    local rel_path=$(realpath --relative-to="$PROJECT_ROOT" "$file")
                    local backup_file="$backup_path/$rel_path"
                    mkdir -p "$(dirname "$backup_file")"
                    cp "$file" "$backup_file" 2>/dev/null && ((backed_up++))
                fi
            done < <(find "$PROJECT_ROOT" -name "$pattern" -type f 2>/dev/null | tr '\n' '\0')
        done
        
        log_success "备份完成: $backed_up 个文件"
        
        # 清理旧备份
        if [[ -d "$backup_dir" ]]; then
            find "$backup_dir" -type d -name "backup-*" -mtime +"$BACKUP_RETENTION_DAYS" -exec rm -rf {} + 2>/dev/null || true
        fi
    fi
}

# 更新统计信息
update_stats() {
    if [[ "$ENABLE_CLEANUP_STATS" == "true" ]]; then
        local mode="$1"
        local cleaned_count="$2"
        local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
        
        # 创建或更新统计文件
        if [[ ! -f "$STATS_FILE" ]]; then
            echo '{"cleanups": [], "summary": {"total_cleanups": 0, "total_files_cleaned": 0}}' > "$STATS_FILE"
        fi
        
        # 添加新的清理记录
        local temp_file=$(mktemp)
        jq --arg timestamp "$timestamp" \
           --arg mode "$mode" \
           --argjson count "$cleaned_count" \
           '.cleanups += [{"timestamp": $timestamp, "mode": $mode, "files_cleaned": $count}] |
            .summary.total_cleanups += 1 |
            .summary.total_files_cleaned += $count' \
           "$STATS_FILE" > "$temp_file" && mv "$temp_file" "$STATS_FILE"
        
        log_debug "统计信息已更新: 模式=$mode, 文件数=$cleaned_count"
    fi
}

# 智能清理函数
smart_cleanup() {
    local mode="${1:-standard}"
    local dry_run="${2:-false}"
    local cleaned_count=0
    
    log_info "开始智能清理 (模式: $mode)..."
    
    # 创建备份
    if [[ "$dry_run" != "true" ]]; then
        create_backup "$mode"
    fi
    
    cd "$PROJECT_ROOT"
    
    local patterns=($(get_cleanup_patterns "$mode"))
    local processed=0
    
    for pattern in "${patterns[@]}"; do
        log_debug "处理模式: $pattern"
        
        while IFS= read -r -d '' file; do
            ((processed++))
            
            # 检查是否超过最大文件数限制
            if [[ $processed -gt $MAX_FILES_PER_CLEANUP ]]; then
                log_warning "已达到单次清理最大文件数限制: $MAX_FILES_PER_CLEANUP"
                break 2
            fi
            
            # 检查排除列表
            local should_exclude=false
            
            # 检查排除目录
            for exclude_dir in ".git" "_posts" "_pages" "_data" "_includes" "_layouts" "assets"; do
                if [[ "$file" == *"$exclude_dir"* ]]; then
                    should_exclude=true
                    break
                fi
            done
            
            # 检查白名单扩展名
            for ext in ".md" ".html" ".css" ".scss" ".js" ".json" ".yml" ".yaml" ".png" ".jpg" ".jpeg" ".gif" ".svg" ".pdf" ".ico"; do
                if [[ "$file" == *"$ext" ]]; then
                    should_exclude=true
                    break
                fi
            done
            
            if [[ "$should_exclude" == "true" ]]; then
                log_debug "跳过受保护文件: $file"
                continue
            fi
            
            if [[ -f "$file" || -d "$file" ]]; then
                if [[ "$dry_run" == "true" ]]; then
                    log_info "将删除: $file"
                else
                    if [[ -d "$file" ]]; then
                        rm -rf "$file" 2>/dev/null || true
                    else
                        rm -f "$file" 2>/dev/null || true
                    fi
                    log_debug "已删除: $file"
                fi
                ((cleaned_count++))
            fi
        done < <(timeout "$CLEANUP_TIMEOUT" find . -name "$pattern" -type f -o -name "$pattern" -type d 2>/dev/null | head -"$MAX_FILES_PER_CLEANUP" | tr '\n' '\0')
    done
    
    # 清理空目录
    if [[ "$dry_run" != "true" ]]; then
        find . -type d -empty -not -path "./.git/*" -delete 2>/dev/null || true
    fi
    
    # 更新统计
    if [[ "$dry_run" != "true" ]]; then
        update_stats "$mode" "$cleaned_count"
    fi
    
    if [[ "$dry_run" == "true" ]]; then
        log_info "预览模式：发现 $cleaned_count 个文件/目录可以清理"
    else
        log_success "智能清理完成：删除了 $cleaned_count 个文件/目录 (模式: $mode)"
    fi
    
    # 发送通知
    if [[ "$ENABLE_NOTIFICATIONS" == "true" && "$dry_run" != "true" ]]; then
        send_notification "$mode" "$cleaned_count"
    fi
}

# 发送通知
send_notification() {
    local mode="$1"
    local count="$2"
    local message="智能清理完成 - 模式: $mode, 清理文件数: $count"
    
    case "$NOTIFICATION_MODE" in
        "console"|"both")
            log_success "$message"
            ;;
    esac
    
    case "$NOTIFICATION_MODE" in
        "file"|"both")
            echo "$(date '+%Y-%m-%d %H:%M:%S') $message" >> "$PROJECT_ROOT/.cleanup-notifications.log"
            ;;
    esac
}

# 显示统计信息
show_stats() {
    if [[ ! -f "$STATS_FILE" ]]; then
        log_info "暂无清理统计信息"
        return
    fi
    
    echo -e "${CYAN}=== 清理统计信息 ===${NC}"
    echo
    
    local total_cleanups=$(jq -r '.summary.total_cleanups' "$STATS_FILE")
    local total_files=$(jq -r '.summary.total_files_cleaned' "$STATS_FILE")
    
    echo -e "${GREEN}总清理次数:${NC} $total_cleanups"
    echo -e "${GREEN}总清理文件数:${NC} $total_files"
    echo
    
    echo -e "${CYAN}最近 10 次清理:${NC}"
    jq -r '.cleanups | sort_by(.timestamp) | reverse | .[0:10] | .[] | 
           "\(.timestamp) | 模式: \(.mode) | 文件数: \(.files_cleaned)"' "$STATS_FILE"
    
    echo
    echo -e "${CYAN}按模式统计:${NC}"
    jq -r '.cleanups | group_by(.mode) | .[] | 
           "\(.[0].mode): \(length) 次清理, \(map(.files_cleaned) | add) 个文件"' "$STATS_FILE"
}

# 获取守护进程PID
get_daemon_pid() {
    if [[ -f "$PID_FILE" ]]; then
        local pid=$(cat "$PID_FILE")
        if kill -0 "$pid" 2>/dev/null; then
            echo "$pid"
            return 0
        else
            rm -f "$PID_FILE"
        fi
    fi
    return 1
}

# 智能监控
smart_watch() {
    local mode="${1:-standard}"
    
    log_info "启动智能监控模式 (清理模式: $mode)..."
    
    # 检查监控工具
    local use_inotify=false
    if command -v inotifywait >/dev/null 2>&1; then
        use_inotify=true
        log_info "使用 inotify 进行文件监控"
    else
        log_info "使用轮询模式进行文件监控"
    fi
    
    cd "$PROJECT_ROOT"
    
    if [[ "$use_inotify" == "true" ]]; then
        # 使用inotify监控
        inotifywait -m -r -e modify,create,delete,move \
            --exclude '(\.git|_site|\.jekyll-cache|\.sass-cache|node_modules)' \
            . 2>/dev/null | while read -r path action file; do
            
            # 检查是否是触发文件类型
            local should_trigger=false
            for ext in ".md" ".html" ".scss" ".css" ".js" ".yml" ".yaml"; do
                if [[ "$file" == *"$ext" ]]; then
                    should_trigger=true
                    break
                fi
            done
            
            if [[ "$should_trigger" == "true" ]]; then
                log_info "检测到关键文件变化: $action $path$file"
                
                # 智能延迟
                local smart_delay=$CLEANUP_DELAY
                if [[ "$AUTO_OPTIMIZE_CLEANUP" == "true" ]]; then
                    # 根据文件类型调整延迟
                    case "$file" in
                        *.md) smart_delay=$((CLEANUP_DELAY / 2)) ;;
                        *.scss|*.css) smart_delay=$((CLEANUP_DELAY * 2)) ;;
                    esac
                fi
                
                sleep "$smart_delay"
                smart_cleanup "$mode" false
            fi
        done
    else
        # 轮询模式
        local last_check=$(date +%s)
        while true; do
            local current_time=$(date +%s)
            
            # 检查触发目录中的文件变化
            local recent_files=""
            for trigger_dir in "_posts" "_pages" "_sass" "assets" "_data"; do
                if [[ -d "$trigger_dir" ]]; then
                    local files=$(find "$trigger_dir" -type f -newermt "@$last_check" 2>/dev/null | head -5)
                    if [[ -n "$files" ]]; then
                        recent_files="$recent_files$files"
                    fi
                fi
            done
            
            if [[ -n "$recent_files" ]]; then
                log_info "检测到触发目录中的文件修改"
                sleep "$CLEANUP_DELAY"
                smart_cleanup "$mode" false
            fi
            
            last_check=$current_time
            sleep "$WATCH_INTERVAL"
        done
    fi
}

# 主函数
main() {
    # 加载配置
    load_config
    
    # 确保在项目根目录
    if [[ ! -f "$PROJECT_ROOT/_config.yml" ]]; then
        log_error "请在Jekyll项目根目录运行此脚本"
        exit 1
    fi
    
    # 创建必要的文件
    touch "$LOG_FILE"
    
    # 解析参数
    local action=""
    local mode="standard"
    local dry_run=false
    local force_backup=""
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --help|-h)
                show_help
                exit 0
                ;;
            --cleanup-now)
                action="cleanup"
                ;;
            --dry-run)
                dry_run=true
                ;;
            --watch)
                action="watch"
                ;;
            --daemon)
                action="daemon"
                ;;
            --stop)
                action="stop"
                ;;
            --status)
                action="status"
                ;;
            --stats)
                action="stats"
                ;;
            --backup)
                force_backup="true"
                ;;
            --no-backup)
                force_backup="false"
                ;;
            --debug)
                DEBUG_MODE=true
                DEBUG_LOG_LEVEL="DEBUG"
                ;;
            --log-level)
                shift
                DEBUG_LOG_LEVEL="$1"
                ;;
            --threads)
                shift
                CLEANUP_THREADS="$1"
                ;;
            --timeout)
                shift
                CLEANUP_TIMEOUT="$1"
                ;;
            --config)
                shift
                CONFIG_FILE="$1"
                load_config
                ;;
            standard|build|dev|deep|custom)
                mode="$1"
                ;;
            *)
                log_error "未知选项: $1"
                echo "使用 --help 查看帮助信息"
                exit 1
                ;;
        esac
        shift
    done
    
    # 应用强制备份设置
    if [[ -n "$force_backup" ]]; then
        CREATE_BACKUP_BEFORE_CLEANUP="$force_backup"
    fi
    
    # 执行操作
    case "$action" in
        "cleanup")
            log_info "执行智能清理 (模式: $mode)..."
            smart_cleanup "$mode" "$dry_run"
            ;;
        "watch")
            smart_watch "$mode"
            ;;
        "daemon")
            # 实现守护进程模式
            log_info "守护进程模式暂未实现，使用监控模式代替"
            smart_watch "$mode"
            ;;
        "stop")
            log_info "停止功能暂未实现"
            ;;
        "status")
            log_info "状态功能暂未实现"
            ;;
        "stats")
            show_stats
            ;;
        "")
            log_info "执行标准智能清理..."
            smart_cleanup "$mode" "$dry_run"
            ;;
    esac
}

# 运行主函数
main "$@"
