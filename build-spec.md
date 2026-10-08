# Kamalesh S: Cyborg Portfolio Build Specification

This document is a brief for an agent that will build a completely redesigned personal portfolio website. It describes **what the visitor should see, feel, and experience**, in what order, and at what timing. It deliberately contains **no code or syntax**. Choosing techniques, writing the code, and structuring files is entirely the building agent's job.

Read this whole document before starting. Sections 1 and 2 are the rules that override everything else.

---

## 1. Read-first rules

1. **Code only.** The site is built with hand-written code. No design tools, no video files, no GIFs, no Lottie files, no pre-rendered animation clips. Every animation, transition, and the showreel film must be produced by code running in the browser. The only external media allowed are the portrait photo and any thumbnail images supplied by the user.
2. **Static hosting.** The result must work as a plain static website on GitHub Pages: a small set of files, no server, no build step required to view it. Fonts may come from Google Fonts. Avoid heavy third-party libraries; if the agent believes one is truly necessary for a specific effect, it must say so and justify it.
3. **Standard sections only.** The page has exactly these sections, in this order: **Hero, About, Work (experience and projects combined in one section), Education and Certifications, Skills, Footer.** Do not add sections. Do not give projects their own separate section.
4. **The transitions between sections are the main creative event.** Content is conventional. The experience of moving from one section to the next is where the site earns its personality. Each of the five section boundaries has its own distinct transition (Section 7).
5. **The theme is "human becoming machine."** It is a cyborg theme, not a hacking theme. A visitor who has never heard of cybersecurity must understand and enjoy the page. Do not frame the visitor as an attacker, do not use fake hacking-movie clichés (falling green code, skull icons), and do not require technical knowledge to follow the story.
6. **Terminal flavor is seasoning, not the interface.** A small terminal-style moment appears in the hero (boot lines) and in the footer (an optional command prompt). Nothing else depends on typing commands.
7. **Never block a busy visitor.** Every cinematic moment must be skippable or short, and a recruiter with thirty seconds must be able to read the essentials without waiting for animation.
8. **Do not invent facts.** Only use the content provided in Section 9 and the user's confirmations. Where content is missing, use clearly marked placeholders (Section 10) and report them at the end.
9. **Do not copy the reference site.** A reference portfolio is mentioned in Section 3 for inspiration about depth and showreel quality only. Do not reuse its text, imagery, layout, or branding.

---

## 2. What the agent decides vs. what the user decides

**The agent decides:** all code, file structure, which web techniques to use for each effect, how to make effects fall back gracefully, naming, and implementation details.

**The user (and Kamalesh) decide:** the photo, the final project list, every factual claim, certification entries, skill levels, which email to publish, and which GitHub account each project belongs to. Anything unresolved ships as a placeholder and is listed in the final report.

**The agent must not** quietly substitute its own content for missing content. If something is unknown, mark it and move on.

---

## 3. Source material and reference

### The current site (to be replaced)
- Repository: `https://github.com/kamalesh-sudo/kamalesh-portfolio` (a re-skinned open-source template with a sidebar layout and four tabs: About, Resume, Portfolio, Contact).
- Live site: `https://kamalesh-sudo.github.io/kamalesh-portfolio/`
- It currently has a working contact form pointing at a Formspree endpoint. The agent should read the current `index.html` in the repo and reuse that form endpoint for the new footer contact form.
- **Do not carry over:** the phone number, the exact birthday, the percentage skill bars, the dead social links, or the stock template visuals.

### The reference portfolio (inspiration only)
- `https://senthilsk10.github.io/Senthilsk10/`
- What to study: (a) the hero, where a headshot sits among floating labels and feels dimensional; (b) the section titled "Know the work", a short looping animated film made from code that explains what the person does, with tap-to-pause/play. Open the page in a browser and inspect how it feels and moves. The agent may view the page source to understand technique.
- What not to do: do not clone it. The new site has its own concept (human becoming machine), its own palette, and its own choreography.

### Who the site is about
Kamalesh S: final-year B.E. Information Technology student at Annamalai University (2022 to 2026), security researcher focused on web application security and bug bounty, with a background in backend development, AI projects, and geospatial work. Operating system of choice is Arch Linux (KDE, Hyprland). Full factual content is in Section 9.

---

## 4. Concept and emotional arc

The visitor scrolls from a **warm, human** beginning to a **cool, machine** ending. Along the way a figure on the side of the screen gains implants, one per section. By the footer, the system is fully "online" and then powers down into a calm standby state. The arc is: *Meet the person, then see the augmentation, then see what it can do, then rest.*

Tone: confident, precise, slightly playful. Never menacing, never cluttered.

The persistent device that makes this feel like one story rather than six pages is **one global colour shift plus one side figure** (Section 6).

---

## 5. Visual identity

### Palette (design tokens)
- Void (page background): near-black blue, `#05070b`
- Panel: slightly lighter, `#0b1118`
- Line / borders: `#1b2733`
- Text: soft cool white, `#d7e3ee`
- Human accent: warm amber, `#ffb454`
- Machine accent: Arch blue `#1793d1`, with a brighter glow variant `#38d0ff`
- Alert: `#ff4d6d`, used **only** for glitch moments and the "weak point" in the film. Never as a general accent.

### Typography
- Headings: Chakra Petch
- Labels, readouts, boot text, captions: JetBrains Mono
- Body copy: Inter
Provide sensible fallback fonts for each. Headings large and tight, labels small and spaced, body comfortable.

### Shape language
- Panels and cards have **chamfered (angled-cut) corners**, never round ones. Buttons and chips follow the same language.
- Thin one-pixel borders in the line colour, brightening to the accent colour on emphasis.
- A very faint horizontal scanline texture over dark panels. Keep it subtle enough that text stays crisp.
- Glow is used sparingly: only on the accent colour, only on active or important things.

### Motion language
- Entrances: **fast out, slow settle.** Things arrive quickly and ease to rest. Slight overshoot only for the "module seating" moments in Skills.
- Staggers: related items arrive in sequence (roughly 80 to 120 milliseconds apart), never all at once.
- Holds: any text the visitor is meant to read stays on screen long enough (roughly one second minimum, longer for longer text).
- Glitches are brief (well under half a second), purposeful, and only occur at state changes.
- Idle loops are quiet. Nothing should draw attention away from the content.

---

## 6. Global systems (present across the whole page)

### 6.1 The conversion colour
The page's accent colour is **not fixed**. It smoothly travels from warm amber at the very top of the page to machine blue at the very bottom, driven by scroll position. Borders, glows, highlights, the side figure, and the progress readout all follow this one shifting colour. The visitor should feel the page "cooling" as they go, without ever noticing a single abrupt change.

### 6.2 The side figure (progress rail)
- A slim vertical strip fixed to the right edge of the screen on large screens.
- It shows a simple human silhouette with **six implant points**: optic (eye), neural (temple), voice (throat), core (chest), arm interface, and a final link point at the hand.
- Each implant has three states: **dim** (not reached), **active** (gently pulsing in the current accent colour), **done** (solid).
- Which implants are active corresponds to the section currently on screen: Hero lights the first, About the second, and so on through the Footer, where all are done and then dim into standby.
- Next to the figure, a small monospace readout reads `AUGMENT` followed by a percentage that rises with overall scroll progress.
- On small screens (phones), hide the figure and show only a thin progress bar along the top edge in the current accent colour.

### 6.3 Top navigation
- Minimal: a small `KS` monogram on the left, five numbered links on the right (01 About, 02 Work, 03 Education, 04 Skills, 05 Contact).
- It hides when the visitor scrolls down and reappears when they scroll up.
- The current section's link is marked with an underline in the accent colour.
- On phones, collapse into a simple menu that opens a full-screen overlay with large links.

### 6.4 Cursor
Keep the normal system cursor. On devices with a mouse, add a small ring in the accent colour that trails the pointer slightly. Do nothing special on touch devices.

### 6.5 Scroll behaviour
- Use natural, native scrolling. **Never hijack or slow the scroll.**
- Scroll-linked effects must be **reversible**: scrolling up plays the effect backward.
- If a scroll-linked effect cannot run in a given browser, fall back to a simple one-shot fade-in when the section arrives. The content must always be reachable and readable.

---

## 7. Section by section

### 7.1 Hero

**Layout.** Full-screen. On wide screens: text on the left, large portrait on the right. On phones: portrait on top, text beneath, centered.

**Boot sequence choreography (total about 4.5 seconds):**

| Time | What the visitor sees |
|---|---|
| 0.0 s | Pure dark screen. |
| 0.0 to 0.4 s | A "screen turn-on": the stage expands from a thin bright line to full height with a quick brightness flash. |
| 0.3 to 1.5 s | Five short boot lines type out one after another in monospace (about 0.2 s each): `> KS-01 // POWER ON`, `> LOADING HUMAN CORE .... OK`, `> MOUNTING OPTICS ........ OK`, `> LINKING NEURAL STACK ... OK`, `> HELLO.` |
| 1.5 to 1.9 s | The boot lines slide upward slightly and fade away. |
| 1.7 to 2.6 s | The portrait materializes: fades in while moving forward from slightly behind, with a soft amber glow ring expanding behind it. |
| 2.2 to 3.1 s | The name appears as `I AM` followed by `KAMALESH S`, each letter briefly scrambling before settling, left to right with a small stagger. |
| 3.0 to 3.6 s | A title chip reading `SECURITY RESEARCHER` slides in. Two buttons (`View Work` and `Contact`) rise in, one after the other. |
| 3.4 to 4.5 s | The floating labels fade in. A scroll cue reading `SCROLL TO AUGMENT` begins a gentle pulse. |

**Skipping.** Any click, key press, or scroll skips straight to the finished state. If the visitor has already seen the boot sequence in the current browsing session, skip it automatically on return. If the visitor prefers reduced motion, show the finished state immediately with no sequence.

**Do not reveal the page before the portrait image has loaded**, so the sequence never completes before the photo exists.

**The depth ("3D") effect on the portrait.**
- Build the hero as **layers at different depths**, back to front: a faint perspective grid floor, a huge ghosted `KS` lettering, the portrait itself, a thin HUD overlay (an eye-ring and crosshair drawn over the portrait's eye area), and finally the floating labels closest to the viewer.
- With a mouse, the whole stage tilts gently toward the pointer (a few degrees at most) and each layer shifts by a different amount, so deeper layers move less and nearer ones move more. Movement must be smoothed, never jittery.
- A soft spotlight in the current accent colour follows the pointer across the portrait.
- On touch devices there is no pointer, so the stage slowly sways back and forth on its own in an eight-second loop. Do not ask for motion-sensor permission.
- **Portrait treatment (the signature cyborg look):** the face is split down the middle. The left half is natural and warm. The right half has a cool blue monochrome "machine" treatment. A thin glowing seam runs along the split. If the supplied photo has a transparent-background cutout, the effect looks best; if not, frame the photo in a chamfered panel instead.
- **Idle life:** a thin scan line sweeps across the portrait every few seconds; the HUD eye-ring pulses slowly; each floating label bobs on its own slightly different rhythm so they never move in sync.
- **Floating labels:** four small chamfered pills near the portrait at different depths. Suggested: `BURP SUITE`, `LINUX`, `PYTHON`, `BUGCROWD`. The user confirms the final four.

**Hero text content:** name, title chip, one short sentence (max about 20 words), two buttons, and small social icons. Nothing more.

### 7.2 Transition: Hero → About ("X-ray scan")

- As the visitor scrolls, the hero **stays pinned** for roughly one and a half screens of scrolling while the transition plays, then releases.
- A bright horizontal scan line travels down the portrait in step with scroll. Everything the line has passed through becomes the "machine view": the portrait switches to a cool wireframe-style treatment with a circuit overlay. Everything below the line remains natural.
- At the same time, the hero text gently lifts and fades.
- When the line reaches the bottom, the machine-view portrait dims to a low-opacity background layer that carries into the About section as its backdrop. This is a hand-off, not a cut.
- The About content then arrives in sequence.

### 7.3 About

- **Layout:** two columns. Left, a large sticky silhouette with three implants. Right, the text.
- **Text:** three short blocks of at most two sentences each:
  1. Who he is.
  2. What he does.
  3. Where he is heading.
- As each block comes into view, one of the silhouette's three implants lights up.
- **Stat chips:** three or four small chips that count up from zero when they come into view (about 0.9 s). **Use only verified numbers** (Section 9). Until verified, use clearly marked placeholders.
- **Below the text:** the "Know the work" film (Section 8), presented as a widescreen "optic feed" panel with a small `OPTIC FEED // LIVE` label.

### 7.4 Work (experience and projects together)

**Structure.** One section. A small divider label `// ROLES` introduces two cards; a second divider `// BUILDS` introduces the rest. Total of six cards maximum.

**Card behaviour (the "rack" effect).** Cards are **stacked**. As the visitor scrolls, each new card slides up and settles slightly below the previous one, and the previous card shrinks a touch and dims. The visual metaphor is panels sliding into a server rack. Cards remain readable at every moment.

**Card contents:**
- Top bar: index (for example `01 / 06`), a type tag (`ROLE` or `BUILD`), and a date.
- Left side: title, one-line summary, one impact line, stack chips, and a link button.
- Right side: a **unique animated visual made purely from code** (no images). Each loops quietly. See the visual list below.
- Interaction: on hover or tap, the card lifts slightly, its border brightens, and three extra detail lines expand open.

**The six cards (user confirms final list and wording):**

| # | Type | Title | Date | Link placeholder |
|---|---|---|---|---|
| 1 | ROLE | Cybersecurity Intern, Elevate Labs | 2 months, `{{DATES}}` | none |
| 2 | ROLE | Cybersecurity Researcher, Bugcrowd | 2024 to present | `{{BUGCROWD_PROFILE_URL}}` |
| 3 | BUILD | NeuroSploit (recon framework with a terminal interface) | `{{DATE}}` | `{{NEUROSPLOIT_REPO_URL}}` |
| 4 | BUILD | Behavioral Auth System (behaviour-based authentication) | `{{DATE}}` | `{{BEHAVIORAL_AUTH_REPO_URL}}` |
| 5 | BUILD | Smooth Visualization of Satellite Imagery (Smart India Hackathon) | July 2024 | `{{SATELLITE_REPO_URL}}` |
| 6 | BUILD | Geospatial Semantic Segmentation (Rackathon) | March 2025 | `{{SEGMENTATION_REPO_URL}}` |

Bug bounty write-ups (for example the clickjacking report) are **links inside card 2**, not separate cards: `{{BUG_REPORT_URL_1}}`, `{{BUG_REPORT_URL_2}}`.

**Card visuals (all drawn and animated by code, all looping, all calm):**
1. *Intern:* a simplified web page outline; a magnifying lens glides across it and a small flag pops up at one spot.
2. *Researcher:* a padlock that shakes once, flips open in the alert colour, then closes in the accent colour with a small check pulse.
3. *NeuroSploit:* a miniature terminal window. A command types in, a progress bar fills, and result rows appear one at a time.
4. *Behavioral Auth:* a faint cursor path draws itself while a "trust" meter climbs from low to high.
5. *Satellite:* two map-like grid frames with glowing land shapes that smoothly morph between each other, with a small timeline marker ticking beneath.
6. *Segmentation:* a grey terrain block field that sweeps, left to right, into colour-coded classes.

### 7.5 Transition: Work → Education ("memory rewind")

- Plays as the visitor scrolls out of Work, over roughly half a screen of scroll.
- The page appears to **rewind like a tape**: the outgoing content splits into about a dozen horizontal strips that slide sideways in alternating directions, with a brief cool-blue and alert-red colour split on the edges, building to a peak in the middle and settling back.
- The side figure's `AUGMENT` percentage briefly flickers backward by a few points, then resumes. This sells the "going back in time" feeling because Education is his origin.
- Education then fades in from slightly blurred to sharp.

### 7.6 Education and Certifications

- Two columns.
- **Left (Education):** Annamalai University, B.E. Information Technology, 2022 to 2026, shown as a short "origin log" of three or four monospace lines that type in one at a time when scrolled into view. Suggested lines: enrolled (2022), Smart India Hackathon (2024), Rackathon (2025), graduating (2026). The user confirms wording.
- **Right (Certifications):** badge tiles that each "scan in" (a quick scan bar passes over the tile as it appears).
- **Important:** the current site lists no certifications. Render this column from a simple list of entries and **ship it with a single tasteful "more in progress" tile if no verified certifications are supplied.** Never invent certifications, and never list courses or labs as certifications unless the user confirms them.

### 7.7 Transition: Education → Skills ("module install")

- As Skills enters, the section appears to be a circuit board with four empty bays.
- Skill chips fly in from the sides and **click into their slots**, each with a tiny overshoot and a brief ring flash in the accent colour.
- Each bay's header types `LOADING MODULE ... OK` before its chips arrive. Stagger: about 0.3 s between bays, about 0.09 s between chips within a bay.

### 7.8 Skills

- Four bays: **Security**, **Systems and Linux**, **Development**, **AI and Geospatial**.
- **No percentages and no progress bars.** Show proficiency as a three-state glow on each chip: *learning* (dim outline), *working* (solid accent), *strong* (filled and softly glowing), with a small legend.
- Suggested chip contents (the user confirms and sets the levels): Security: Burp Suite, OWASP ZAP, Nmap, Wireshark, Aircrack-ng, Metasploit. Systems and Linux: Arch Linux, Kali, Bash, Hyprland. Development: Python, FastAPI, REST APIs. AI and Geospatial: semantic segmentation, frame interpolation, WMS and GeoServer.

### 7.9 Transition: Skills → Footer ("power-down")

- Scroll-linked, over roughly half a screen.
- The Skills panel squeezes vertically into a single bright horizontal line, then squeezes horizontally into a single glowing dot, then the dot fades, like an old screen shutting off.
- The side figure dims every implant into standby, and the page's accent colour has fully arrived at machine blue.
- The footer then fades in calmly.

### 7.10 Footer ("system idle")

- A blinking block cursor, the name `KAMALESH S`, the role line, social links, and a compact contact form (reuse the existing form endpoint from the current site).
- **Optional terminal prompt:** a small prompt that accepts a few friendly commands: `contact`, `github`, `linkedin`, `resume`, `help`. Provide **tappable chips** with the same commands for phones and for visitors who do not want to type. If a resume file is not supplied, the `resume` command shows a polite "coming soon" line.
- Small copyright line and a note such as "Built with HTML, CSS and a little JS."

---

## 8. "Know the work": a pure-code motion graphics film

**What this is.** A short, looping, **motion-graphics film generated entirely by code**. It is **not** a video file, **not** a GIF, **not** an image sequence, **not** a Lottie animation. It is shapes, lines, and text animated live in the browser. Its purpose is to explain what Kamalesh does to a non-technical visitor in about twenty-five seconds, through visuals and a few words.

**Story.** *Finding a weakness in something people trust, proving it safely, reporting it clearly, and helping fix it.* No jargon.

**Presentation.**
- Widescreen panel inside About, titled with a small label `OPTIC FEED`.
- Tap or click anywhere on the frame to pause or play. A small pause or play glyph indicates state.
- A thin progress bar runs along the bottom edge, with five small tick marks at the scene boundaries.
- It **only plays while it is on screen** and pauses itself when scrolled out of view, to save the visitor's battery and performance.
- Starts playing automatically and silently. **No audio.**
- Loops seamlessly: the last moment must visually flow into the first.

**Synchronisation requirement.** All elements in the film must run from **one shared timeline**, so pausing freezes everything together and scenes never drift out of sync. The agent chooses how to achieve this.

**Captions.** Tiny monospace captions in the lower left, typing in at the start of each scene and clearing before the next. Maximum six words each. Each caption holds at least one second.

### Storyboard (25 seconds)

**Scene 1: "A product people trust" (0.0 to 4.0 s)**
- 0.0 s: dark frame. A blank outline of a web browser window draws itself, edge by edge, in calm machine blue (0.0 to 1.2 s).
- 1.2 to 2.4 s: inside the window, a simple login form assembles: a title bar, two input fields, a button. Elements arrive with small staggers.
- 2.4 to 3.6 s: a soft green "secure" check glows beside the button, steady and reassuring.
- Caption types at 0.4 s: `A product people trust.`
- Mood: calm, orderly, slow.

**Scene 2: "Spot the weak point" (4.0 to 9.0 s)**
- 4.0 s: the calm tone breaks. A circular magnifying lens (a ring with a faintly brightened interior) enters from the left and slides slowly across the form.
- 5.0 to 6.5 s: the lens pauses over the button. A targeting reticle locks on with four small corner ticks closing inward, accompanied by small tick marks around the ring.
- 6.5 to 8.0 s: the button begins pulsing in the alert colour, getting a little faster each beat.
- 8.0 to 9.0 s: the lens pulls away, leaving a glowing red mark on the button.
- Caption types at 4.2 s: `Spot the weak point.`
- Mood: tension building.

**Scene 3: "Prove it, safely" (9.0 to 14.0 s)**
- 9.0 to 10.5 s: the browser window gently separates into layers, like an exploded diagram. Between the layers, a transparent outlined layer is revealed sitting on top of the real button.
- 10.5 to 12.5 s: a small cursor enters, moves to the button, and clicks. A ripple expands. Nothing bad happens; a small flag labelled `PROOF` rises from the button and unfurls.
- 12.5 to 14.0 s: the layers settle back together.
- Caption types at 9.2 s: `Prove it. Harmlessly.`
- Mood: curious, careful, controlled.

**Scene 4: "Write it up clearly" (14.0 to 19.0 s)**
- 14.0 to 15.5 s: the browser window folds and morphs into the shape of a document page.
- 15.5 to 17.5 s: text lines draw themselves onto the page, one by one, in short and long bars like a written report.
- 17.5 to 18.2 s: a badge reading `HIGH` slams onto the page: it starts large, shrinks fast onto the page, and delivers a tiny screen shake on impact.
- 18.2 to 19.0 s: hold.
- Caption types at 14.2 s: `Write it up clearly.`
- Mood: decisive.

**Scene 5: "Help them fix it" (19.0 to 23.0 s)**
- 19.0 to 20.2 s: the document unfolds back into the browser window.
- 20.2 to 21.4 s: the red mark on the button shifts to machine blue, then a shield shape snaps over it.
- 21.4 to 22.4 s: a padlock closes and a gentle pulse travels outward.
- 22.4 to 23.0 s: the word `RESOLVED` types in.
- Caption types at 19.2 s: `Help them fix it.`
- Mood: relief, satisfaction.

**Scene 6: Loop-out (23.0 to 25.0 s)**
- 23.0 to 24.2 s: the camera pulls back so the browser shrinks and the `KS` monogram becomes the focus.
- 24.2 to 25.0 s: monogram fades out into the opening dark frame so the loop restarts without a visible jump.
- No caption.

### Film rules
- Use only the site's palette. The alert colour appears only in scenes 2 through 4 and is replaced by machine blue in scene 5, so the colour itself tells the story.
- Visual rhythm: slow, quick, slow, quick, slow. Do not keep a constant tempo.
- Every scene has a clear "hold" beat so the visitor can read.
- If the visitor prefers reduced motion, replace the film with a **static row of five storyboard frames** (one per scene) with their captions.
- The film must remain smooth on a mid-range phone. If performance is poor, simplify rather than stutter.

---

## 9. Content (verified facts the agent may use)

- **Name:** Kamalesh S (GitHub display name shows "Kamalesh selvakumar"; use "Kamalesh S" on the site)
- **Title:** Security Researcher
- **Education:** B.E. Information Technology, Annamalai University, 2022 to 2026 (final year)
- **Location:** Cuddalore, Tamil Nadu, India (may be shown at city level only)
- **Experience:**
  - Cybersecurity Intern, Elevate Labs (security solution provider), 2 months. Vulnerability assessments with Burp Suite, OWASP ZAP, Nmap; security audits on web applications.
  - Cybersecurity Researcher, 2024 to present. Reports vulnerabilities on Bugcrowd, including rate-limiting bypasses, server misconfigurations, and injection issues.
  - Rackathon participant, March 2025: semantic segmentation tool for satellite map data using WMS and GeoServer layers.
  - Smart India Hackathon, July 2024: interpolated video transitions from satellite imagery using a custom deep learning model.
- **Projects:** NeuroSploit (interactive recon framework with a terminal interface, asynchronous scanning, headless mode); Behavioral Auth System (behaviour-based authentication with real-time risk scoring, role-based access, device and IP blocking); satellite visualization; geospatial segmentation.
- **Setup:** Arch Linux, KDE Plasma, Hyprland.
- **About paragraph themes:** web application security, bug bounty, AI plus security, open source, hackathons, CTFs.

**Do not state** any statistic, award, ranking, bounty amount, or acceptance status that is not listed here or explicitly confirmed by the user.

---

## 10. Placeholders (links and assets)

The agent must build the site so it **works and looks complete even with placeholders**, and so the user can swap each one in by changing a single obvious place. Use these exact placeholder names so the user can find them.

### Photo and image assets

| Placeholder | Meaning | Suggested filename |
|---|---|---|
| `{{PHOTO_PORTRAIT_CUTOUT}}` | Portrait with transparent background, high resolution, good light, face centered, shoulders visible | `assets/images/kamalesh-portrait-cutout.png` |
| `{{PHOTO_PORTRAIT_FALLBACK}}` | Normal (non-cutout) portrait used inside a framed panel if no cutout is supplied | `assets/images/kamalesh-portrait.jpg` |
| `{{FAVICON}}` | Small square monogram icon | `assets/images/favicon.ico` |
| `{{OG_IMAGE}}` | Social share preview image, 1200 by 630 | `assets/images/og-preview.png` |

Until real images arrive, the agent must generate a **neutral silhouette stand-in** so every layout, the depth effect, and the half-and-half treatment can be tested.

### Links

| Placeholder | Known or suggested value (user to confirm) |
|---|---|
| `{{GITHUB_PROFILE_URL}}` | `https://github.com/kamalesh-sudo` |
| `{{LINKEDIN_URL}}` | `https://www.linkedin.com/in/kamalesh-s-260588305/` |
| `{{BUGCROWD_PROFILE_URL}}` | `https://bugcrowd.com/h/kamalesh2428k` |
| `{{LIVE_SITE_URL}}` | `https://kamalesh-sudo.github.io/kamalesh-portfolio/` |
| `{{NEUROSPLOIT_REPO_URL}}` | `https://github.com/kamalesh-sudo/neurosploit` |
| `{{BEHAVIORAL_AUTH_REPO_URL}}` | `https://github.com/kamalesh-sudo/Behavioral_Auth_System` |
| `{{SATELLITE_REPO_URL}}` | `https://github.com/kamalesh-sudo/Smooth-Visualization-of-Satellite-Imagery` |
| `{{SEGMENTATION_REPO_URL}}` | **Needs confirmation.** The old site pointed to a repository under a different GitHub account. |
| `{{BUG_REPORT_URL_1}}`, `{{BUG_REPORT_URL_2}}` | **Needs confirmation.** The old site pointed to report files under a different GitHub account. |
| `{{EMAIL}}` | **Needs confirmation.** Two different emails appear across his pages. Publish only the one he picks. |
| `{{RESUME_URL}}` | Not supplied. The terminal `resume` command shows "coming soon" until provided. |
| `{{CONTACT_FORM_ENDPOINT}}` | Reuse the existing form endpoint from the current site's `index.html`. |

**Account ownership flag.** Several project links on the current site point to a different GitHub account than Kamalesh's own. Do not publish a link that points to someone else's account without the user confirming it is correct and that credit is accurate. If unconfirmed, point to the version under Kamalesh's account or leave the placeholder visible in the report.

---

## 11. Accessibility, performance, responsiveness

**Accessibility**
- Respect the visitor's reduced-motion preference everywhere: replace the boot sequence, scan, rewind, power-down, and film with simple fades or static frames.
- Text must be comfortably readable against the dark background everywhere, including over glows.
- All interactive items work with a keyboard and show a clear focus indicator in the accent colour.
- Pause/play for the film is a real button, reachable by keyboard.
- All meaningful images and the side figure have appropriate text alternatives; purely decorative layers are hidden from assistive technology.

**Performance**
- Prefer animations that are cheap for the browser. Avoid anything that forces constant page re-layout while scrolling.
- Only effects currently on screen should be actively animating.
- Compress images, use modern formats, and load below-the-fold images lazily.
- The first view (hero) must appear quickly. The boot sequence must not delay access to content for repeat visitors.

**Responsiveness**
- Test at phone, tablet, laptop, and large desktop widths.
- On phones: no side figure (use the top progress bar), stacked hero, shorter transitions, reduced stacking offsets in Work, and larger tap targets.
- Nothing may require hover to be understood; hover extras must have a tap equivalent.

**Browser support**
- The experience should be at its best in recent Chromium-based browsers and recent Safari, and must degrade gracefully in Firefox and older browsers: content readable, navigation working, transitions reduced to simple fades.
- The page must remain readable and navigable even if scripting fails.

---

## 12. Privacy and integrity rules

- Do **not** publish a phone number, exact birthday, or street-level location.
- Show location at city and state level only.
- Do not include analytics or trackers unless the user asks.
- Do not claim certifications, awards, bounties, or rankings without confirmation.
- The contact form must clearly tell the visitor where their message goes (a short line is enough).

---

## 13. Suggested build order

1. Set up the page skeleton, tokens, fonts, panel style, and stand-in silhouette.
2. Build the global systems: conversion colour, side figure, navigation, progress readout.
3. Build the Hero including the boot sequence, depth effect, and idle life.
4. Build the Hero to About transition and the About section.
5. Build the "Know the work" film as a standalone piece, then embed it.
6. Build Work with the stacked cards and the six card visuals.
7. Build the rewind transition, then Education and Certifications.
8. Build the module-install transition, then Skills.
9. Build the power-down transition and the Footer, including the optional prompt.
10. Add reduced-motion, mobile, and fallback behaviour; test everything; fix performance.
11. Replace placeholders as real assets arrive.

---

## 14. Definition of done (acceptance checklist)

- [ ] Exactly six sections in the specified order, with Work combining experience and projects.
- [ ] Five distinct, reversible section transitions, each matching its description.
- [ ] The page colour travels from amber to blue across the full scroll.
- [ ] The side figure lights implants in step with the sections and goes to standby at the end.
- [ ] The hero boot sequence is under five seconds, skippable, and skipped on repeat visits within a session.
- [ ] The portrait has visible depth with pointer movement on desktop and an automatic sway on touch devices.
- [ ] The film is entirely code-driven, 25 seconds, loops seamlessly, pauses on tap, and pauses when off screen.
- [ ] No percentages or progress bars anywhere in Skills.
- [ ] No unverified facts, no phone number, no birthday.
- [ ] Every placeholder is findable, documented, and the site looks complete with stand-ins.
- [ ] Reduced-motion and mobile versions work and read well.
- [ ] A short final report lists: what was built, which placeholders remain, which links need confirmation, and any technical trade-offs made.

---

## 15. Final report the agent must return

When the build is complete, return:
1. A summary of what was delivered and how to open it.
2. A list of every unresolved placeholder and what is needed to resolve it.
3. Any link or claim the agent was unable to verify.
4. Any place where a browser may show a simplified fallback.
5. Anything the agent chose to do differently from this document, and why.