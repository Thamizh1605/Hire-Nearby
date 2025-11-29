#!/bin/bash
# This script updates common color classes to dark theme
# Run: bash update_theme.sh

find src -name "*.jsx" -type f | while read file; do
  sed -i '' \
    -e 's/bg-white/bg-dark-400/g' \
    -e 's/bg-gray-50/bg-dark-500/g' \
    -e 's/bg-gray-100/bg-dark-400/g' \
    -e 's/bg-gray-200/bg-dark-500/g' \
    -e 's/bg-gray-300/bg-dark-400/g' \
    -e 's/bg-gray-800/bg-dark-500/g' \
    -e 's/text-gray-900/text-primary-300/g' \
    -e 's/text-gray-800/text-primary-300/g' \
    -e 's/text-gray-700/text-primary-300/g' \
    -e 's/text-gray-600/text-primary-400/g' \
    -e 's/text-gray-500/text-primary-500/g' \
    -e 's/text-gray-400/text-primary-400/g' \
    -e 's/border-gray-300/border-primary-700/g' \
    -e 's/border-gray-700/border-primary-800/g' \
    "$file"
done

echo "Theme updated!"
