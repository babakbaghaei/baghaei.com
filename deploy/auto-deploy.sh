#!/usr/bin/env bash
#
# auto-deploy.sh — pull-based continuous deployment.
# Checks origin/<branch>; if there are new commits, PULLS the CI-built images
# from GHCR (no on-VPS build — that took ~1h on 1GB RAM) and recreates the
# stack, then applies DB migrations. Writes a live progress file at each stage
# that the /status page polls. Idempotent: does nothing when already up to date.
#
# Usage (typically from cron — see setup-autodeploy.sh):
#   REPO_DIR=/var/www/baghaei.com ./deploy/auto-deploy.sh
#
set -euo pipefail

REPO_DIR="${REPO_DIR:-/var/www/baghaei.com}"
BRANCH="${DEPLOY_BRANCH:-main}"
LOG="${REPO_DIR}/auto-deploy.log"
STATUS_DIR="${REPO_DIR}/deploy/status"
STATUS_FILE="${STATUS_DIR}/deploy-status.json"

cd "$REPO_DIR"

# Write a deploy-status.json the /status page can render. Args: stage percent msg
write_status() {
  local stage="$1" percent="$2" msg="${3:-}"
  mkdir -p "$STATUS_DIR"
  cat > "$STATUS_FILE" <<EOF
{
  "stage": "${stage}",
  "percent": ${percent},
  "message": "${msg}",
  "commit": "${REMOTE:-}",
  "started_at": "${STARTED_AT:-}",
  "updated_at": "$(date -Is)"
}
EOF
}

git fetch origin "$BRANCH" --quiet

LOCAL="$(git rev-parse HEAD)"
REMOTE="$(git rev-parse "origin/${BRANCH}")"

if [ "$LOCAL" = "$REMOTE" ]; then
  exit 0  # already up to date — nothing to do
fi

STARTED_AT="$(date -Is)"

{
  echo "[$(date -Is)] New commits detected: ${LOCAL:0:7} -> ${REMOTE:0:7}. Deploying…"

  write_status "fetch" 10 "دریافت کد جدید"
  git pull --ff-only origin "$BRANCH"

  write_status "pull" 40 "دریافت ایمیج‌های جدید از رجیستری"
  # Pull the freshly-built images. If GHCR is unreachable or the image is
  # missing, fall back to a local build so a deploy never hard-fails.
  docker compose pull frontend backend || {
    echo "  (pull failed — falling back to local build)"
    docker compose build frontend backend
  }

  write_status "up" 65 "راه‌اندازی سرویس‌ها"
  docker compose up -d

  write_status "migrate" 85 "اعمال مهاجرت پایگاه‌داده"
  docker compose exec -T backend npx prisma migrate deploy || echo "  (migrate deploy skipped/failed — check DB)"

  docker image prune -f || true
  write_status "done" 100 "استقرار با موفقیت کامل شد"
  echo "[$(date -Is)] Deploy complete."
} >> "$LOG" 2>&1 || {
  write_status "error" 0 "استقرار با خطا متوقف شد"
  exit 1
}
