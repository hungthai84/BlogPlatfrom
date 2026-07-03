#!/bin/bash
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i \
  -e 's/rounded-3xl/rounded-xl/g' \
  -e 's/rounded-2xl/rounded-lg/g' \
  -e 's/rounded-xl/rounded-md/g' \
  -e 's/font-display/font-sans/g' \
  {} +
