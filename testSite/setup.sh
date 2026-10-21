#!/bin/sh
# Fetches the two things a Micro.blog build has that this repo doesn't: Hugo
# at Micro.blog's version, and Micro.blog's base theme, which every theme is
# layered over. Both land in gitignored folders; run once, then use .bin/hugo.
set -eu
cd "$(dirname "$0")"

HUGO_VERSION=0.158.0
BLANK_COMMIT=2f2550860e1fbb29e607b9e26f7776800c96b8d3   # theme-blank, 2026-09-04

if [ ! -x .bin/hugo ]; then
  tmp=$(mktemp -d)
  trap 'rm -rf "$tmp"' EXIT
  case "$(uname -s)" in
    Darwin) file="hugo_extended_${HUGO_VERSION}_darwin-universal.pkg" ;;
    Linux)  file="hugo_extended_${HUGO_VERSION}_linux-$(uname -m | sed 's/x86_64/amd64/;s/aarch64/arm64/').tar.gz" ;;
    *) echo "No Hugo download for $(uname -s)" >&2; exit 1 ;;
  esac
  base="https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}"
  curl -fsSL -o "$tmp/$file" "$base/$file"
  curl -fsSL -o "$tmp/sums.txt" "$base/hugo_${HUGO_VERSION}_checksums.txt"
  (cd "$tmp" && grep " $file\$" sums.txt | shasum -a 256 -c - >/dev/null)
  mkdir -p .bin
  case "$file" in
    *.pkg)
      # Expanded rather than installed, so the system's own hugo is untouched.
      pkgutil --expand-full "$tmp/$file" "$tmp/pkg"
      cp "$(find "$tmp/pkg" -type f -name hugo | head -1)" .bin/hugo ;;
    *)
      tar -xzf "$tmp/$file" -C .bin hugo ;;
  esac
  chmod +x .bin/hugo
fi

if [ ! -d themes/theme-blank ]; then
  git clone -q https://github.com/microdotblog/theme-blank.git themes/theme-blank
  git -C themes/theme-blank checkout -q "$BLANK_COMMIT"
fi

.bin/hugo version
