#!/bin/bash
# Runs in GitHub Actions after a push: waits for GitHub Pages to serve the new build, then records what the live site serves.
want=$(grep -o 'js/isms.js?v=[0-9]*' index.html | cut -d= -f2)
base=https://branlung0-svg.github.io/open-learning-lab
for i in $(seq 1 30); do
  live=$(curl -s "$base/?nocache=$RANDOM" | grep -o 'js/isms.js?v=[0-9]*' | cut -d= -f2)
  [ "$live" = "$want" ] && break; sleep 20
done
{
  echo "checked $(date -u +%FT%TZ)"; echo "repo stamp $want, live stamp ${live:-none}"
  for f in js/isms.js js/balance.js js/voices.js js/mathpath.js js/method.js js/parliaments.js js/institutions.js js/countries.js sw.js data/commons.json css/lesson.css js/lesson-kit.js vendor/katex/katex.min.css data/lessons.json; do
    echo "$f $(curl -s -o /dev/null -w '%{http_code} %{size_download}' "$base/$f?v=$want")"; done
  # every rebuilt lesson page, and every local picture it uses
  for f in $(python3 -c "import json;[print(l['href']) for l in json.load(open('data/lessons.json'))]" 2>/dev/null); do
    echo "$f $(curl -s -o /dev/null -w '%{http_code} %{size_download}' "$base/$f?v=$want")"
    for img in $(grep -o 'img/c/[A-Za-z0-9._-]*' "$f" | sort -u); do
      echo "  $img $(curl -s -o /dev/null -w '%{http_code} %{size_download}' "$base/$img")"; done
  done
} > plan/live-check.txt
cat plan/live-check.txt
