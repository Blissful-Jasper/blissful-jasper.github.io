# =============================================================================
# 📄 Dockerfile - Docker 容器配置
# =============================================================================
FROM jekyll/jekyll:4

WORKDIR /srv/jekyll

COPY Gemfile* ./
RUN bundle install

COPY . .

EXPOSE 4000 35729

CMD ["jekyll", "serve", "--host", "0.0.0.0", "--livereload"]
