# =============================================================================
# 📄 scripts/new-post.sh - 创建新文章脚本
# =============================================================================
#!/bin/bash

# Get current date
DATE=$(date +"%Y-%m-%d")
DATETIME=$(date +"%Y-%m-%d %H:%M:%S %z")

# Get post title from user
read -p "Enter post title: " TITLE

# Create filename
FILENAME="_posts/${DATE}-$(echo $TITLE | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/-$//').markdown"

# Create post content
cat > "$FILENAME" << EOF
---
layout: post
title:  "$TITLE"
date:   $DATETIME
categories: updates
tags: []
---

Write your post content here...

## Introduction

## Main Content

## Conclusion

---

*Posted on $(date +"%B %d, %Y")*
EOF

echo "✅ New post created: $FILENAME"
echo "📝 Edit the file and add your content!"
