function initializeTOC(){var e=document.querySelectorAll(".post-content h1, .post-content h2, .post-content h3, .post-content h4"),t=document.getElementById("tocContent");if(0===e.length)document.querySelector(".toc-trigger").style.display="none";else{let i=document.createElement("ul");e.forEach((e,t)=>{let o="heading-"+t;e.id=o;var t=document.createElement("li"),n=document.createElement("a");n.href="#"+o,n.textContent=e.textContent,n.className="toc-level-"+e.tagName.toLowerCase(),n.addEventListener("click",function(e){e.preventDefault(),document.getElementById(o).scrollIntoView({behavior:"smooth"}),window.innerWidth<=768&&toggleToc()}),t.appendChild(n),i.appendChild(t)}),t.appendChild(i),window.addEventListener("scroll",updateTOCHighlight)}}function updateTOCHighlight(){var e=document.querySelectorAll(".post-content h1, .post-content h2, .post-content h3, .post-content h4"),t=document.querySelectorAll(".toc-content a");let o=null;window.pageYOffset;e.forEach((e,t)=>{e.getBoundingClientRect().top<=100&&(o=t)}),t.forEach((e,t)=>{e.classList.toggle("active",t===o)})}function toggleToc(){document.getElementById("tocContainer").classList.toggle("active")}function initializeBackToTop(){let e=document.querySelector(".back-to-top");window.addEventListener("scroll",function(){300<window.pageYOffset?e.classList.add("visible"):e.classList.remove("visible")})}function scrollToTop(){window.scrollTo({top:0,behavior:"smooth"})}function sharePost(){navigator.share?navigator.share({title:document.title,url:window.location.href}):copyUrl()}function shareToWeibo(){var e=encodeURIComponent(window.location.href),t=encodeURIComponent(document.title);window.open(`https://service.weibo.com/share/share.php?url=${e}&title=`+t,"_blank")}function shareToTwitter(){var e=encodeURIComponent(window.location.href),t=encodeURIComponent(document.title);window.open(`https://twitter.com/intent/tweet?url=${e}&text=`+t,"_blank")}function copyUrl(){navigator.clipboard.writeText(window.location.href).then(function(){showToast("链接已复制到剪贴板！")},function(){var e=document.createElement("textarea");e.value=window.location.href,document.body.appendChild(e),e.select(),document.execCommand("copy"),document.body.removeChild(e),showToast("链接已复制到剪贴板！")})}function showToast(e){let t=document.createElement("div");t.className="toast",t.textContent=e,t.style.cssText=`
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #2c3e50;
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 6px;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
    `,document.body.appendChild(t),setTimeout(()=>{t.style.opacity="1"},10),setTimeout(()=>{t.style.opacity="0",setTimeout(()=>{document.body.removeChild(t)},300)},3e3)}function initializeImageZoom(){document.querySelectorAll(".post-content img").forEach(e=>{e.style.cursor="zoom-in",e.addEventListener("click",function(){openImageModal(this)})})}function openImageModal(e){let t=document.createElement("div");t.className="image-modal",t.innerHTML=`
        <div class="modal-backdrop" onclick="closeImageModal(this)"></div>
        <div class="modal-content">
            <img src="${e.src}" alt="${e.alt}" style="max-width: 90vw; max-height: 90vh;">
            <button class="modal-close" onclick="closeImageModal(this)">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `,t.style.cssText=`
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
    `,t.querySelector(".modal-content").style.cssText=`
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
    `,t.querySelector(".modal-close").style.cssText=`
        position: absolute;
        top: -40px;
        right: -40px;
        background: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        font-size: 1.2rem;
        color: #333;
    `,document.body.appendChild(t),setTimeout(()=>{t.style.opacity="1"},10),document.body.style.overflow="hidden"}function closeImageModal(e){let t=e.closest(".image-modal");t.style.opacity="0",setTimeout(()=>{document.body.removeChild(t),document.body.style.overflow="auto"},300)}function initializeCodeHighlight(){document.querySelectorAll("pre code").forEach(e=>{let t=document.createElement("button");t.className="code-copy-btn",t.innerHTML='<i class="fas fa-copy"></i>',t.style.cssText=`
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            padding: 0.5rem;
            border-radius: 4px;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;var o=e.parentNode;o.style.position="relative",o.appendChild(t),o.addEventListener("mouseenter",()=>{t.style.opacity="1"}),o.addEventListener("mouseleave",()=>{t.style.opacity="0"}),t.addEventListener("click",()=>{navigator.clipboard.writeText(e.textContent).then(()=>{t.innerHTML='<i class="fas fa-check"></i>',setTimeout(()=>{t.innerHTML='<i class="fas fa-copy"></i>'},2e3)})})})}function initializeScrollProgress(){let t=document.createElement("div");t.className="scroll-progress",t.style.cssText=`
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #3498db, #2ecc71);
        z-index: 9999;
        transition: width 0.1s ease;
    `,document.body.appendChild(t),window.addEventListener("scroll",()=>{var e=window.pageYOffset/(document.body.scrollHeight-window.innerHeight)*100;t.style.width=e+"%"})}function initializeLazyLoading(){var e=document.querySelectorAll("img[data-src]");let t=new IntersectionObserver((e,t)=>{e.forEach(e=>{e.isIntersecting&&((e=e.target).src=e.dataset.src,e.classList.remove("lazy"),t.unobserve(e))})});e.forEach(e=>t.observe(e))}function calculateReadingTime(){var e,t=document.querySelector(".post-content");t&&(t=t.textContent.length,t=Math.ceil(t/200),e=document.querySelector(".reading-time"))&&(e.textContent=t+" 分钟阅读")}document.addEventListener("DOMContentLoaded",function(){initializeTOC(),initializeBackToTop(),initializeImageZoom(),initializeCodeHighlight(),initializeScrollProgress()}),document.addEventListener("keydown",function(e){"Escape"===e.key&&document.getElementById("tocContainer").classList.contains("active")&&toggleToc(),"t"!==e.key&&"T"!==e.key||e.ctrlKey||e.altKey||e.shiftKey||(e.preventDefault(),toggleToc()),"Home"===e.key&&(e.preventDefault(),scrollToTop())}),document.addEventListener("click",function(e){"A"===e.target.tagName&&e.target.getAttribute("href").startsWith("#")&&(e.preventDefault(),e=e.target.getAttribute("href").substring(1),e=document.getElementById(e))&&e.scrollIntoView({behavior:"smooth"})});