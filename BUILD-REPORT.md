# Build report: Kamalesh S portfolio

## 1. What was delivered

A static, single-page portfolio (HTML, CSS, vanilla JavaScript; no framework, no build step, no video, GIF, or Lottie). It is ready for GitHub Pages.

**Sections, in order:** Hero, About, Work (experience and projects combined), Education and Certifications, Skills, Footer/Contact.

**Global systems**
- Accent colour travels from amber to blue across the full scroll.
- Side figure (desktop) lights one implant per section, shows an `AUGMENT n%` readout, and goes to `STBY` standby at the footer. Phones get a thin top progress bar instead.
- Navigation hides on scroll down and returns on scroll up, marks the active section, and has a full-screen mobile menu (focus trap, Escape to close, focus returns to the toggle).
- Ring cursor on fine pointers only.

**Hero:** about 4.5 s boot sequence (skippable by any key, click, wheel, touch or scroll; skipped on repeat visits in the same tab session and when arriving at a `#section` link). Portrait has pointer depth on desktop and automatic sway on touch. Idle scan line, eye-ring pulse, and independently bobbing labels.

**"Know the work" film:** 15 s Canvas 2D motion graphic drawn entirely in code from one master clock. It loops, pauses on tap/click/Enter/Space, pauses when off screen or when the tab is hidden, and lowers quality if frames drop. Reduced-motion visitors see a five-frame storyboard instead. A standalone preview is at `reel-preview.html` (`?t=7.5` jumps to a moment).

**Transitions (all are pure functions of scroll position, so they reverse cleanly):**
1. Hero to About: X-ray scan that converts the portrait from human to machine.
2. About to Work: the optic feed dims while server-rack rails slide in, then the six Work cards stack.
3. Work to Education: memory rewind (the work log shears into glitch strips and settles).
4. Education to Skills: module install (bays type `LOADING MODULE ... OK`, then chips seat in).
5. Skills to Footer: power-down (the board squeezes to a line, then a dot, then fades into the footer).

**Footer:** socials, an optional terminal prompt (`help`, `contact`, `github`, `linkedin`, `resume`, `clear`, with tappable chips), and a Formspree contact form that says where messages go. The form also works without JavaScript.

### How to open it
- **Recommended:** serve the folder over HTTP, e.g. `npx serve .` or `python -m http.server` in this folder, then open the printed address. GitHub Pages works the same way.
- Double-clicking `index.html` also works, but browsers block CSS masks on `file://`, so the thin glowing seam on the portrait does not appear. Everything else runs.
- Placeholder values live in `js/site-config.js`; the tracker is `PLACEHOLDERS.md`.

## 2. Verification performed

Automated headless Edge runs (screenshots plus in-page assertions), no console errors in any run over HTTP:

| Check | Result |
|---|---|
| Phone 390x844 (touch), tablet 768x1024, laptop 1440x900, desktop 1920x1080 | All sections render; no horizontal overflow at any size |
| Reduced motion | Boot skipped, transitions become static states, film shows storyboard, all content readable |
| JavaScript disabled | All six sections, the full Work content, Skills and the contact form are readable and usable |
| Keyboard | Skip link first, visible focus rings, Details toggles update `aria-expanded`, mobile menu Escape works |
| Nav anchors | Land just below the fixed nav, forward and backward |
| Off-screen suspension | Film stops when scrolled away; card visual animations pause off screen |
| Reverse scrolling | Rewind, module install and power-down replay in reverse |
| Content integrity | No phone, birthday, street address, analytics, percentages, or `iharishragav` links |

Not tested: real Safari/iOS and Firefox devices (only Chromium headless was available). See section 5.

## 3. Unresolved placeholders

Full detail, current values, and what is needed are in `PLACEHOLDERS.md`. Summary:

- **Images:** `PHOTO_PORTRAIT_CUTOUT` (most important; a code-drawn silhouette stands in), `PHOTO_PORTRAIT_FALLBACK`, `OG_IMAGE`. `FAVICON` is a code-drawn KS monogram to confirm.
- **Missing links:** `SEGMENTATION_REPO_URL`, `BUG_REPORT_URL_1`, `BUG_REPORT_URL_2`, `EMAIL` (icon hidden), `RESUME_URL` (terminal says "coming soon"). Pending buttons display "soon" and are disabled.
- **Dates:** `INTERN_DATES`, `NEUROSPLOIT_DATE`, `BEHAVIORAL_AUTH_DATE` show "date to confirm".
- **Certifications:** none listed; a "More in progress" tile is shown.
- **Skill levels:** every chip ships as `working` until Kamalesh sets learning / working / strong.

## 4. Links and claims not verified

- **Candidate links, live but unconfirmed:** GitHub profile, LinkedIn, Bugcrowd profile, live site URL, and the NeuroSploit, Behavioral Auth and Satellite repos (all under `kamalesh-sudo`).
- **Ownership flag:** the old site pointed NeuroSploit, Satellite, Segmentation and both bug write-ups at `github.com/iharishragav`. None of those are published.
- **Draft wording:** hero sentence, hero labels, About paragraphs, card summaries and detail lines, origin log lines, and bug-report link labels.
- **Derived stats:** `2` hackathons, `4` featured builds, and "researching since 2024" are counted from the brief, not supplied.
- **Hackathon labels:** the old site tagged segmentation as SIH and a SmartWardrobe project as Rackathon; the site follows the brief (segmentation = Rackathon). SmartWardrobe is not included.
- **Email:** two different addresses appear across his pages; none is published.

## 5. Where browsers may show a simpler version

- **Without `@property` support** (older Safari/Firefox): the automatic portrait sway on touch devices does not animate; the portrait stays still.
- **Without CSS mask support, or on `file://`:** the portrait seam line is hidden; the split face and X-ray still work.
- **Without `IntersectionObserver`:** sections appear immediately instead of fading in.
- **Short phones (under 640 px tall):** Work cards scroll normally instead of stacking, so long cards never trap the reader.
- **Reduced motion or no JavaScript:** every transition is replaced by its final, readable state, and the film is replaced by stills.
- Scroll is never hijacked; all effects follow native scrolling.

## 6. Deliberate differences from `build-spec.md`

- **Film is 15 s, not 25 s.** You asked for a 15-second reel. The spec's storyboard beats (trusted interface, hidden layer found, proof, report, fix, monogram) were compressed to fit.
- **Classic `defer` scripts sharing one `window.KS` namespace instead of ES modules.** ES modules refuse to load from `file://`, so this keeps the site openable by double-click while still needing no build step.
- **About to Work transition:** the spec describes four transitions in detail but leaves this boundary unspecified; it was filled with a restrained optic-feed-to-server-rack handoff to reach the required five.
- **Power-down uses a spacer element** under the Skills board so the board can hold still before it squeezes; the visual result matches the spec.
- **Stats and skill levels** use derived values and a neutral default rather than invented numbers (see sections 3 and 4).
