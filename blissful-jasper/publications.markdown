# =============================================================================
# 📄 publications.markdown - 发表文章页面
# =============================================================================
---
layout: page
title: Publications
permalink: /publications/
---

## Recent Publications

<div class="publication-list">
{% for pub in site.data.publications %}
  <div class="publication-item">
    <div class="pub-title">{{ pub.title }}</div>
    <div class="pub-authors">
      {% assign authors = pub.authors | split: ", " %}
      {% for author in authors %}
        {% if author == "Your Name" %}
          <span class="author-highlight">{{ author }}</span>
        {% else %}
          {{ author }}
        {% endif %}
        {% unless forloop.last %}, {% endunless %}
      {% endfor %}
    </div>
    <div class="pub-venue">{{ pub.venue }}, {{ pub.year }}</div>
    {% if pub.abstract %}
      <p class="pub-abstract">{{ pub.abstract }}</p>
    {% endif %}
    <div class="pub-links">
      {% if pub.pdf %}
        <a href="{{ pub.pdf }}" target="_blank">
          <i class="fas fa-file-pdf"></i> PDF
        </a>
      {% endif %}
      {% if pub.code %}
        <a href="{{ pub.code }}" target="_blank">
          <i class="fab fa-github"></i> Code
        </a>
      {% endif %}
      {% if pub.slides %}
        <a href="{{ pub.slides }}" target="_blank">
          <i class="fas fa-presentation"></i> Slides
        </a>
      {% endif %}
    </div>    <strong>Impact:</strong>
    {% if pub.citations %}- {{ pub.citations }} citations{% endif %}
    {% if pub.awards %}- {{ pub.awards }}{% endif %}
  </div>
{% endfor %}
</div>

## Publication Metrics

- **Total Publications**: 45+
- **H-Index**: 18
- **Total Citations**: 1,200+
- **Recent Impact Factor**: 8.5 average

## Selected Invited Talks

- **"AI for Social Good: Challenges and Opportunities"**  
  Keynote at International AI Conference, 2024

- **"The Future of Healthcare AI"**  
  Medical AI Symposium, 2024

- **"Sustainable Computing in the Age of AI"**  
  Green Computing Workshop, 2023

- **"Bridging Theory and Practice in Machine Learning"**  
  University Distinguished Lecture Series, 2023

## Book Chapters & Editorial Work

- **"Deep Learning for Natural Language Processing"**  
  Chapter in *Handbook of AI Applications*, Springer, 2024

- **Guest Editor** - Special Issue on "AI in Healthcare"  
  *Journal of Medical AI*, 2023

## Patents

- **"System and Method for Intelligent Healthcare Monitoring"**  
  US Patent Application #12345678, Filed 2024

- **"Efficient Neural Network Architecture for Edge Computing"**  
  US Patent #87654321, Granted 2023
