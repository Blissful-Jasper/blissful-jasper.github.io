#!/bin/bash

echo "Starting Jekyll Blog Template..."
echo

# Check if Ruby is installed
if ! command -v ruby &> /dev/null; then
    echo "Error: Ruby is not installed or not in PATH"
    echo "Please install Ruby:"
    echo "  Ubuntu/Debian: sudo apt-get install ruby-full"
    echo "  macOS: brew install ruby"
    echo "  Or visit: https://www.ruby-lang.org/en/downloads/"
    exit 1
fi

# Check if Bundler is installed
if ! command -v bundle &> /dev/null; then
    echo "Installing Bundler..."
    gem install bundler
fi

# Install dependencies
echo "Installing dependencies..."
bundle install

# Start Jekyll server
echo
echo "Starting Jekyll server..."
echo "You can access your site at: http://localhost:4000"
echo "Press Ctrl+C to stop the server"
echo
bundle exec jekyll serve --host 0.0.0.0 --port 4000 --livereload
