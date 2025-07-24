document.addEventListener("DOMContentLoaded",function(){function i(e){"Escape"===e.key&&closeImageModal()}if(document.querySelectorAll(".blog-post-card").forEach(e=>{e=e.querySelector(".card-image img");e&&(e.style.opacity="0",e.addEventListener("load",function(){this.style.opacity="1",this.style.transition="opacity 0.3s ease"}),e.addEventListener("error",function(){console.warn("Failed to load image:",this.src),this.parentElement.classList.add("placeholder"),this.style.display="none";var e=document.createElement("div");e.className="image-fallback",e.innerHTML=`
                    <div class="category-icon">
                        <i class="fas fa-image"></i>
                    </div>
                    <span class="placeholder-text">图片加载失败</span>
                `,this.parentElement.appendChild(e)}))}),document.querySelectorAll(".image-overlay").forEach(e=>{e.addEventListener("click",function(e){e.preventDefault(),e.stopPropagation();var e=this.parentElement.querySelector("img"),t=this.closest(".blog-post-card").querySelector(".card-title a").textContent;e&&e.src&&openImageModal(e.src,e.alt||t,t)})}),window.openImageModal=function(e,t,a){let l=document.getElementById("imageModal");var o=(l=l||((o=document.createElement("div")).id="imageModal",o.className="image-modal",o.style.display="none",o.innerHTML=`
            <div class="modal-backdrop" onclick="closeImageModal()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title" id="modalTitle">图片预览</h3>
                    <button class="modal-close" onclick="closeImageModal()" aria-label="关闭">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <img id="modalImage" src="" alt="" loading="lazy">
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="closeImageModal()">关闭</button>
                </div>
            </div>
        `,document.body.appendChild(o),o)).querySelector("#modalImage"),n=l.querySelector("#modalTitle");o.src=e,o.alt=t,n.textContent=a||"图片预览",l.style.display="flex",document.body.style.overflow="hidden",document.addEventListener("keydown",i),o.style.opacity="0",o.addEventListener("load",function(){this.style.opacity="1",this.style.transition="opacity 0.3s ease"})},window.closeImageModal=function(){var e=document.getElementById("imageModal");e&&(e.style.display="none",document.body.style.overflow=""),document.removeEventListener("keydown",i)},"IntersectionObserver"in window){let t=new IntersectionObserver((e,t)=>{e.forEach(e=>{e.isIntersecting&&((e=e.target).classList.add("loading"),t.unobserve(e))})},{rootMargin:"50px 0px",threshold:.01});document.querySelectorAll(".card-image img[src]").forEach(e=>{t.observe(e)})}document.querySelectorAll(".image-comparison").forEach(e=>{var t=e.querySelector(".comparison-slider");let a=e.querySelector(".before-image");e=e.querySelector(".after-image");t&&a&&e&&t.addEventListener("input",function(){var e=this.value;a.style.clipPath=`inset(0 ${100-e}% 0 0)`})});let l=0,o=[];function n(e){(l+=e)<0?l=o.length-1:l>=o.length&&(l=0);var e=o[l],t=document.getElementById("modalImage"),a=document.querySelector(".gallery-counter");t.src=e.src,t.alt=e.alt,a&&(a.textContent=l+1+" / "+o.length)}window.openImageGallery=function(e,t=0){var a;o=e,l=t,0<e.length&&(t=e[l],openImageModal(t.src,t.alt,t.title),1<e.length)&&(t=(t=document.getElementById("imageModal")).querySelector(".modal-body"),(e=document.createElement("button")).className="gallery-nav prev",e.innerHTML='<i class="fas fa-chevron-left"></i>',e.onclick=()=>n(-1),(a=document.createElement("button")).className="gallery-nav next",a.innerHTML='<i class="fas fa-chevron-right"></i>',a.onclick=()=>n(1),t.appendChild(e),t.appendChild(a),(e=document.createElement("div")).className="gallery-counter",e.textContent=l+1+" / "+o.length,t.appendChild(e))}});