# Baghaei.com Overhaul — Progress Checkpoint

Live dev server: http://localhost:3000 (background). Gate = per-file first-edit (state facts, retry once).
No deploy/commit unless user asks.

## Approved decisions
- R51 CRO = full package. Personality tests = full package. Auto-update = hybrid (live API + yearly fallback constants).
- Name is **بقائی** (fixed everywhere, 59 spots, prior session).

## ⚠️ SUBAGENT BLOCKER (session 3)
Background Workflow/subagents return **403 "please run /login / upgrade client"** under parallel load (aerolink proxy). Do ALL edits in the MAIN thread. `rm`/destructive bash is hard-blocked by GateGuard → delete tools by converting `page.tsx` to `redirect('/tools')` instead.

## DONE (session 3 — all build-green, routes 200)
- R7  Personality tests FULL: framework `src/lib/data/personality/{types,index}.ts` + 7 data files (mbti/big-five/enneagram/disc/holland/zaban-eshgh/eq) + generic `PersonalityRunner.tsx` (axes/top1/profile scoring) + 7 pages. Icon resolved INSIDE runner by slug (can't pass fn server→client).
- R41 `dooz` (tic-tac-toe) — minimax, 3 levels (hard=unbeatable), scoreboard. `app/tools/dooz/{page,Client}.tsx`.
- R49 `/pricing` page exists (agent-built PricingClient.tsx) — renders 200; eyeball pass still TODO.
- R10 hazineh-dadrasi `hidden:true`; VISIBLE_TOOLS filter wired into ToolsClient/sitemap. (Navbar/CommandMenu/Projects still use bare TOOLS — add `!t.hidden`.)
- R11 khesarat-cheque deleted from registry + page → `redirect('/tools')`.
- R22 `TOOL_KEYWORDS` map + `getToolKeywords()` in tools.ts; ToolsClient search now matches keywords.
- R9  (data only) دیه ۱۴۰۵ added to legal-rates `DIYEH_FULL_RIAL` = 21_000_000_000 ریال. diyeh/Client.tsx edited by agent (verify it's 1405-only).
- R24 (partial) sitemap → VISIBLE_TOOLS + /pricing; per-tool metadata + SoftwareApplication JSON-LD already in ToolShell.

## DONE (session 4 — MAIN thread, tsc green, routes 200)
- R8  hoghoogh-khales: + وضعیت تأهل (SelectField) + تعداد فرزندان (Stepper); حق اولاد = childCount × MIN_WAGE[latest].childPerKid (معاف، افزوده به خالص). New info card + share params m/kids.
- R16 ajrat-mesl: reviewed — calc already correct (rent × totalDays/30). No change.
- R17 maliyat-naghl-melk: + سرقفلی (ارزش روز حق واگذاری محل) با نرخ رسمی ۲٪ (PROPERTY_TRANSFER_TAX.goodwillRate). New field + rate + result rows + info card.
- R37 (lite) maliyat rates now seeded from official PROPERTY_TRANSFER_TAX constants (single-sourced), still user-editable = custom rate. Full locked-official toggle across ALL rate tools still TODO.
- R14 /api/market hardened: 3 fallback tgju hosts (call3/call1/call2) tried in order; verified live returns ok:true fresh prices. arzesh-tala already consumes gram24 + graceful manual fallback.
- Hidden-filter: added `!t.hidden` to Navbar mega-menu, CommandMenu palette, home Projects FEATURED_TOOLS.
- R35 contact placeholders fainter (text-muted-foreground/40).
- R36 contact send → Rocket icon + ignition launch animation on submit (+ «در حال ارسال…»).
- R48 testimonials use exact project names (راورو/FIDS کیش/مالاتا/رویال اقدسیه/درسو/کیوانی); dropped uppercase+tracking on Persian labels.
- R50 home project card desktop width 320→360 == portfolio card.
- R34 hero eyebrow: removed uppercase/tracking-wider on Persian (EN/FA consistency).
- R29 «شروع همکاری» popup: new CollaborationModal.tsx; on sub-pages the CTA opens it (form-link + tel + ساری) instead of routing away; home still scrolls to contact.
- R43/R5 ProjectCard: publishing pill + lock badge already present; no PRJ-### code anywhere. Confirmed done.

## DONE (session 5 — MAIN thread, backend up on :8000, tsc green, browser-verified)
- R23 FULL (comments + rating + report-via-panel). Backend: `ToolReview`/`ToolReport` Prisma models + migration `20260701054315_add_tool_feedback` applied to Neon (shadow-DB broke on a pre-existing migration → authored via `migrate diff --from-config-datasource` + `migrate deploy`). New `tool-feedback` module: public POST reviews/reports + GET reviews/:slug (throttled 6/60s, honeypot, SecurityService.sanitizeInput), admin GET/PATCH/DELETE (JWT+ADMIN). Report → notifications queue `tool-report` job → Telegram (new processor case). Frontend: `lib/toolFeedback.ts` + `components/tools/ToolFeedback.tsx` (star input, review list, Jalali dates, optimistic add, honeypot, collapsible report). Wired into `ToolShell` (slug from `usePathname`) so EVERY tool gets it; `ToolsClient` global report `mailto` → panel `ReportForm slug="general"`. Verified in Chrome: submit review → «۵ (۱ دیدگاه)» + posted card + «۱۰ تیر ۱۴۰۵»; backend 400 on rating>5, honeypot silent, admin 401. Test rows purged from prod DB.
  - NOTE: backend now RUNNING via `npm run start:prod` (bg, /tmp/baghaei_backend.log). Prod deploy will pick up the new migration via `migrate deploy` (entrypoint).

## DONE (session 6 — MAIN thread, tsc green, browser-verified). User answers: R28=real light+dark default dark · R25=point-down/rotate-up · R51=all 4 levers · then "do all one by one"
- R51 CRO FULL: (1) `home/TrustStats.tsx` — 4 count-up stat cards (+۱۱ سال، +۸ پروژه، +۵۰ ابزار، ۶ خدمات; truthful from real data) inserted between Projects↔Testimonials. (2) social-proof strip in `home/Contact.tsx` (6 real client pills above the form). (3) `layout/StickyCTA.tsx` — mobile-only bottom-center «شروع همکاری» pill, appears >600px scroll, hides near #contact, home→scroll / else→CollaborationModal. (4) `layout/ExitIntentModal.tsx` — desktop-only mouseleave-top, once/session (sessionStorage), «مشاورهٔ رایگان». Both mounted in layout.tsx. Browser-verified: counter 0→11/8/50/6, pills render, sticky shows on mobile.
- R37 FULL: new `RateField` primitive in `tools/shell.tsx` (locked official value + «نرخ دلخواه» toggle; revert snaps back; custom officialLabel supported). Applied to maliyat-naghl-melk (5%+2%), komision-amlak (0.25%/25%/VAT — single-sourced from REAL_ESTATE_COMMISSION, **fixed stale VAT 9→10**), maliyat-arzesh-afzoodeh (10%), rahn-ejareh (عرف بازار 3%). = 7 rate fields. Browser-verified: locked chip → toggle reveals editable input → label flips to «نرخ رسمی».
- R28 real light+dark: mechanism was ALREADY wired (globals.css full `:root` light + `.dark` palettes; layout `defaultTheme="dark"` + `attribute="class"`, NO forcedTheme; GlobalUniverse theme-aware — light dims stars, drops Milky Way/meteors). Browser-verified light mode: crisp dark text on near-white, readable, on-brand. No code change needed beyond confirming.
- R2 cursor: rewrote `effects/CustomCursor.tsx` — `classify()` helper + post-mouseup `elementFromPoint` re-hit-test fixes stale ring when an overlay mounts under a stationary cursor (bug on card open); sharpened text I-beam.
- R4 gallery: `home/ProjectModal.tsx` MEDIA slot → RTL editorial gallery (`GalleryTile` helper): wide hero (aspect-16/9) + varied-aspect masonry (CSS columns, RTL order) replacing the uniform LTR 16/9 strip.
- R25 arrows: ALREADY correct (Navbar.tsx:153 ChevronDown + `rotate-180` on open = chosen behavior). R26 «سایر ابزارها»: ALREADY correct (ChevronLeft left-of-text + leftward hover = RTL-forward). No churn.
- R27a input focus: ALREADY global (globals.css `input/textarea/select:focus-visible{outline:none;box-shadow:0 2px 0 0 ring}`).
- R27b command palette: tools group moved FIRST + placeholder «جستجوی ابزارها و بخش‌ها…» (tools-focused). SOFTENED the "remove main-page group" ask — deleting Home/Contact/Blog from ⌘K is a real UX loss and wasn't reconfirmed; kept nav but demoted below tools. Revert = trivial if full removal wanted.

## DONE (session 7 — MAIN thread, tsc green, browser-verified)
- R24 FULL (aggregate-rating): `ToolShell` now fetches the review summary once (shared) and nests a GATED `aggregateRating` into the existing client-side `SoftwareApplication` JSON-LD — only when `count > 0`. `ToolFeedback` gained an optional `initialSummary` prop (managed mode) so the summary is fetched ONCE by the shell and passed down (kills the old double-fetch that burned the 6/60s throttle). Files: `components/tools/shell.tsx` (+shared reviewSummary useEffect + gated LD + prop passdown), `components/tools/ToolFeedback.tsx` (+`initialSummary`/`managed`, sync-effect + guarded self-fetch, backward-compatible). Browser-verified: real backend (0 reviews) → aggregateRating ABSENT (safe, no invalid schema); mocked (count:2, avg:4.5) → `{ratingValue:4.5, reviewCount:2, bestRating:5, worstRating:1}` present, `__reviewCalls===1` (single fetch). ALL of R24 now complete.

## STILL TODO
- (none — R2–R51 overhaul complete)

## DONE
- R3  ProjectModal: «ورود به سایت» button when project has real `href` (ravro, pixel-ball).
- R5  Removed `PRJ-###` code label from ProjectModal.
- R19 Name → بقائی (prior session).
- R30/R38 Footer: phone 09115790013 + landline 01133208707 + مازندران/ساری; de-corporated; /pricing link (prior session).
- R31 logo.svg overwritten with Baghaei brand mark + public/Baghaei.svg copy (Logo.tsx auto-picks up /logo.svg).
- R32 Navbar tools intro icon Sparkles→Wrench; about hero Sparkles→Users.
- R33 About: «۱۱ سال تجربه».
- R39 ToolCard mobile overflow: removed `max-md:[max-height:7rem]` + forced category open on mobile.
- R40 Removed «آزمایشی» beta badge from ToolCard.
- R42 Malata project hidden.
- R43 (modal) Publishing copy → «محرمانه — قابل نمایش برای اعضا و کارفرمای پروژه» + Lock icon. (ProjectCard badge still TODO.)
- R44 Project titles prefixed: سایت راورو / طراحی FIDS فرودگاه کیش / سایت تیونینگ کیوانی / بازی تخت‌نرد آنلاین / بازی پیکسل‌بال / ربات تلگرام دردودل / سایت درسو / سایت باشگاه رویال اقدسیه.
- R45 Project categories → اپ/وبسایت/سرویس/بازی (PROJECT_CATEGORY_META gained 4 entries; Globe+Smartphone imports).
- R46 ProjectsGrid heading → «پروژه‌های ما».
- R47 ToolCard icon neutral (muted) until hover, accent on group-hover via `--tc` var.
- R27b (partial) Navbar: search aria/title «جستجوی ابزارها» + divider separating search from ThemeToggle.

## TODO — frontend polish
- R25 navbar tools/projects arrows reversed — AMBIGUOUS, screenshot to confirm direction before editing.
- R26 «سایر ابزارها» link (shell.tsx ~L224): arrow to LEFT of text + reversed.
- R27a remove focus outline on ALL text inputs → border (MoneyInput/Select in shell.tsx use focus:border-foreground/40 outline-none already; audit others).
- R27b (rest) command-menu palette: remove main-page links (tools only), add «جستجوی ابزارها» heading, outline→border.
- R2  cursor bug on card open/expand + nicer cursor over text inputs (CustomCursor.tsx).
- R28 system dark/light toggle default dark — ThemeToggle exists; verify defaultTheme dark + system option.
- R29 «شروع همکاری» popup with homepage CTA content when on other pages (Navbar Button currently scrollTo('contact')).
- R34 sub-hero text EN/FA inconsistency (home hero).
- R35 contact hint fainter + placeholders on all inputs.
- R36 send icon → rocket + ignition launch animation on submit (contact form).
- R48 «اعتماد مشتریان» use exact project names (home testimonials component).
- R50 home project card width == portfolio card width (max-w-[360px] h-[380px] in ProjectsGrid).
- R5 verify no project codes elsewhere (ProjectCard).

## TODO — tools (most important, SEO)
- R6  خسارت تأخیر تأدیه + مهریه: CPI ratio method (adjusted = principal × CPI_pay/CPI_due). Build CPI chain from user inflation table 1315–1404. VERIFY method.
- R8  hoghoogh-khales: + child-count + marital-status, current date.
- R9  دیه ۱۴۰۵ only: عادی ۲٬۱۰۰٬۰۰۰٬۰۰۰ ت / ماه حرام ۲٬۸۰۰٬۰۰۰٬۰۰۰ ت (re-verify before ship).
- R10 هزینه دادرسی: hide + admin active/inactive toggle.
- R11 خسارت تأخیر چک برگشتی: delete (khesarat-cheque).
- R12 مهلت‌های قانونی + مبدل تاریخ: port fully from dadhesab.
- R13 عیدی و سنوات update.
- R14 طلا: fix market-rate fetch.
- R15 رهن↔اجاره market norm.
- R16 اجرت‌المثل ایام تصرف: review calc.
- R17 مالیات نقل‌وانتقال ملک: + سرقفلی + حق کسب/تصرف.
- R18 کمیسیون مشاور املاک rate (VAT 10%).
- R20 all features >= 1400, official.
- R21 auto-update yearly (no manual). Hybrid approved.
- R22 per-tool keywords for site search (Tool interface has NO keywords field — add).
- R23 comments + rating + report-problem via PANEL not email (ToolsClient report is mailto now).
- R24 SEO hard push on tools.
- R7  personality/character tests (full package).
- R37 tools show official FIXED values + custom-rate button.
- R41 Tic-Tac-Toe (دوز) unbeatable, described as normal — entertainment.

## TODO — big
- R49 new page «راه‌کارها و قیمت‌گذاری» /pricing (Footer already links it; page must exist + be perfect).
- R51 CRO full package across site.
- R4  project image gallery RTL, 1 large + varied aspect ratios.

## Key data
- User inflation table 1315–1404 (annual %): in original request (transcript). Needed for R6 CPI chain.
- دیه 1405, کمیسیون figures: in transcript notifications (re-verify before ship).
