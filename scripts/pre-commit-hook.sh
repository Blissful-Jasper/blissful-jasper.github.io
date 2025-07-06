#!/bin/bash
# Git Pre-commit Hook - 自动项目清理
# 此文件应该复制到 .git/hooks/pre-commit 并设置执行权限

echo "🧹 运行自动项目清理..."

# 检查清理脚本是否存在
if [[ -f "cleanup.sh" ]]; then
    # 运行清理脚本 (静默模式)
    ./cleanup.sh > /dev/null 2>&1
    
    # 检查是否有文件被删除
    if git diff --quiet && git diff --staged --quiet; then
        echo "✅ 项目已是干净状态"
    else
        echo "🗑️  清理了临时文件和日志"
        # 将清理后的更改添加到staging area
        git add .
    fi
else
    echo "⚠️  清理脚本未找到，跳过自动清理"
fi

echo "✅ 预提交检查完成"
exit 0
