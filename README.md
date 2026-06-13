# Xianpu Ji Academic Website

This repository contains the source code for my personal academic website:

<https://blissful-jasper.github.io>

The site is built with Jekyll and deployed with GitHub Pages. It is designed as a clean, maintainable academic homepage for research notes, publications, projects, blog posts, curated links, and contact information.

## About

Xianpu Ji is a PhD student in the Department of Ocean Science at Hohai University. The website focuses on:

- Tropical atmospheric dynamics
- Convectively coupled equatorial waves
- Tropical precipitation variability
- Climate model diagnostics
- Meteorological data analysis and visualization
- Machine learning applications in precipitation nowcasting

## Site Sections

- Home: profile, research interests, recent publications, projects, posts, and research links
- Research: research directions and scientific context
- Publications: peer-reviewed publications maintained in `_data/publications.yml`
- Projects: selected ongoing and completed research projects
- Blog: technical notes and research writing from `_posts`
- Archive, Categories, Tags: blog navigation pages
- Links: curated research resources and academic links
- Notes: lightweight notes and navigation to useful resources
- CV: academic profile and CV entry point
- About, Contact, Gallery, Journals, Maps: supporting personal and research pages

## Technology

- Static site generator: Jekyll 3.9
- Hosting: GitHub Pages
- Styling: a single site stylesheet at `assets/site.css`
- JavaScript: lightweight interactions in `assets/site.js`
- Content data: YAML files in `_data`
- Blog content: Markdown files in `_posts`

The site intentionally avoids complex frontend dependencies so that it remains easy to maintain and compatible with GitHub Pages.

## Local Development

Use Ruby 3.x and Bundler. On this machine, the Homebrew Ruby toolchain is preferred:

```bash
cd /Users/lipu/Desktop/Blog/blissful-jasper.github.io
/opt/homebrew/opt/ruby/bin/bundle _2.5.6_ install
/opt/homebrew/opt/ruby/bin/bundle _2.5.6_ exec jekyll serve --livereload --port 4000
```

Then open:

```text
http://127.0.0.1:4000/
```

To verify the site without starting a server:

```bash
/opt/homebrew/opt/ruby/bin/bundle _2.5.6_ exec jekyll build --trace
```

## Repository Structure

```text
.
├── _config.yml
├── _data/
│   ├── contact.yml
│   ├── gallery.yml
│   ├── journals.yml
│   ├── links.yml
│   ├── maps.yml
│   ├── navigation.yml
│   ├── projects.yml
│   └── publications.yml
├── _includes/
│   ├── footer.html
│   ├── head.html
│   ├── header.html
│   └── sidebar.html
├── _layouts/
│   ├── default.html
│   ├── page.html
│   └── post.html
├── _posts/
├── assets/
│   ├── site.css
│   └── site.js
├── publications/
├── index.html
├── blog.html
├── publications.html
├── research.html
├── projects.html
├── links.html
└── README.md
```

## Content Updates

### Add A Blog Post

Create a Markdown file in `_posts` using the Jekyll date-title convention:

```text
_posts/YYYY-MM-DD-post-title.md
```

Example front matter:

```yaml
---
layout: post
title: "Post Title"
date: 2026-01-01
categories: research
tags: [tropical-dynamics, precipitation]
---
```

### Update Publications

Edit `_data/publications.yml`. Only publications authored or co-authored by Xianpu Ji should be listed.

Each item can include:

```yaml
- title: "Paper title"
  authors: "Ji, X., ..."
  journal: "Journal Name"
  journal_short: "Journal"
  doi: https://doi.org/...
  pdf: /publications/example.pdf
  status: published
  category: waves
  abstract: "Short description."
```

### Update Projects

Edit `_data/projects.yml`.

### Update Navigation

Edit `_data/navigation.yml` and `_includes/header.html` when the primary navigation changes.

## Deployment

The site is deployed through GitHub Pages using the workflow in:

```text
.github/workflows/pages.yml
```

Pushing to `main` triggers a GitHub Pages build and deployment.

## License

This repository is licensed under the MIT License.
