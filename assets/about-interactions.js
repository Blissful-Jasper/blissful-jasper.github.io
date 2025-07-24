function adjustFontSizes(){var e=window.innerWidth,t=document.querySelector(".name-en");t&&(t.style.fontSize=e<576?"2rem":e<768?"2.5rem":e<1024?"3rem":"3.5rem")}document.addEventListener("DOMContentLoaded",function(){document.querySelectorAll('a[href^="#"]').forEach(e=>{e.addEventListener("click",function(e){e.preventDefault();e=this.getAttribute("href").substring(1),e=document.getElementById(e);e&&e.scrollIntoView({behavior:"smooth",block:"start"})})});let t=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&e.target.classList.add("animate-in")})},{threshold:.1,rootMargin:"0px 0px -50px 0px"});document.querySelectorAll(".content-card").forEach(e=>{t.observe(e)}),document.querySelectorAll(".interest-item").forEach(e=>{t.observe(e)}),document.querySelectorAll(".timeline-item").forEach(e=>{t.observe(e)});var e=document.querySelector(".hero-stats");if(e){let t=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&(e.target.querySelectorAll(".stat-number").forEach((a,i)=>{let s=[3,5,10];setTimeout(()=>{{var[r,o,e=2e3]=[a,s[i]];let t=0,n=o/(e/16);!function e(){(t+=n)<o?(r.textContent=Math.ceil(t)+"+",requestAnimationFrame(e)):r.textContent=o+"+"}()}},300*i)}),t.unobserve(e.target))})},{threshold:.5});t.observe(e)}function r(e){let t=document.createElement("div");t.className="toast-notification",t.textContent=e,t.style.cssText=`
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(79, 70, 229, 0.9);
            color: white;
            padding: 1rem 2rem;
            border-radius: 50px;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            font-weight: 500;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        `,document.body.appendChild(t),setTimeout(()=>{t.style.transform="translateX(0)"},100),setTimeout(()=>{t.style.transform="translateX(100%)",setTimeout(()=>{document.body.removeChild(t)},300)},3e3)}window.addEventListener("scroll",()=>{var e=window.pageYOffset,t=document.querySelector(".hero-section"),n=document.querySelector(".hero-avatar"),r=document.querySelector(".profile-ring");t&&e<window.innerHeight&&(t.style.transform=`translate3d(0, ${t=-.5*e}px, 0)`,n&&(n.style.transform=`translate3d(0, ${.3*t}px, 0)`),r)&&(r.style.transform=`translate3d(0, ${.2*t}px, 0) rotate(${.1*e}deg)`)}),document.querySelectorAll(".skill-tag").forEach(e=>{e.addEventListener("mouseenter",function(){this.style.transform="translateY(-3px) scale(1.05)"}),e.addEventListener("mouseleave",function(){this.style.transform="translateY(0) scale(1)"})}),document.querySelectorAll(".contact-item").forEach(e=>{let t=e.querySelector(".contact-info p"),n=e.querySelector(".contact-info p");t&&t.textContent.includes("@")&&(e.style.cursor="pointer",e.addEventListener("click",()=>{navigator.clipboard.writeText(t.textContent).then(()=>{r("邮箱地址已复制到剪贴板")})})),n&&n.textContent.includes("+86")&&(e.style.cursor="pointer",e.addEventListener("click",()=>{navigator.clipboard.writeText(n.textContent).then(()=>{r("电话号码已复制到剪贴板")})}))});e=document.querySelector(".scroll-indicator"),e&&e.addEventListener("click",()=>{var e=document.querySelector(".about-content-section");e&&e.scrollIntoView({behavior:"smooth"})}),e=document.querySelector(".hero-avatar"),e&&(e.addEventListener("mouseenter",function(){this.style.transform="scale(1.05)",this.style.filter="brightness(1.1)"}),e.addEventListener("mouseleave",function(){this.style.transform="scale(1)",this.style.filter="brightness(1)"})),e=document.createElement("style");e.textContent=`
        .content-card,
        .interest-item,
        .timeline-item {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .content-card.animate-in,
        .interest-item.animate-in,
        .timeline-item.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .interest-item.animate-in {
            animation: slideInUp 0.6s ease forwards;
        }
        
        .timeline-item.animate-in {
            animation: slideInLeft 0.6s ease forwards;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `,document.head.appendChild(e),document.querySelectorAll(".social-link").forEach(e=>{e.addEventListener("click",function(){var e=this.title||this.querySelector("span").textContent;console.log("Social link clicked: "+e)})}),window.addEventListener("beforeprint",()=>{document.body.classList.add("print-mode")}),window.addEventListener("afterprint",()=>{document.body.classList.remove("print-mode")})}),window.addEventListener("load",adjustFontSizes),window.addEventListener("resize",adjustFontSizes);