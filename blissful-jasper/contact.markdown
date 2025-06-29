# =============================================================================
# 📄 contact.markdown - 联系页面
# =============================================================================
---
layout: page
title: Contact
permalink: /contact/
---

## Get in Touch

I'm always happy to discuss research collaborations, student opportunities, or answer questions about my work. Please don't hesitate to reach out!

<div class="contact-info">
  <div class="contact-item">
    <div class="contact-icon">
      <i class="fas fa-envelope"></i>
    </div>
    <div class="contact-details">
      <div class="contact-label">Email</div>
      <div class="contact-value">{{ site.author.email }}</div>
    </div>
  </div>
  
  <div class="contact-item">
    <div class="contact-icon">
      <i class="fas fa-phone"></i>
    </div>
    <div class="contact-details">
      <div class="contact-label">Phone</div>
      <div class="contact-value">{{ site.author.phone }}</div>
    </div>
  </div>
  
  <div class="contact-item">
    <div class="contact-icon">
      <i class="fas fa-map-marker-alt"></i>
    </div>
    <div class="contact-details">
      <div class="contact-label">Office</div>
      <div class="contact-value">{{ site.author.office }}</div>
    </div>
  </div>
  
  <div class="contact-item">
    <div class="contact-icon">
      <i class="fas fa-university"></i>
    </div>
    <div class="contact-details">
      <div class="contact-label">Department</div>
      <div class="contact-value">{{ site.author.affiliation }}</div>
    </div>
  </div>
</div>

## Office Hours

**Regular Office Hours:**
- Monday: 2:00 PM - 4:00 PM
- Wednesday: 10:00 AM - 12:00 PM  
- Friday: 1:00 PM - 3:00 PM

**Location:** {{ site.author.office }}

*Appointments outside regular hours are welcome - just send me an email!*

## Social Media & Professional Profiles

<div class="social-links">
  {% if site.social_links.github %}
    <a href="https://github.com/{{ site.social_links.github }}" target="_blank" class="social-link">
      <i class="fab fa-github"></i> GitHub
    </a>
  {% endif %}
  
  {% if site.social_links.scholar %}
    <a href="https://scholar.google.com/citations?user={{ site.social_links.scholar }}" target="_blank" class="social-link">
      <i class="fas fa-graduation-cap"></i> Google Scholar
    </a>
  {% endif %}
  
  {% if site.social_links.linkedin %}
    <a href="https://linkedin.com/in/{{ site.social_links.linkedin }}" target="_blank" class="social-link">
      <i class="fab fa-linkedin"></i> LinkedIn
    </a>
  {% endif %}
  
  {% if site.social_links.twitter %}
    <a href="https://twitter.com/{{ site.social_links.twitter }}" target="_blank" class="social-link">
      <i class="fab fa-twitter"></i> Twitter
    </a>
  {% endif %}
  
  {% if site.social_links.orcid %}
    <a href="https://orcid.org/{{ site.social_links.orcid }}" target="_blank" class="social-link">
      <i class="fab fa-orcid"></i> ORCID
    </a>
  {% endif %}
</div>

## Mailing Address

**{{ site.author.name }}**  
Department of Computer Science  
University Name  
123 University Drive  
City, State 12345  
United States

## For Prospective Students

### Graduate Students (Ph.D./M.S.)

I'm always looking for motivated graduate students to join my research team. If you're interested in working with me, please:

1. **Review my research areas** and recent publications
2. **Check admission requirements** for our graduate program
3. **Send me an email** with:
   - Your CV/resume
   - Research interests and how they align with my work
   - Transcripts (unofficial is fine initially)
   - Any relevant research experience

### Undergraduate Students

I offer research opportunities for undergraduate students through:
- **Independent Study courses**
- **REU (Research Experience for Undergraduates) program**
- **Senior capstone projects**
- **Work-study positions**

Contact me if you're interested - no prior research experience required!

### Postdoctoral Researchers

I occasionally have openings for postdoctoral researchers. Current opportunities will be posted on my website and relevant job boards. Feel free to reach out to discuss potential collaborations.

## Collaboration Opportunities

I'm open to collaborations with:
- **Academic researchers** in related fields
- **Industry partners** interested in applied research
- **Healthcare institutions** for AI in medicine projects
- **Non-profit organizations** working on social good applications

## Media & Press Inquiries

For media inquiries or interview requests, please contact:

**University Communications Office**  
Email: media@university.edu  
Phone: (555) 123-0000

Or contact me directly for academic/research-related inquiries.

---

*Last updated: January 2024*
