#!/usr/bin/env bash
#
# auto-deploy.sh — pull-based continuous deployment.
# Checks origin/<branch>; if there are new commits, pulls and rebuilds the
# Docker stack, then applies DB migrations. Idempotent: does nothing when the
# working tree already matches the remote, so it is safe to run on a schedule.
#
# Usage (typically from cron — see setup-autodeploy.sh):
#   REPO_DIR=/var/www/baghaei.com ./deploy/auto-deploy.sh
#
set -euo pipefail

REPO_DIR="${REPO_DIR:-/var/www/baghaei.com}"
BRANCH="${DEPLOY_BRANCH:-main}"
LOG="${REPO_DIR}/auto-deploy.log"

cd "$REPO_DIR"

git fetch origin "$BRANCH" --quiet

LOCAL="$(git rev-parse HEAD)"
REMOTE="$(git rev-parse "origin/${BRANCH}")"

if [ "$LOCAL" = "$REMOTE" ]; then
  exit 0  # already up to date — nothing to do
fi

{
  echo "[$(date -Is)] New commits detected: ${LOCAL:0:7} -> ${REMOTE:0:7}. Deploying…"
  git pull --ff-only origin "$BRANCH"
  docker compose up -d --build
  docker compose exec -T backend npx prisma migrate deploy || echo "  (migrate deploy skipped/failed — check DB)"
  docker image prune -f || true
  echo "[$(date -Is)] Deploy complete."
} >> "$LOG" 2>&1
