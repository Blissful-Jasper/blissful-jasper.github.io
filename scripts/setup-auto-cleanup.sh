#!/bin/bash

# setup-auto-cleanup.sh - 一键配置自动清理系统
# 快速设置和启动自动清理功能

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

echo -e "${CYAN}=== Jekyll项目自动清理系统配置 ===${NC}"
echo

# 检查项目根目录
if [[ ! -f "$PROJECT_ROOT/_config.yml" ]]; then
    echo -e "${RED}错误: 未找到Jekyll项目配置文件${NC}"
    echo "请确保在Jekyll项目根目录运行此脚本"
    exit 1
fi

echo -e "${GREEN}✓ 检测到Jekyll项目: $PROJECT_ROOT${NC}"

# 显示可用的清理工具
echo -e "\n${BLUE}可用的清理工具:${NC}"
echo "1. 基础清理脚本 (cleanup.sh/cleanup.ps1)"
echo "2. 快速清理脚本 (quick-clean.sh/quick-clean.ps1)"
echo "3. 自动监控清理 (auto-cleanup.sh/auto-cleanup.ps1)"
echo "4. 智能清理系统 (smart-cleanup.sh)"
echo "5. Git Hook 自动清理 (pre-commit-hook.sh)"

echo -e "\n${YELLOW}选择配置选项:${NC}"
echo "a) 快速配置 - 使用推荐设置"
echo "b) 自定义配置 - 手动选择功能"
echo "c) 仅安装 Git Hook"
echo "d) 启动监控模式"
echo "e) 显示使用说明"
echo "q) 退出"

while true; do
    echo -en "\n请选择 [a/b/c/d/e/q]: "
    read -r choice
    
    case "$choice" in
        a|A)
            echo -e "\n${GREEN}=== 快速配置模式 ===${NC}"
            
            # 1. 安装Git Hook
            echo -e "${BLUE}安装Git pre-commit hook...${NC}"
            if [[ -f "$SCRIPT_DIR/install-hooks.sh" ]]; then
                bash "$SCRIPT_DIR/install-hooks.sh"
                echo -e "${GREEN}✓ Git Hook 安装完成${NC}"
            else
                echo -e "${YELLOW}⚠ Git Hook 脚本未找到${NC}"
            fi
            
            # 2. 创建配置文件
            echo -e "\n${BLUE}创建推荐配置文件...${NC}"
            if [[ ! -f "$SCRIPT_DIR/auto-cleanup.config" ]]; then
                echo -e "${YELLOW}⚠ 配置文件已存在，跳过创建${NC}"
            else
                echo -e "${GREEN}✓ 配置文件已创建${NC}"
            fi
            
            # 3. 执行一次清理
            echo -e "\n${BLUE}执行初始清理...${NC}"
            if [[ -f "$SCRIPT_DIR/smart-cleanup.sh" ]]; then
                bash "$SCRIPT_DIR/smart-cleanup.sh" --cleanup-now standard
                echo -e "${GREEN}✓ 初始清理完成${NC}"
            else
                echo -e "${YELLOW}⚠ 智能清理脚本未找到，使用基础清理${NC}"
                if [[ -f "$PROJECT_ROOT/cleanup.sh" ]]; then
                    bash "$PROJECT_ROOT/cleanup.sh"
                fi
            fi
            
            # 4. 显示启动选项
            echo -e "\n${CYAN}=== 配置完成 ===${NC}"
            echo -e "${GREEN}现在你可以:${NC}"
            echo "• 启动监控模式: ./scripts/auto-cleanup.sh --watch"
            echo "• 后台服务模式: ./scripts/auto-cleanup.sh --daemon"
            echo "• 立即清理: ./scripts/auto-cleanup.sh --cleanup-now"
            echo "• 查看统计: ./scripts/smart-cleanup.sh --stats"
            
            echo -en "\n是否立即启动监控模式? [y/N]: "
            read -r start_watch
            if [[ "$start_watch" =~ ^[Yy]$ ]]; then
                echo -e "${GREEN}启动监控模式...${NC}"
                bash "$SCRIPT_DIR/auto-cleanup.sh" --watch
            fi
            break
            ;;
            
        b|B)
            echo -e "\n${GREEN}=== 自定义配置模式 ===${NC}"
            
            # Git Hook配置
            echo -en "安装Git pre-commit hook? [Y/n]: "
            read -r install_hook
            if [[ ! "$install_hook" =~ ^[Nn]$ ]]; then
                bash "$SCRIPT_DIR/install-hooks.sh" 2>/dev/null || echo -e "${YELLOW}⚠ Git Hook安装失败${NC}"
            fi
            
            # 清理模式选择
            echo -e "\n选择默认清理模式:"
            echo "1) standard - 标准清理"
            echo "2) build - 构建清理" 
            echo "3) dev - 开发清理"
            echo "4) deep - 深度清理"
            echo -en "选择 [1-4]: "
            read -r mode_choice
            
            case "$mode_choice" in
                1) cleanup_mode="standard" ;;
                2) cleanup_mode="build" ;;
                3) cleanup_mode="dev" ;;
                4) cleanup_mode="deep" ;;
                *) cleanup_mode="standard" ;;
            esac
            
            # 监控配置
            echo -en "\n启用文件监控? [Y/n]: "
            read -r enable_watch
            
            echo -en "监控间隔(秒) [5]: "
            read -r watch_interval
            watch_interval=${watch_interval:-5}
            
            echo -en "清理延迟(秒) [30]: "
            read -r cleanup_delay
            cleanup_delay=${cleanup_delay:-30}
            
            # 执行配置
            echo -e "\n${BLUE}应用自定义配置...${NC}"
            
            # 创建自定义配置文件
            cat > "$SCRIPT_DIR/auto-cleanup.config.custom" << EOF
# 自定义配置 - $(date)
WATCH_INTERVAL=$watch_interval
CLEANUP_DELAY=$cleanup_delay
VERBOSE_LOGGING=true
LOG_MAX_SIZE=10
ENABLE_NOTIFICATIONS=true
NOTIFICATION_MODE=both
EOF
            
            echo -e "${GREEN}✓ 自定义配置已保存${NC}"
            
            # 执行清理
            echo -e "${BLUE}执行清理 (模式: $cleanup_mode)...${NC}"
            bash "$SCRIPT_DIR/smart-cleanup.sh" --cleanup-now "$cleanup_mode" --config "$SCRIPT_DIR/auto-cleanup.config.custom"
            
            if [[ ! "$enable_watch" =~ ^[Nn]$ ]]; then
                echo -e "${GREEN}启动监控模式...${NC}"
                bash "$SCRIPT_DIR/auto-cleanup.sh" --watch
            fi
            break
            ;;
            
        c|C)
            echo -e "\n${GREEN}=== 安装Git Hook ===${NC}"
            bash "$SCRIPT_DIR/install-hooks.sh"
            echo -e "${GREEN}✓ Git Hook 安装完成${NC}"
            echo "现在每次commit前都会自动清理临时文件"
            break
            ;;
            
        d|D)
            echo -e "\n${GREEN}=== 启动监控模式 ===${NC}"
            echo "选择监控模式:"
            echo "1) 基础监控 (auto-cleanup.sh --watch)"
            echo "2) 智能监控 (smart-cleanup.sh --watch)"
            echo -en "选择 [1-2]: "
            read -r watch_choice
            
            case "$watch_choice" in
                1)
                    echo -e "${BLUE}启动基础监控模式...${NC}"
                    bash "$SCRIPT_DIR/auto-cleanup.sh" --watch
                    ;;
                2)
                    echo -e "${BLUE}启动智能监控模式...${NC}"
                    echo -en "选择清理模式 [standard/build/dev/deep]: "
                    read -r mode
                    mode=${mode:-standard}
                    bash "$SCRIPT_DIR/smart-cleanup.sh" --watch "$mode"
                    ;;
                *)
                    echo -e "${BLUE}启动默认监控模式...${NC}"
                    bash "$SCRIPT_DIR/auto-cleanup.sh" --watch
                    ;;
            esac
            break
            ;;
            
        e|E)
            echo -e "\n${CYAN}=== 使用说明 ===${NC}"
            cat << 'EOF'

📖 清理工具使用说明:

🔧 基础清理脚本:
  ./cleanup.sh                    # 标准清理
  ./cleanup.sh --dry-run          # 预览清理内容
  ./cleanup.sh --deep             # 深度清理

⚡ 快速清理:
  ./scripts/quick-clean.sh        # 快速清理常见临时文件

🤖 自动监控清理:
  ./scripts/auto-cleanup.sh --cleanup-now    # 立即清理
  ./scripts/auto-cleanup.sh --watch          # 监控模式  
  ./scripts/auto-cleanup.sh --daemon         # 后台服务
  ./scripts/auto-cleanup.sh --status         # 查看状态

🧠 智能清理系统:
  ./scripts/smart-cleanup.sh [模式]          # 多模式清理
  ./scripts/smart-cleanup.sh --stats         # 查看统计
  ./scripts/smart-cleanup.sh --backup        # 清理前备份

清理模式:
• standard: 标准清理 - 临时文件和日志
• build: 构建清理 - 缓存和构建文件  
• dev: 开发清理 - 开发工具临时文件
• deep: 深度清理 - 所有类型文件
• custom: 自定义清理 - 根据配置文件

🔗 Git集成:
每次commit前自动清理 (需要安装Git Hook)

📊 统计功能:
查看清理历史、统计信息和性能指标

EOF
            echo -en "\n按Enter继续..."
            read -r
            ;;
            
        q|Q)
            echo -e "${YELLOW}退出配置${NC}"
            exit 0
            ;;
            
        *)
            echo -e "${RED}无效选择，请重新输入${NC}"
            ;;
    esac
done

echo -e "\n${GREEN}=== 配置完成 ===${NC}"
echo -e "${CYAN}感谢使用Jekyll自动清理系统！${NC}"
echo
echo -e "${BLUE}更多帮助信息:${NC}"
echo "• 查看完整文档: cat ./scripts/README.md"
echo "• 配置文件说明: cat ./scripts/auto-cleanup.config"
echo "• 问题反馈: 请在项目Issues中提交"
echo
