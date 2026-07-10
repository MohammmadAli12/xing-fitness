# XING FITNESS CLUB — Agent Context

> **FUTURE AGENTS: Read this file first. Do not rescan the entire project unless this context is insufficient or the requested task requires verification. Then inspect only the target file/section.**

---

## 1. PROJECT OVERVIEW

- **Project**: XING Fitness Club — gym/fitness website for a Bangalore-based gym
- **Purpose**: Marketing site with trial booking form that sends email notifications
- **Architecture**: Static multi-page HTML frontend served by a Node.js/Express backend; single API endpoint for trial email
- **Frontend**: 4 HTML pages with inline `<style>` and `<script>`, Tailwind CDN, Iconify CDN, Google Fonts
- **Backend**: Express server (`server.js`) — static file serving + POST `/api/trial-booking` → Nodemailer → Gmail SMTP

---

## 2. TECH STACK

| Layer | Technology | Source |
|-------|-----------|--------|
| Markup | HTML5 | Inline |
| Styling | Tailwind CSS (CDN `cdn.tailwindcss.com`) + inline `<style>` blocks | CDN |
| JS | Vanilla JavaScript (inline `<script>`) | Inline |
| Icons | Iconify (`iconify-icon` web component v1.0.7) | CDN |
| Fonts | Google Fonts — Barlow (300-500), Barlow Condensed (400-900) | CDN |
| Server | Node.js + Express 4.19.2 | npm |
| Email | Nodemailer 6.9.13 → Gmail SMTP | npm |
| Config | dotenv 16.4.5 | npm |

No React. No build step. No bundler. No TypeScript.

---

## 3. FOLDER STRUCTURE

```
xing-fitness/
├── index.html          ← Main landing page (all sections)
├── trialpage_1.html    ← Trial booking form page
├── WeightLoss_1.html   ← Weight Loss program page
├── muscleGain.html     ← Muscle Gain program page
├── server.js           ← Express backend + email API
├── package.json        ← npm config (express, nodemailer, dotenv)
├── package-lock.json
├── .env                ← SECRET — never read, expose, commit, or modify
├── .env.example        ← Template for env vars
├── .gitignore          ← node_modules, .env, *.log
├── AGENT_CONTEXT.md    ← This file
└── node_modules/
```

> ⚠️ `.env` is secret. Never read aloud, expose, commit, or modify unless explicitly requested.

---

## 4. FILE RESPONSIBILITIES

### `index.html` (~1060 lines)
- Main landing page with all sections (hero → footer)
- Contains all CSS in `<style>` (lines 17–294) and all JS in `<script>` (lines 912–end)
- Key IDs: `#fixed-header`, `#loc-bar`, `#main-nav`, `#nav-toggle`, `#mobile-menu`, `#programs`, `#coaches`, `#coaches-grid`, `#pricing`, `#about`, `#testimonial-section`, `#testimonial-content`, `#testimonial-quote`, `#testimonial-name`, `#testimonial-meta`, `#cta-email`
- Most future edits target this file

### `trialpage_1.html` (~380 lines)
- Trial booking form: name, phone, age, weight, experience → POST `/api/trial-booking`
- Key IDs: `#booking-form`, `#full-name`, `#mobile-number`, `#age`, `#weight`, `#experience`, `#form-status`
- Submit handler in inline `<script>` (lines 312–378)

### `WeightLoss_1.html` (~263 lines)
- Static info page: myths, scientific method, how XING helps, CTA → `trialpage_1.html`
- No JS logic beyond animations

### `muscleGain.html` (~263 lines)
- Static info page: growth barriers, overload method, XING advantage, CTA → `trialpage_1.html`
- No JS logic beyond animations

### `server.js` (188 lines)
- Express static server + single POST `/api/trial-booking`
- Rate limiting (5 req / 10 min per IP), input validation, Nodemailer Gmail transport
- Wildcard GET `*` → `index.html` fallback

### `package.json`
- `npm start` / `npm run dev` → `node server.js`
- Dependencies: express, nodemailer, dotenv

---

## 5. PAGE/LINK MAP

```
index.html
  → trialpage_1.html      (navbar "Join Now", hero CTA, pricing buttons, CTA form)
  → WeightLoss_1.html     (programs grid "Weight Loss" card)
  → muscleGain.html        (programs grid "Muscle Gain" card)

WeightLoss_1.html
  → trialpage_1.html      (CTA button)
  → index.html             (navbar logo, "Return to Home")

muscleGain.html
  → trialpage_1.html      (CTA button)
  → index.html             (navbar logo, "Return to Home")

trialpage_1.html
  → index.html             (navbar "Back to Home", logo)
```

---

## 6. BACKEND

| Item | Detail |
|------|--------|
| Entry | `server.js` |
| Port | `process.env.PORT` or `3000` |
| Static | `express.static(__dirname)` — serves all HTML/assets from root |
| API route | `POST /api/trial-booking` |
| Request body | `{ name, phone, age, weight, experience }` (JSON) |
| Response | `{ success: boolean, message: string }` |
| Rate limit | 5 requests per 10 min per IP (in-memory Map) |
| Validation | name (1–100 chars), phone (regex), age (12–100 int), weight (1–30 chars), experience (beginner/intermediate/advanced) |
| Email | Nodemailer → Gmail SMTP → styled HTML table → `TRIAL_RECEIVER_EMAIL` |
| Fallback | GET `*` → `index.html` |

---

## 7. TRIAL EMAIL FLOW

```
Visitor fills #booking-form → fetch POST /api/trial-booking
→ server validates → Nodemailer Gmail SMTP → TRIAL_RECEIVER_EMAIL
→ 200 { success: true } or error
```

**Environment variable names only** (never include values):
- `PORT`
- `EMAIL_USER`
- `EMAIL_APP_PASSWORD`
- `TRIAL_RECEIVER_EMAIL`

---

## 8. CURRENT UI STRUCTURE (index.html DOM order)

1. Background (fixed, stars, grid, glow)
2. Fixed header wrapper (`#fixed-header`)
   - Location bar (`#loc-bar`) — address + Google Maps link
   - Navbar (`#main-nav`) — logo, desktop links, Join Now, mobile toggle
   - Mobile menu (`#mobile-menu`)
3. Hero — headline, stats bar (12K+, 40+, 8, 97%)
4. Ticker — red scrolling marquee (STRENGTH · POWER · ...)
5. Programs (`#programs`) — 6 cards (3-col grid)
6. Testimonial (`#testimonial-section`) — red bg, rotating reviews
7. Coaches (`#coaches`) — 3 trainer cards
8. Pricing (`#pricing`) — 3 tier cards
9. CTA — email input + "Claim Spot"
10. Footer (`#about`) — links, social, giant ghost text, copyright

---

## 9. PROGRAMS (index.html `#programs`)

| # | Program | Link |
|---|---------|------|
| 1 | Powerlifting & Strength | none (div) |
| 2 | Weight Loss | `WeightLoss_1.html` |
| 3 | Muscle Gain | `muscleGain.html` |
| 4 | Recovery & Mobility | none (div) |
| 5 | Nutrition Coaching | none (div) |
| 6 | HIIT & Conditioning | none (div) |

---

## 10. TRAINER SECTION

- **Trainers**: Altaf (Strength), Sasha "Burn" Voss (HIIT), Dimitri "Lift" Vasiliev (Olympic)
- **Desktop**: 3-col CSS grid (`.coaches-grid`)
- **Mobile**: Sticky scroll-stack via `.coach-sticky-wrap` with `--stack-stagger` / `--stack-z` CSS vars
- **Depth effect**: JS `updateCoachScale()` applies subtle `scale()` reduction as cards stack
- **Key classes**: `.coaches-grid`, `.coach-sticky-wrap`, `.coach-card-inner`, `.coaches-section-spacer`
- **Transform conflict fix**: `.reveal` animation is on `.coach-card-inner` (inner), sticky + scale is on `.coach-sticky-wrap` (outer) — separating the two prevents transform conflicts
- **Reduced motion**: `prefers-reduced-motion: reduce` → disables sticky + scale

---

## 11. MOBILE HEADER

- **Location bar** + **navbar** are inside `#fixed-header` (fixed, z-50)
- `--header-h` CSS variable is measured dynamically via `ResizeObserver` on `#fixed-header`
- **Overlap fix**: Sticky trainer cards use `top: calc(var(--header-h) + 16px + var(--stack-stagger))`
- **Logo**: `.xing-logo` — forced 1:1 aspect ratio, `flex-shrink: 0`, clamp sizing
- **Brand text**: `.xing-brand` — `font-size: clamp(0.72rem, 3.2vw, 1.25rem)`, `flex-shrink: 1`
- **Breakpoint**: 768px (`md:`) — desktop nav shown, mobile menu hidden
- **Mobile menu**: `#mobile-menu` toggled via `.open` class by `#nav-toggle`
- **Mobile padding overrides**: `#main-nav` and `.join-now-btn` have `!important` padding reductions at `max-width: 767px`

---

## 12. TESTIMONIAL ROTATION

- **Section**: `#testimonial-section` (red `bg-[#ef233c]` with grid overlay)
- **Content wrapper**: `#testimonial-content` (opacity transition 0.5s)
- **Elements**: `#testimonial-quote`, `#testimonial-name`, `#testimonial-meta`
- **Reviewers**: Srikanth K, Somula Pavan Kumar, Nayana Verma, Sandy Raghav
- **Interval**: 5 seconds via `setInterval`
- **Transition**: Fade out (opacity → 0), swap text after 500ms, fade in (opacity → 1)
- **Pause**: `mouseenter` on section → `paused = true`; `mouseleave` → reset interval
- **Touch**: `touchstart` → pause; `touchend` → resume with fresh 5s timer
- **Timer reset**: On `mouseleave`/`touchend`, `clearInterval` + `startTimer()` → fresh 5s before next change
- **JS**: IIFE at bottom of `<script>`, functions: `show(i)`, `fadeToNext()`, `startTimer()`

---

## 13. DESIGN SYSTEM — DO NOT BREAK

| Token | Value |
|-------|-------|
| Primary accent | `#ef233c` (red) / `var(--red)` |
| Red glow | `rgba(239, 35, 60, 0.4)` |
| Red dim | `rgba(239, 35, 60, 0.15)` |
| Background | `#000` black with dark-red gradient |
| Body font | `Barlow` (sans-serif) |
| Display font | `Barlow Condensed` (`.font-condensed`) |
| Tailwind | CDN (`cdn.tailwindcss.com`) — no config file |
| Icons | Iconify `lucide:*` icon set |
| Stars bg | `.stars-1`, `.stars-2` — CSS box-shadow particles with `animStar` keyframes |
| Grid texture | Linear gradient 1px lines at 60px (main bg) or 40px (testimonial) |
| Reveal | `.reveal` class → `IntersectionObserver` adds `.visible` (opacity + translateY) |
| Cards | `.stat-card` — hover: red border + glow. `.plan-card` — hover: red border |
| Selection | `::selection { background: #ef233c }` |
| Divider | `.slash-divider` — 60×4px red, skewX(-15deg) |
| Border radius | Inline `style="border-radius: 6-8px"` on cards/nav |

---

## 14. RESPONSIVE BREAKPOINTS

| Breakpoint | Behavior |
|-----------|----------|
| `768px` (`md:`) | Primary. Desktop nav, grid layouts, pricing scale |
| `640px` (`sm:`) | Location bar row layout, CTA form row |
| `< 768px` | Mobile menu, single-col grids, sticky trainer stack, reduced header padding |

---

## 15. IMPORTANT DOM SELECTORS

| Selector | Purpose |
|----------|---------|
| `#fixed-header` | Fixed header wrapper (location + nav) |
| `#loc-bar` | Location bar |
| `#main-nav` | Navbar header element |
| `#nav-toggle` | Mobile hamburger button |
| `#mobile-menu` | Mobile nav dropdown |
| `#programs` | Programs section |
| `#coaches` / `#coaches-grid` | Trainers section / grid |
| `#pricing` | Pricing section |
| `#about` | Footer (anchor target) |
| `#testimonial-section` | Testimonial red section |
| `#testimonial-content` | Testimonial fade wrapper |
| `#testimonial-quote` | Quote h3 |
| `#testimonial-name` | Reviewer name |
| `#testimonial-meta` | Reviewer date |
| `#cta-email` | CTA email input |
| `#booking-form` | Trial form (trialpage_1.html) |
| `#form-status` | Form submit status div |
| `.coach-sticky-wrap` | Trainer card outer sticky wrapper |
| `.coach-card-inner` | Trainer card inner (reveal target) |
| `.reveal` / `.visible` | Scroll-reveal animation |

---

## 16. IMPORTANT JAVASCRIPT (all inline `<script>`)

### index.html

| Function/Block | Purpose |
|---------------|---------|
| Mobile menu toggle | `#nav-toggle` click → toggle `.open` on `#mobile-menu` |
| `revealObserver` | IntersectionObserver → adds `.visible` to `.reveal` elements |
| Smooth anchor scroll | `a[href^="#"]` → `scrollIntoView` |
| `applyHeaderHeight()` | Measures `#fixed-header` → sets `--header-h` CSS var |
| `updateCoachScale()` | Mobile-only: scales trainer cards based on scroll proximity |
| Testimonial IIFE | `show()`, `fadeToNext()`, `startTimer()` — 5s rotation with pause/resume |

### trialpage_1.html

| Function/Block | Purpose |
|---------------|---------|
| Form submit handler | `#booking-form` submit → `fetch POST /api/trial-booking` → status display |
| `applyHeaderHeight()` | Same dynamic header height measurement |

---

## 17. KNOWN ISSUES / FIXED ISSUES

| Issue | Status | Detail |
|-------|--------|--------|
| "Cannot GET /trialpage_1.html" | Fixed | Was caused by incorrect filename or missing file; `express.static` serves from `__dirname` |
| Port 3000 EADDRINUSE | Known | Process conflict — kill existing node process, not an email issue |
| Mobile header overlap | Fixed | Trainer sticky cards now use `calc(var(--header-h) + offset)` via dynamic measurement |
| Trainer transform conflict | Fixed | `.reveal` on inner `.coach-card-inner`, sticky + scale on outer `.coach-sticky-wrap` |
| UTF-8 encoding artifacts | Present | Some pages show `Â·`, `â€"` instead of `·`, `–` (encoding issue in source files) |

---

## 18. NON-NEGOTIABLE RULES FOR FUTURE AGENTS

1. Read `AGENT_CONTEXT.md` FIRST
2. Do not scan all files unless the task requires it
3. Inspect only target files for the requested change
4. Make surgical edits — minimal token usage
5. Do not redesign unrelated sections
6. Do not add buttons/pages/components without explicit request
7. Do not convert to React or any framework
8. Preserve desktop layout unless requested otherwise
9. Do not touch backend for frontend-only tasks
10. Never expose `.env` secrets — never read `.env` contents
11. Never commit `.env`
12. Do not break the trial email flow
13. Do not rename files casually
14. Respect exact filename capitalization (`WeightLoss_1.html`, `muscleGain.html`)
15. If browser tool fails once, stop retry loops — continue with file editing
16. Do not waste tokens narrating tool actions

---

## 19. TASK ROUTING GUIDE

| Task | Read first |
|------|-----------|
| Header issue | AGENT_CONTEXT.md → index.html header section only |
| Programs | AGENT_CONTEXT.md → index.html `#programs` section only |
| Trainer stack | AGENT_CONTEXT.md → index.html trainer CSS + JS only |
| Testimonials | AGENT_CONTEXT.md → index.html testimonial section + IIFE JS |
| Trial UI | AGENT_CONTEXT.md → trialpage_1.html |
| Email issue | AGENT_CONTEXT.md → server.js + trialpage_1.html submit handler |
| Weight Loss page | AGENT_CONTEXT.md → WeightLoss_1.html |
| Muscle Gain page | AGENT_CONTEXT.md → muscleGain.html |
| Pricing | AGENT_CONTEXT.md → index.html `#pricing` section only |
| Footer / About | AGENT_CONTEXT.md → index.html `#about` footer section |
| Styling / Design | AGENT_CONTEXT.md → index.html `<style>` block (lines 17–294) |

---

## 20. LAST UPDATED STATE

- **Date**: 2026-07-08
- **Implemented features**:
  - Full landing page (hero, ticker, programs, testimonial, coaches, pricing, CTA, footer)
  - 4-review testimonial rotation (5s interval, fade, pause on hover/touch)
  - Mobile sticky scroll-stack trainer cards with depth scaling
  - Dynamic header height measurement
  - Trial booking form → email via Nodemailer/Gmail
  - Rate limiting (5/10min per IP)
  - Weight Loss + Muscle Gain detail pages
  - Responsive mobile layout with header fix
- **Unresolved**:
  - UTF-8 encoding artifacts in `trialpage_1.html` and `WeightLoss_1.html` (`Â·`, `â€"`)
  - Social media links (`#` placeholder hrefs in footer)
  - No favicon configured
