const fs = require('fs');
const path = require('path');
const blogDir = path.join(__dirname, 'blog');
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));
const posts = files.map(file => {
  const content = fs.readFileSync(path.join(blogDir, file), 'utf-8');
  // 提取标题
  const titleMatch = content.match(/^#\s*(.+)/m);
  const title = titleMatch ? titleMatch[1].trim() : file;
  // 提取日期（如有）
  const dateMatch = content.match(/date\s*[:=]\s*([\d-]+)/i);
  let date = '';
  if (dateMatch) {
    date = dateMatch[1];
  } else if (/\d{4}-\d{2}-\d{2}/.test(file)) {
    date = file.match(/\d{4}-\d{2}-\d{2}/)[0];
  }
  // 提取摘要
  let summary = '';
  const summaryMatch = content.match(/\n([^#\n][^\n]{10,})/);
  if (summaryMatch) {
    summary = summaryMatch[1].replace(/!\[.*?\]\(.*?\)/g, '').trim().slice(0, 60);
  }
  // 提取图片
  const images = [];
  const imgRegex = /!\[.*?\]\((.*?)\)/g;
  let imgMatch;
  while ((imgMatch = imgRegex.exec(content)) !== null) {
    images.push(imgMatch[1]);
  }
  return { title, date, summary, file: `blog/${file}`, images };
});
fs.writeFileSync(path.join(blogDir, 'index.json'), JSON.stringify(posts, null, 2));
