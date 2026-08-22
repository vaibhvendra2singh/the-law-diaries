#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# run.sh — Smart one-shot launcher for The Law Diaries blog
#
# Just run:  bash run.sh
#
# It will automatically:
#   1. Check Node.js is installed
#   2. Install npm packages (if node_modules is missing)
#   3. Run database migration (if blog.db doesn't exist)
#   4. Seed existing MDX posts into the DB (if DB was just created)
#   5. Prompt for admin credentials (if not configured in .env)
#   6. Start the dev server at http://localhost:3000
#
# Optional arguments:
#   bash run.sh build   → build for production (outputs to .next/)
#   bash run.sh reset   → wipe DB and re-seed (nuclear reset, use carefully)
# ─────────────────────────────────────────────────────────────────────────────

set -e  # exit on any error

# ── Colours ───────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
RESET='\033[0m'

step() { echo -e "\n${BLUE}→ $1${RESET}"; }
ok()   { echo -e "${GREEN}✓ $1${RESET}"; }
warn() { echo -e "${YELLOW}⚠ $1${RESET}"; }
fail() { echo -e "${RED}✗ $1${RESET}"; exit 1; }

echo ""
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "${BOLD}  The Law Diaries — Personal Blog${RESET}"
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"

# ── Handle special arguments ──────────────────────────────────────────────────
if [ "$1" = "build" ]; then
  step "Building for production..."
  [ ! -d "node_modules" ] && npm install
  npm run build
  ok "Build complete. Start with: npm start"
  exit 0
fi

if [ "$1" = "reset" ]; then
  warn "This will delete blog.db and re-seed from MDX files."
  read -p "Are you sure? (y/N) " confirm
  [[ "$confirm" =~ ^[Yy]$ ]] || { echo "Cancelled."; exit 0; }
  rm -f blog.db
  ok "Database deleted. Re-running setup..."
fi

# ── Step 1: Check Node.js ─────────────────────────────────────────────────────
if ! command -v node &>/dev/null; then
  fail "Node.js is not installed. Download it from https://nodejs.org"
fi
ok "Node.js $(node -v)"

# ── Step 2: Install packages ──────────────────────────────────────────────────
if [ ! -d "node_modules" ] || [ ! -d "node_modules/next" ]; then
  step "Installing dependencies (this runs once)..."
  npm install
  ok "Dependencies installed"
else
  ok "Dependencies already installed"
fi

# ── Step 3: Database & Prisma Client ──────────────────────────────────────────
step "Generating Prisma client & syncing schema..."
npx prisma generate
npx prisma db push --skip-generate
ok "Database schema synced"

# ── Step 5: Check admin credentials ──────────────────────────────────────────
HASH=$(grep -E '^ADMIN_PASSWORD_HASH=.+' .env 2>/dev/null | cut -d= -f2-)
if [ -z "$HASH" ]; then
  step "Admin credentials not set — running first-time setup..."
  echo ""
  npm run setup
else
  ok "Admin credentials configured"
fi

# ── Step 6: Start dev server ──────────────────────────────────────────────────
echo ""
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "  ${GREEN}Blog:${RESET}  http://localhost:3000"
echo -e "  ${GREEN}Admin:${RESET} http://localhost:3000/admin"
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "  Press ${BOLD}Ctrl+C${RESET} to stop"
echo ""

npm run dev
