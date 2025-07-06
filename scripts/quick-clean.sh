#!/bin/bash
# 快速清理脚本 - 仅清理最常见的临时文件
# 适合在开发过程中频繁使用

echo "🚀 快速清理模式"
echo "================"

count=0

# 清理最常见的临时文件
patterns=(
    "*_REPORT.md"
    "*_LOG*.md" 
    "*_COMPLETE*.md"
    "*test*.html"
    "*debug*.html"
    "*.tmp"
    "*.bak"
    "*~"
    ".DS_Store"
    "Thumbs.db"
)

for pattern in "${patterns[@]}"; do
    for file in $pattern; do
        if [[ -f "$file" && "$file" != "README.md" ]]; then
            rm -f "$file"
            echo "删除: $file"
            ((count++))
        fi
    done
done

# 清理空的测试目录
test_dirs=("_test-pages" "_backup" "backup")
for dir in "${test_dirs[@]}"; do
    if [[ -d "$dir" && -z "$(ls -A "$dir")" ]]; then
        rmdir "$dir"
        echo "删除空目录: $dir"
        ((count++))
    fi
done

if [[ $count -eq 0 ]]; then
    echo "✅ 项目已是干净状态"
else
    echo "✅ 快速清理完成，删除了 $count 个项目"
fi
