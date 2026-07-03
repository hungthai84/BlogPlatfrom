#!/bin/bash
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -exec sed -i \
  -e 's/#482dff/#0078d4/g' \
  -e 's/#8775f5/#2899f5/g' \
  -e 's/#3219ff/#005a9e/g' \
  -e 's/#725ff2/#106ebe/g' \
  -e 's/#08102b/#323130/g' \
  -e 's/#fffdfc/#ffffff/g' \
  -e 's/#1e1e1e/#201f1e/g' \
  -e 's/#252526/#292827/g' \
  -e 's/#2d2d30/#323130/g' \
  -e 's/#e6e6e6/#edebe9/g' \
  -e 's/#444444/#484644/g' \
  {} +
