#!/bin/bash
# 安装自动清理Git Hooks

echo "🔧 设置自动清理Git Hooks"
echo "========================="

# 检查是否在Git仓库中
if [[ ! -d ".git" ]]; then
    echo "❌ 错误: 当前目录不是Git仓库"
    exit 1
fi

# 创建hooks目录（如果不存在）
mkdir -p .git/hooks

# 复制pre-commit hook
if [[ -f "scripts/pre-commit-hook.sh" ]]; then
    cp scripts/pre-commit-hook.sh .git/hooks/pre-commit
    chmod +x .git/hooks/pre-commit
    echo "✅ 已安装 pre-commit hook"
else
    echo "❌ 错误: scripts/pre-commit-hook.sh 文件不存在"
    exit 1
fi

# 设置清理脚本执行权限
if [[ -f "cleanup.sh" ]]; then
    chmod +x cleanup.sh
    echo "✅ 已设置 cleanup.sh 执行权限"
fi

if [[ -f "scripts/quick-clean.sh" ]]; then
    chmod +x scripts/quick-clean.sh
    echo "✅ 已设置 quick-clean.sh 执行权限"
fi

echo ""
echo "🎉 安装完成！"
echo ""
echo "现在每次 git commit 前都会自动清理临时文件"
echo ""
echo "可用命令:"
echo "  ./cleanup.sh          # 完整清理"
echo "  ./cleanup.sh --dry-run # 预览清理"
echo "  ./cleanup.sh --deep    # 深度清理"
echo "  ./scripts/quick-clean.sh # 快速清理"
