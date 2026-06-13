(function () {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      registrations.forEach(function (registration) {
        registration.unregister();
      });
    });
  }

  var root = document.documentElement;
  var storedTheme = localStorage.getItem("theme");
  if (storedTheme) {
    root.setAttribute("data-theme", storedTheme);
  }

  var navToggle = document.querySelector(".nav-toggle");
  var navPanel = document.querySelector(".nav-panel");
  if (navToggle && navPanel) {
    navToggle.addEventListener("click", function () {
      var open = navPanel.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
  }

  var themeToggle = document.querySelector("[data-theme-toggle]");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    });
  }

  var search = document.querySelector("[data-post-search]");
  var category = document.querySelector("[data-post-category]");
  var posts = Array.prototype.slice.call(document.querySelectorAll("[data-post-card]"));
  var count = document.querySelector("[data-post-count]");

  function normalize(value) {
    return (value || "").toString().toLowerCase();
  }

  function filterPosts() {
    if (!posts.length) return;
    var query = normalize(search && search.value);
    var selected = normalize(category && category.value);
    var visible = 0;

    posts.forEach(function (card) {
      var haystack = normalize(card.getAttribute("data-title") + " " + card.getAttribute("data-tags") + " " + card.textContent);
      var cardCategory = normalize(card.getAttribute("data-category"));
      var matchQuery = !query || haystack.indexOf(query) !== -1;
      var matchCategory = !selected || cardCategory === selected;
      var show = matchQuery && matchCategory;
      card.hidden = !show;
      if (show) visible += 1;
    });

    if (count) count.textContent = visible;
  }

  if (search) search.addEventListener("input", filterPosts);
  if (category) category.addEventListener("change", filterPosts);
  filterPosts();

  var toc = document.querySelector("[data-toc]");
  var tocContent = document.querySelector("[data-toc-content]");
  if (toc && tocContent) {
    var headings = Array.prototype.slice.call(tocContent.querySelectorAll("h2, h3"));
    if (headings.length) {
      headings.forEach(function (heading, index) {
        if (!heading.id) {
          heading.id = "section-" + (index + 1);
        }
        var link = document.createElement("a");
        link.href = "#" + heading.id;
        link.textContent = heading.textContent;
        link.className = heading.tagName.toLowerCase() === "h3" ? "toc-h3" : "toc-h2";
        toc.appendChild(link);
      });
    } else {
      toc.hidden = true;
    }
  }
})();
