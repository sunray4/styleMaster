#!/bin/sh

set -eux

PUPPETEER_CHROMIUM=~/.cache/puppeteer

if [ ! -d "$PUPPETEER_CHROMIUM" ]; then
  echo "ERROR! $PUPPETEER_CHROMIUM doesn't exist. Run npm install or change directory."
  exit 1
fi

# npm install -g pkg
# When starting backend on the server, remember to set PUPPETEER_CACHE_DIR
# to wherever the puppeteer directory ends up
rm -rf _release
mkdir -p _release
pkg -t node16-linux-x64 --public -o _release/webbkoll-backend index.js
cp -a ~/.cache/puppeteer _release
tar -C _release -zcvf webbkoll-backend-current.tar.gz .
scp webbkoll-backend-current.tar.gz @dataskydd.net:/var/www/dataskydd.net/www


