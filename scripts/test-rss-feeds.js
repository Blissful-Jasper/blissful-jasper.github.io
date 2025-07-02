// RSS链接验证脚本
// 用于测试各个期刊的RSS链接是否可用

const testUrls = [
    // AMS期刊
    'https://journals.ametsoc.org/action/showFeed?type=etoc&feed=rss&jc=atsc',
    'https://journals.ametsoc.org/action/showFeed?type=etoc&feed=rss&jc=clim',
    'https://journals.ametsoc.org/journalissuetocrss/journals/atsc/atsc-overview.xml',
    'https://journals.ametsoc.org/journalissuetocrss/journals/clim/clim-overview.xml',
    
    // AGU期刊
    'https://agupubs.onlinelibrary.wiley.com/action/showFeed?jc=19448007&type=etoc&feed=rss',
    'https://agupubs.onlinelibrary.wiley.com/action/showFeed?jc=21698996&type=etoc&feed=rss',
    'https://agupubs.onlinelibrary.wiley.com/action/showFeed?jc=19422466&type=etoc&feed=rss',
    'https://agupubs.onlinelibrary.wiley.com/rss/journal/19448007',
    'https://agupubs.onlinelibrary.wiley.com/rss/journal/21698996',
    'https://agupubs.onlinelibrary.wiley.com/rss/journal/19422466',
    
    // Nature期刊
    'https://www.nature.com/nature.rss',
    'https://www.nature.com/ngeo.rss',
    'https://www.nature.com/nclimate.rss',
    
    // Science期刊
    'https://www.science.org/action/showFeed?type=axatoc&feed=rss&jc=science',
    'https://www.science.org/action/showFeed?type=etoc&feed=rss&jc=sciadv'
];

async function testRSSUrl(url) {
    try {
        console.log(`Testing: ${url}`);
        
        // 使用CORS代理
        const corsProxy = 'https://api.allorigins.win/raw?url=';
        const response = await fetch(corsProxy + encodeURIComponent(url));
        
        if (!response.ok) {
            console.log(`❌ HTTP ${response.status}: ${response.statusText}`);
            return false;
        }
        
        const text = await response.text();
        
        if (!text || text.length < 100) {
            console.log(`❌ Empty or too short response (${text.length} chars)`);
            return false;
        }
        
        if (text.toLowerCase().includes('<!doctype html') || text.toLowerCase().includes('<html')) {
            console.log(`❌ Returns HTML instead of XML`);
            return false;
        }
        
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'text/xml');
        
        const parseError = xmlDoc.querySelector('parsererror');
        if (parseError) {
            console.log(`❌ XML parsing error: ${parseError.textContent}`);
            return false;
        }
        
        const isRSS = xmlDoc.querySelector('rss') || xmlDoc.querySelector('channel');
        const isAtom = xmlDoc.querySelector('feed');
        
        if (!isRSS && !isAtom) {
            console.log(`❌ Not a valid RSS/Atom feed`);
            return false;
        }
        
        const items = xmlDoc.querySelectorAll('item, entry');
        console.log(`✅ Valid RSS/Atom with ${items.length} items`);
        return true;
        
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
        return false;
    }
}

async function testAllUrls() {
    console.log('=== RSS Links Validation Test ===\n');
    
    const results = {};
    
    for (const url of testUrls) {
        const isValid = await testRSSUrl(url);
        results[url] = isValid;
        console.log(''); // 空行分隔
        
        // 延迟避免请求过于频繁
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('=== Summary ===');
    console.log('Valid URLs:');
    Object.entries(results).forEach(([url, isValid]) => {
        if (isValid) {
            console.log(`✅ ${url}`);
        }
    });
    
    console.log('\nInvalid URLs:');
    Object.entries(results).forEach(([url, isValid]) => {
        if (!isValid) {
            console.log(`❌ ${url}`);
        }
    });
    
    const validCount = Object.values(results).filter(Boolean).length;
    console.log(`\nTotal: ${validCount}/${testUrls.length} URLs are valid`);
}

// 如果在浏览器环境中运行
if (typeof window !== 'undefined') {
    window.testRSSFeeds = testAllUrls;
    console.log('RSS test function loaded. Run testRSSFeeds() to start testing.');
}

// 如果在Node.js环境中运行
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { testAllUrls, testRSSUrl };
}
