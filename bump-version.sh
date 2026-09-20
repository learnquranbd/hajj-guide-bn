#!/usr/bin/env bash
# অ্যাসেট ক্যাশ-বাস্টিং: সব লোকাল css/js রেফারেন্সে ?v=N বসায়।
# CSS/JS ফাইলের নামে হ্যাশ নেই, তাই আপডেটের পর এটি একবার চালাতে হয়:
#   ./bump-version.sh 3 && firebase deploy --only hosting
set -euo pipefail
V="${1:?ব্যবহার: ./bump-version.sh <version-number>}"
cd "$(dirname "$0")/public"
# আগের ?v=... সরিয়ে নতুনটি বসানো হয় (HTML ও JS — দুই জায়গাতেই)
find . -name '*.html' -o -name '*.js' | while read -r f; do
  perl -0pi -e "s{(/js/[A-Za-z0-9._-]+\.js|\./[A-Za-z0-9._-]+\.js|/css/[A-Za-z0-9._-]+\.css)(\?v=\d+)?}{\$1?v=$V}g" "$f"
done
echo "সব অ্যাসেট রেফারেন্স ?v=$V-এ আপডেট হয়েছে"
grep -ho '\(css\|js\)/[A-Za-z0-9._-]*\.\(css\|js\)?v=[0-9]*' *.html | sort -u | head
