---
layout: page
title: "Blog"
permalink: /blog/
description: "Explore my thoughts on climate science, machine learning, and research"
---

## Latest Posts

<div class="blog-filters">
  <div class="filter-buttons">
    <button class="filter-btn active" data-filter="all">All Posts</button>
    <button class="filter-btn" data-filter="research">Research</button>
    <button class="filter-btn" data-filter="tutorials">Tutorials</button>
    <button class="filter-btn" data-filter="climate">Climate Science</button>
    <button class="filter-btn" data-filter="machine-learning">Machine Learning</button>
  </div>
  
  {% if site.enable_search %}
  <div class="blog-search">
    <input type="text" id="blog-search" placeholder="Search posts..." class="search-input">
  </div>
  {% endif %}
</div>

<div class="blog-posts" id="blog-posts">
  {% for post in paginator.posts %}
  <article class="blog-post-card" data-categories="{{ post.categories | join: ' ' | downcase }}" data-tags="{{ post.tags | join: ' ' | downcase }}">
    {% if post.image %}
    <div class="post-card-image">
      <a href="{{ post.url | relative_url }}">
        <img src="{{ post.image | relative_url }}" alt="{{ post.title }}" loading="lazy">
      </a>
    </div>
    {% endif %}
    
    <div class="post-card-content">
      <div class="post-card-meta">
        <time datetime="{{ post.date | date_to_xmlschema }}" class="post-date">
          {{ post.date | date: "%B %d, %Y" }}
        </time>
        
        {% if post.categories %}
        <div class="post-categories">
          {% for category in post.categories %}
          <span class="category-tag">{{ category }}</span>
          {% endfor %}
        </div>
        {% endif %}
        
        {% if post.reading_time %}
        <span class="reading-time">
          <i class="fas fa-clock"></i>
          {{ post.reading_time }} min read
        </span>
        {% endif %}
      </div>
      
      <h2 class="post-card-title">
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
      </h2>
      
      <p class="post-card-excerpt">
        {{ post.excerpt | strip_html | truncate: 200 }}
      </p>
      
      {% if post.tags %}
      <div class="post-tags">
        {% for tag in post.tags limit:3 %}
        <span class="tag">{{ tag }}</span>
        {% endfor %}
        {% if post.tags.size > 3 %}
        <span class="tag-more">+{{ post.tags.size | minus: 3 }} more</span>
        {% endif %}
      </div>
      {% endif %}
      
      <div class="post-card-footer">
        <a href="{{ post.url | relative_url }}" class="read-more-btn">
          Read More
          <i class="fas fa-arrow-right"></i>
        </a>
        
        {% if post.author %}
        <div class="post-author">
          <span>by {{ post.author }}</span>
        </div>
        {% endif %}
      </div>
    </div>
  </article>
  {% endfor %}
</div>

<!-- Pagination -->
{% if paginator.total_pages > 1 %}
<nav class="pagination-nav" aria-label="Blog pagination">
  <div class="pagination">
    {% if paginator.previous_page %}
    <a href="{{ paginator.previous_page_path | relative_url }}" class="pagination-btn pagination-prev">
      <i class="fas fa-chevron-left"></i>
      Previous
    </a>
    {% endif %}
    
    <div class="pagination-numbers">
      {% for page in (1..paginator.total_pages) %}
        {% if page == paginator.page %}
        <span class="pagination-number current">{{ page }}</span>
        {% elsif page == 1 %}
        <a href="{{ '/blog/' | relative_url }}" class="pagination-number">{{ page }}</a>
        {% else %}
        <a href="{{ site.paginate_path | relative_url | replace: ':num', page }}" class="pagination-number">{{ page }}</a>
        {% endif %}
      {% endfor %}
    </div>
    
    {% if paginator.next_page %}
    <a href="{{ paginator.next_page_path | relative_url }}" class="pagination-btn pagination-next">
      Next
      <i class="fas fa-chevron-right"></i>
    </a>
    {% endif %}
  </div>
  
  <div class="pagination-info">
    Showing posts {{ paginator.page | times: paginator.per_page | minus: paginator.per_page | plus: 1 }} - 
    {% assign max_post = paginator.page | times: paginator.per_page %}
    {% if max_post > paginator.total_posts %}{% assign max_post = paginator.total_posts %}{% endif %}
    {{ max_post }} of {{ paginator.total_posts }}
  </div>
</nav>
{% endif %}

<!-- Archive section -->
<section class="blog-archive">
  <h3>Browse by Category</h3>
  <div class="category-cloud">
    {% assign categories = site.categories | sort %}
    {% for category in categories %}
    <a href="{{ '/categories/#' | append: category[0] | slugify | relative_url }}" class="category-link">
      {{ category[0] }}
      <span class="category-count">{{ category[1].size }}</span>
    </a>
    {% endfor %}
  </div>
  
  <h3>Browse by Tag</h3>
  <div class="tag-cloud">
    {% assign tags = site.tags | sort %}
    {% for tag in tags %}
    <a href="{{ '/tags/#' | append: tag[0] | slugify | relative_url }}" class="tag-link" style="font-size: {{ tag[1].size | times: 0.8 | plus: 0.8 }}em;">
      {{ tag[0] }}
    </a>
    {% endfor %}
  </div>
</section>

<!-- Recent posts sidebar -->
<aside class="blog-sidebar">
  <div class="sidebar-section">
    <h4>Recent Posts</h4>
    <ul class="recent-posts-list">
      {% for post in site.posts limit:5 %}
      <li class="recent-post-item">
        <a href="{{ post.url | relative_url }}" class="recent-post-link">
          <h5>{{ post.title }}</h5>
          <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%b %d, %Y" }}</time>
        </a>
      </li>
      {% endfor %}
    </ul>
  </div>
  
  <div class="sidebar-section">
    <h4>Popular Tags</h4>
    <div class="popular-tags">
      {% assign sorted_tags = site.tags | sort: 1 | reverse %}
      {% for tag in sorted_tags limit:10 %}
      <a href="{{ '/tags/#' | append: tag[0] | slugify | relative_url }}" class="popular-tag">
        {{ tag[0] }}
      </a>
      {% endfor %}
    </div>
  </div>
  
  <div class="sidebar-section">
    <h4>RSS Feed</h4>
    <p>Stay updated with new posts</p>
    <a href="{{ '/feed.xml' | relative_url }}" class="rss-link" target="_blank" rel="noopener">
      <i class="fas fa-rss"></i>
      Subscribe to RSS
    </a>
  </div>
</aside>

<script>
// Blog filtering functionality
document.addEventListener('DOMContentLoaded', function() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const blogPosts = document.querySelectorAll('.blog-post-card');
  const searchInput = document.getElementById('blog-search');
  
  // Filter by category
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');
      
      // Update active filter button
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Filter posts
      blogPosts.forEach(post => {
        if (filter === 'all') {
          post.style.display = 'block';
        } else {
          const categories = post.getAttribute('data-categories');
          const tags = post.getAttribute('data-tags');
          
          if (categories.includes(filter) || tags.includes(filter)) {
            post.style.display = 'block';
          } else {
            post.style.display = 'none';
          }
        }
      });
    });
  });
  
  // Search functionality
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      
      blogPosts.forEach(post => {
        const title = post.querySelector('.post-card-title').textContent.toLowerCase();
        const excerpt = post.querySelector('.post-card-excerpt').textContent.toLowerCase();
        const categories = post.getAttribute('data-categories');
        const tags = post.getAttribute('data-tags');
        
        if (title.includes(searchTerm) || 
            excerpt.includes(searchTerm) || 
            categories.includes(searchTerm) || 
            tags.includes(searchTerm)) {
          post.style.display = 'block';
        } else {
          post.style.display = 'none';
        }
      });
    });
  }
});
</script>
