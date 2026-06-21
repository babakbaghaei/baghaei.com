#!/usr/bin/env bash
#
# setup-autodeploy.sh — one-time installer for pull-based continuous deployment.
# Installs a cron job that runs auto-deploy.sh every 3 minutes, so any push to
# the deploy branch goes live within ~3 minutes with no GitHub secrets needed.
#
# Run ONCE on the VPS:
#   REPO_DIR=/var/www/baghaei.com bash deploy/setup-autodeploy.sh
#
set -euo pipefail

REPO_DIR="${REPO_DIR:-/var/www/baghaei.com}"
SCRIPT="${REPO_DIR}/deploy/auto-deploy.sh"
INTERVAL="${DEPLOY_INTERVAL_MIN:-3}"

if [ ! -f "$SCRIPT" ]; then
  echo "ERROR: $SCRIPT not found. Set REPO_DIR to the cloned repo path." >&2
  exit 1
fi

chmod +x "$SCRIPT"

CRON_LINE="*/${INTERVAL} * * * * REPO_DIR=${REPO_DIR} ${SCRIPT}"

# Replace any previous auto-deploy entry, keep everything else.
( crontab -l 2>/dev/null | grep -v 'auto-deploy.sh' ; echo "$CRON_LINE" ) | crontab -

echo "✓ Auto-deploy installed. Cron entry:"
echo "    $CRON_LINE"
echo "Logs will be written to ${REPO_DIR}/auto-deploy.log"
