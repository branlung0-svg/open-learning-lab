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
  for f in js/isms.js js/balance.js js/voices.js js/mathpath.js js/method.js js/parliaments.js js/institutions.js js/countries.js sw.js data/commons.json; do
    echo "$f $(curl -s -o /dev/null -w '%{http_code} %{size_download}' "$base/$f?v=$want")"; done
} > plan/live-check.txt
cat plan/live-check.txt
