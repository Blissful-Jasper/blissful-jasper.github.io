const fs = require('fs');
const path = require('path');
const marked = require('marked');

const inputDir = './blog';
const outputDir = './blog-html';

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

fs.readdirSync(inputDir).forEach(file => {
    if (path.extname(file) === '.md') {
        const markdown = fs.readFileSync(path.join(inputDir, file), 'utf-8');
        const html = marked(markdown);
        const outputFile = path.join(outputDir, path.basename(file, '.md') + '.html');
        fs.writeFileSync(outputFile, html);
        console.log(`Converted: ${file} -> ${outputFile}`);
    }
});
