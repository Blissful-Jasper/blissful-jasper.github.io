function initializeFilterButtons(){let t=document.querySelectorAll(".filter-btn"),a=document.querySelectorAll(".gallery-item");t.forEach(e=>{e.addEventListener("click",function(){handleCategoryFilter(this.dataset.category,t,a)})})}function handleCategoryFilter(t,e,a){e.forEach(e=>e.classList.remove("active")),event.target.classList.add("active"),a.forEach(e=>{("all"===t||e.dataset.category===t?showGalleryItem:hideGalleryItem)(e)}),updateGalleryStats(t,a)}function showGalleryItem(e){e.style.display="block",e.classList.add("filter-animate"),setTimeout(()=>{e.classList.remove("filter-animate")},500)}function hideGalleryItem(e){e.style.display="none"}function initializeLightbox(){let t=document.getElementById("lightbox");var e;t&&(t.addEventListener("click",e=>{e.target===t&&closeLightbox()}),e=t.querySelector(".lightbox-content"))&&e.addEventListener("click",e=>{e.stopPropagation()})}function openLightbox(t,a,i,o={}){let n=document.getElementById("lightbox"),l=document.getElementById("lightbox-image");var r=document.getElementById("lightbox-title"),s=document.getElementById("lightbox-description");let c=document.getElementById("imageLoading");if(n&&l){window.currentImageData={src:t,title:a||"图片",description:i||"",originalPath:o.originalPath||t,thumbnail:o.thumbnail||t,metadata:o.metadata||{}},r.textContent=a||"图片",s.textContent=i||"",c.style.display="flex",l.style.opacity="0";let e=new Image;e.onload=function(){l.src=this.src,l.alt=a||"图片",l.style.opacity="1",c.style.display="none",resetZoom()},e.onerror=function(){console.warn("Failed to load image:",t),o.originalPath&&o.originalPath!==t?e.src=o.originalPath:c.innerHTML='<i class="fas fa-exclamation-triangle"></i><span>图片加载失败</span>'},e.src=t,n.style.display="flex",document.body.style.overflow="hidden",setTimeout(()=>{n.classList.add("active")},10),updateImageMeta(o.metadata||{}),document.addEventListener("keydown",handleLightboxKeyboard)}else console.warn("Lightbox elements not found")}function updateImageMeta(t){var a=document.getElementById("lightbox-meta");if(a){let e="";t.location&&(e+=`<div class="meta-item"><i class="fas fa-map-marker-alt"></i> ${t.location}</div>`),t.date&&(e+=`<div class="meta-item"><i class="fas fa-calendar"></i> ${t.date}</div>`),t.camera&&(e+=`<div class="meta-item"><i class="fas fa-camera"></i> ${t.camera}</div>`),t.size&&(e+=`<div class="meta-item"><i class="fas fa-expand-arrows-alt"></i> ${t.size}</div>`),a.innerHTML=e}}function getOriginalImagePath(e){if(e.startsWith("http://")||e.startsWith("https://"))return e;e.startsWith("/")||(e="/"+e);e=window.location.origin+e;return console.log("Original image path:",e),e}function viewOriginalImage(){if(window.currentImageData){var t=getOriginalImagePath(window.currentImageData.originalPath);let e=document.createElement("div");e.className="original-image-viewer",e.innerHTML=`
    <div class="original-viewer-overlay" onclick="closeOriginalViewer()"></div>
    <div class="original-viewer-content">
      <div class="original-viewer-header">
        <div class="viewer-title">
          <i class="fas fa-expand-arrows-alt"></i>
          <span>原图查看 - ${window.currentImageData.title}</span>
        </div>
        <div class="viewer-controls">
          <button class="viewer-btn" onclick="downloadOriginalImage()" title="下载原图">
            <i class="fas fa-download"></i>
            下载
          </button>
          <button class="viewer-btn" onclick="openInNewTab('${t}')" title="在新标签页打开">
            <i class="fas fa-external-link-alt"></i>
            新窗口
          </button>
          <button class="viewer-btn viewer-close" onclick="closeOriginalViewer()" title="关闭">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      
      <div class="original-image-container">
        <div class="image-loading-state" id="originalImageLoading">
          <div class="loading-spinner"></div>
          <span>正在加载原图...</span>
        </div>
        <img id="originalImage" 
             src="${t}" 
             alt="${window.currentImageData.title}"
             onload="onOriginalImageLoad()"
             onerror="onOriginalImageError()"
             style="display: none;">
        <div class="image-zoom-controls">
          <button onclick="zoomOriginalImage(1.2)" title="放大"><i class="fas fa-search-plus"></i></button>
          <button onclick="zoomOriginalImage(0.8)" title="缩小"><i class="fas fa-search-minus"></i></button>
          <button onclick="resetOriginalZoom()" title="重置"><i class="fas fa-compress"></i></button>
          <button onclick="fitToScreen()" title="适应屏幕"><i class="fas fa-expand"></i></button>
        </div>
      </div>
      
      <div class="original-image-info">
        <div class="image-details">
          <span class="detail-item"><i class="fas fa-image"></i> 原始尺寸</span>
          <span class="detail-item" id="imageSize">加载中...</span>
        </div>
        ${window.currentImageData.description?`<p class="image-description">${window.currentImageData.description}</p>`:""}
      </div>
    </div>
  `,document.body.appendChild(e),document.body.style.overflow="hidden",setTimeout(()=>{e.classList.add("active")},10)}else showNotification("无法获取图片信息")}function onOriginalImageLoad(){var e=document.getElementById("originalImageLoading"),t=document.getElementById("originalImage"),a=document.getElementById("imageSize");e&&(e.style.display="none"),t&&(t.style.display="block",a)&&(a.textContent=t.naturalWidth+" × "+t.naturalHeight)}function onOriginalImageError(){var e=document.getElementById("originalImageLoading"),a=document.getElementById("originalImage");if(e&&(e.innerHTML=`
      <i class="fas fa-exclamation-triangle" style="color: #ff6b6b; font-size: 24px;"></i>
      <span>原图加载失败</span>
      <small style="display: block; margin-top: 5px; opacity: 0.7;">正在尝试其他路径...</small>
    `),window.currentImageData&&a){var i=window.currentImageData.originalPath,o=[i,i.replace(".JPG",".jpg"),i.replace(".jpg",".JPG"),i.replace("/pictures/","/assets/pictures/"),window.currentImageData.thumbnail];let t=0;var n=a.src;for(let e=0;e<o.length;e++)if(n.includes(o[e])){t=e;break}++t<o.length?(i=getOriginalImagePath(o[t]),console.log("Trying alternative path:",i),a.src=i):e&&(e.innerHTML=`
          <i class="fas fa-exclamation-triangle" style="color: #ff6b6b; font-size: 24px;"></i>
          <span>无法加载原图</span>
          <small style="display: block; margin-top: 5px; opacity: 0.7;">图片文件可能不存在或网络连接问题</small>
          <button onclick="retryOriginalLoad()" style="margin-top: 10px; padding: 5px 10px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">重试</button>
        `)}}function retryOriginalLoad(){var e,t;window.currentImageData&&(t=document.getElementById("originalImageLoading"),e=document.getElementById("originalImage"),t&&(t.innerHTML=`
      <div class="loading-spinner"></div>
      <span>重新加载中...</span>
    `,t.style.display="flex"),e)&&(e.style.display="none",t=getOriginalImagePath(window.currentImageData.originalPath),e.src=t+"?t="+Date.now())}function closeOriginalViewer(){let e=document.querySelector(".original-image-viewer");e&&(e.classList.remove("active"),setTimeout(()=>{document.body.removeChild(e),document.body.style.overflow=""},300))}function openInNewTab(e){window.open(e,"_blank")}function downloadOriginalImage(){var e,t;window.currentImageData&&(e=getOriginalImagePath(window.currentImageData.originalPath),(t=document.createElement("a")).href=e,t.download=window.currentImageData.title+".jpg",document.body.appendChild(t),t.click(),document.body.removeChild(t),showNotification("开始下载原图"))}function downloadImage(){window.currentImageData?downloadImageFromUrl(getOriginalImagePath(window.currentImageData.originalPath),window.currentImageData.title):showNotification("无法获取图片信息")}function downloadImageFromUrl(t,e){try{var a=document.createElement("a");a.href=t,a.download=e+".jpg",a.target="_blank",document.body.appendChild(a),a.click(),document.body.removeChild(a),showNotification("开始下载图片")}catch(e){console.error("Download failed:",e),window.open(t,"_blank"),showNotification("已在新窗口打开图片，请右键保存")}}document.addEventListener("DOMContentLoaded",function(){initializeFilterButtons(),initializeLightbox(),initializeImageLoading(),updatePageStats(),updateCurrentTime()});let originalZoom=1;function zoomOriginalImage(e){var t=document.getElementById("originalImage");t&&(originalZoom*=e,originalZoom=Math.max(.2,Math.min(originalZoom,5)),t.style.transform=`scale(${originalZoom})`,t.style.transition="transform 0.3s ease")}function resetOriginalZoom(){var e=document.getElementById("originalImage");e&&(originalZoom=1,e.style.transform="scale(1)",e.style.transition="transform 0.3s ease")}function fitToScreen(){var e,t=document.getElementById("originalImage"),a=document.querySelector(".original-image-container");t&&a&&(a=a.getBoundingClientRect(),t.getBoundingClientRect(),e=.9*a.width/t.naturalWidth,a=.9*a.height/t.naturalHeight,originalZoom=Math.min(e,a),t.style.transform=`scale(${originalZoom})`,t.style.transition="transform 0.3s ease")}function shareCurrentImage(){window.currentImageData&&(navigator.share?navigator.share({title:window.currentImageData.title,text:window.currentImageData.description,url:window.currentImageData.originalPath}).catch(console.error):navigator.clipboard.writeText(window.currentImageData.originalPath).then(()=>{showNotification("图片链接已复制到剪贴板")}).catch(()=>{prompt("图片链接（请手动复制）:",window.currentImageData.originalPath)}))}let currentZoom=1;function zoomImage(e){var t=document.getElementById("lightbox-image");t&&(currentZoom*=e,currentZoom=Math.max(.5,Math.min(currentZoom,3)),t.style.transform=`scale(${currentZoom})`,t.style.transition="transform 0.3s ease")}function resetZoom(){var e=document.getElementById("lightbox-image");e&&(currentZoom=1,e.style.transform="scale(1)",e.style.transition="transform 0.3s ease")}function showNotification(e){let t=document.createElement("div");t.className="gallery-notification",t.innerHTML=`
    <i class="fas fa-check-circle"></i>
    <span>${e}</span>
  `,document.body.appendChild(t),setTimeout(()=>{t.classList.add("show")},100),setTimeout(()=>{t.classList.remove("show"),setTimeout(()=>t.remove(),300)},3e3)}function closeLightbox(){let e=document.getElementById("lightbox");e&&(e.classList.remove("active"),setTimeout(()=>{e.style.display="none",document.body.style.overflow=""},300),window.currentImageData=null,resetZoom(),document.removeEventListener("keydown",handleLightboxKeyboard))}function handleLightboxKeyboard(e){switch(e.key){case"Escape":closeLightbox();break;case"+":case"=":e.preventDefault(),zoomImage(1.2);break;case"-":e.preventDefault(),zoomImage(.8);break;case"0":e.preventDefault(),resetZoom();break;case"o":case"O":e.preventDefault(),viewOriginalImage();break;case"d":case"D":e.preventDefault(),downloadImage()}}function initializeImageLoading(){document.querySelectorAll(".gallery-item img").forEach(e=>{e.classList.add("loading"),e.onload=function(){this.classList.remove("loading"),this.classList.add("loaded")},e.onerror=function(){this.classList.remove("loading"),this.classList.add("error"),console.error("Failed to load image:",this.src)}})}function updateGalleryStats(a,e){var i=document.getElementById("totalPhotos");if(i){let t=0;"all"===a?t=e.length:e.forEach(e=>{e.dataset.category===a&&t++}),i.textContent=t}}function updatePageStats(){var t=document.getElementById("currentTime"),t=(t&&(a=(new Date).toLocaleString("zh-CN",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}),t.textContent="当前时间："+a),document.getElementById("visitorInfo"));if(t){var a=localStorage.getItem("gallery-visits")||0,a=parseInt(a)+1,i=(localStorage.setItem("gallery-visits",a),localStorage.getItem("gallery-last-visit")),o=new Date;if(i){i=new Date(i),i=Math.floor((o-i)/6e4);let e="";e=i<1?"刚刚":i<60?i+"分钟前":i<1440?Math.floor(i/60)+"小时前":Math.floor(i/1440)+"天前",t.innerHTML=`第${a}次访问 | 上次访问：`+e}else t.innerHTML=`欢迎首次访问！这是第${a}次访问`;localStorage.setItem("gallery-last-visit",o.toISOString())}}function updateCurrentTime(){setInterval(()=>{var e,t=document.getElementById("currentTime");t&&(e=(new Date).toLocaleString("zh-CN",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}),t.textContent="当前时间："+e)},1e3)}function getUniqueCategories(e){e=Array.from(e).map(e=>e.dataset.category);return[...new Set(e)]}function debugGalleryInfo(){let e=document.querySelectorAll(".gallery-item");var t=getUniqueCategories(e);console.log("Gallery Debug Info:"),console.log("Total items:",e.length),console.log("Categories:",t),console.log("Items per category:",t.map(t=>({category:t,count:Array.from(e).filter(e=>e.dataset.category===t).length})))}function sharePhoto(t,a){navigator.share?navigator.share({title:t,text:"查看这张照片："+t,url:a}).catch(e=>{console.log("分享失败:",e),fallbackShare(t,a)}):fallbackShare(t,a)}function fallbackShare(e,t){navigator.clipboard?navigator.clipboard.writeText(t).then(()=>{showToast("图片链接已复制到剪贴板！")}).catch(()=>{showManualCopyDialog(t)}):showManualCopyDialog(t)}function showManualCopyDialog(e){let t=document.createElement("div");t.className="share-dialog",t.innerHTML=`
    <div class="share-dialog-content">
      <h3>分享链接</h3>
      <input type="text" value="${e}" readonly onclick="this.select()">
      <div class="dialog-buttons">
        <button onclick="this.closest('.share-dialog').remove()">关闭</button>
      </div>
    </div>
  `,document.body.appendChild(t);e=t.querySelector("input");e.focus(),e.select(),t.addEventListener("click",e=>{e.target===t&&t.remove()})}function showToast(e){let t=document.createElement("div");t.className="toast-message",t.textContent=e,document.body.appendChild(t),setTimeout(()=>{t.classList.add("show")},100),setTimeout(()=>{t.classList.remove("show"),setTimeout(()=>t.remove(),300)},3e3)}function handleImageError(e,t,a){e.dataset.retryCount?(e.src=createPlaceholderImage(e.alt),e.parentElement.classList.add("image-error")):(e.dataset.retryCount="1",tryImagePaths(e,[a,t,t.replace("/pictures/","./pictures/"),t.replace("/pictures/","/assets/pictures/"),window.location.origin+t],0))}function tryImagePaths(e,t,a){var i;a>=t.length?(e.src=createPlaceholderImage(e.alt),e.parentElement.classList.add("image-error")):((i=new Image).onload=function(){e.src=t[a],e.parentElement.classList.add("image-success")},i.onerror=function(){tryImagePaths(e,t,a+1)},i.src=t[a])}function createPlaceholderImage(e){return"data:image/svg+xml;base64,"+btoa(unescape(encodeURIComponent(`
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:0.1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:0.1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
      <rect x="50" y="50" width="300" height="200" fill="none" stroke="#667eea" stroke-width="2" stroke-dasharray="5,5" rx="8"/>
      <text x="200" y="140" font-family="'Segoe UI', Arial, sans-serif" font-size="14" fill="#667eea" text-anchor="middle">
        <tspan x="200" dy="0">🖼️ 图片加载失败</tspan>
        <tspan x="200" dy="20">${e||"未知图片"}</tspan>
      </text>
    </svg>
  `)))}function getOriginalImagePath(e){let t=e;return[t=(t=(t=(t=(t=t.replace("/thumbs/","/")).replace("_thumb","")).replace("-thumb","")).replace("_small","")).replace("-small",""),t.replace("/_picture/","/pictures/"),t.replace("/assets/","/"),t.replace("/gallery/","/pictures/"),"/pictures/"+t.split("/").pop()][0]}function addViewOriginalButton(e,t){var a=document.getElementById("lightbox");let i=a.querySelector(".view-original-btn");!i&&((i=document.createElement("button")).className="view-original-btn",i.innerHTML='<i class="fas fa-expand-arrows-alt"></i> 查看原图',a=a.querySelector(".lightbox-content"))&&a.appendChild(i),i.onclick=function(){window.open(e,"_blank")}}function openLightboxFromButton(e){var t=e.dataset.image,a=e.dataset.title,i=e.dataset.description,o=e.dataset.original,n=e.dataset.location,l=e.dataset.date,r=e.dataset.camera,e=e.dataset.tags,o={originalPath:o,thumbnail:t,metadata:{location:n,date:l,camera:r,tags:e?e.split(","):[]}};console.log("Opening lightbox from button:",{imageSrc:t,title:a,description:i,options:o}),openLightbox(t,a,i,o)}function sharePhotoFromButton(e){sharePhoto(e.dataset.title,e.dataset.image)}