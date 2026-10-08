# Placeholders and open questions

Everything on the site that is unknown, unconfirmed, or still a stand-in is listed here.
**Where to change it:** almost everything lives in [`js/site-config.js`](js/site-config.js). Set the `value` and the site picks it up on the next load. A `null` value shows a pending state ("soon" or a dashed underline) instead of a broken link.

Status key: **Missing** = nothing supplied yet. **Candidate** = a suggested value is live, but Kamalesh has not confirmed it. **Confirmed** = verified.

## 1. Images and assets

| Placeholder | Status | What is shown now | What is needed |
|---|---|---|---|
| `{{PHOTO_PORTRAIT_CUTOUT}}` | Missing | Code-drawn silhouette (`assets/images/portrait-standin.svg`) | Portrait with a transparent background, high resolution, face centered, shoulders visible. Save as `assets/images/kamalesh-portrait-cutout.png` (or `.webp`) and set `PHOTO_PORTRAIT_CUTOUT.value`. |
| `{{PHOTO_PORTRAIT_FALLBACK}}` | Missing | Same silhouette | Optional. A normal photo (no cutout); it is shown inside a chamfered frame. Only used when no cutout exists. |
| `{{FAVICON}}` | Candidate | Code-drawn `KS` monogram (`assets/images/favicon.svg`) | Confirm the monogram, or supply `assets/images/favicon.ico` and update the `<link rel="icon">` in `index.html`. |
| `{{OG_IMAGE}}` | Missing | No share image | 1200 x 630 image at `assets/images/og-preview.png`, then add `<meta property="og:image" content="https://kamalesh-sudo.github.io/kamalesh-portfolio/assets/images/og-preview.png">` to `index.html` (social crawlers need an absolute URL). |

Tip: the split-face, X-ray, and seam effects use the image's transparency as a mask, so a clean cutout looks best.

## 2. Links

| Placeholder | Status | Current value | Note |
|---|---|---|---|
| `{{GITHUB_PROFILE_URL}}` | Candidate | `https://github.com/kamalesh-sudo` | Confirm. |
| `{{LINKEDIN_URL}}` | Candidate | `https://www.linkedin.com/in/kamalesh-s-260588305/` | Confirm. |
| `{{BUGCROWD_PROFILE_URL}}` | Candidate | `https://bugcrowd.com/h/kamalesh2428k` | Confirm. Used in the hero, footer, and Work card 2. |
| `{{LIVE_SITE_URL}}` | Candidate | `https://kamalesh-sudo.github.io/kamalesh-portfolio/` | Confirm the final hosting address. |
| `{{NEUROSPLOIT_REPO_URL}}` | Candidate | `https://github.com/kamalesh-sudo/neurosploit` | The old site linked `github.com/iharishragav/neurosploit`. Confirm which account owns it and that credit is accurate. |
| `{{BEHAVIORAL_AUTH_REPO_URL}}` | Candidate | `https://github.com/kamalesh-sudo/Behavioral_Auth_System` | Confirm. |
| `{{SATELLITE_REPO_URL}}` | Candidate | `https://github.com/kamalesh-sudo/Smooth-Visualization-of-Satellite-Imagery` | The old site linked the same repo name under `iharishragav`. Confirm. |
| `{{SEGMENTATION_REPO_URL}}` | Missing | (button shows "soon") | Old site linked `github.com/iharishragav/geo-wms-segmentation`, a different account. Not published until confirmed. |
| `{{BUG_REPORT_URL_1}}` | Missing | (link shows "soon") | Old site: clickjacking write-up at `github.com/iharishragav/Bughunting/blob/main/fusionauth.md`. Confirm ownership and whether the program allows public disclosure. |
| `{{BUG_REPORT_URL_2}}` | Missing | (link shows "soon") | Old site: report at `github.com/iharishragav/Bughunting/blob/main/thefork.md`. Same checks. |
| `{{EMAIL}}` | Missing | Email icon hidden in footer | Two different emails appear across his pages (the old site shows `Kamalesh.offical2004@gmail.com`). Publish only the one he picks. |
| `{{RESUME_URL}}` | Missing | Terminal `resume` says "coming soon" | Add a PDF (e.g. `assets/resume.pdf`) and set the value. |
| `{{CONTACT_FORM_ENDPOINT}}` | Confirmed | `https://formspree.io/f/mblyqqjz` | Reused from the current site's `index.html`. Also hard-coded in the form `action` in `index.html` so the form works without JavaScript; change both if it moves. |

**Account ownership flag:** several project and report links on the old site point to `github.com/iharishragav`, not Kamalesh's account. None of those links are published until confirmed.

## 3. Dates

| Placeholder | Config key | Where it shows | Shown now |
|---|---|---|---|
| `{{DATES}}` | `INTERN_DATES` | Work card 1 (Elevate Labs) | "2 months, dates to confirm" |
| `{{DATE}}` | `NEUROSPLOIT_DATE` | Work card 3 | "date to confirm" |
| `{{DATE}}` | `BEHAVIORAL_AUTH_DATE` | Work card 4 | "date to confirm" |

## 4. Content that needs a yes from Kamalesh

These are written only from the verified facts in `build-spec.md`, but the wording is a draft.

- **Hero sentence** (`index.html`, `.hero-line`): "Security researcher and final-year IT student who finds weaknesses in web applications and helps get them fixed."
- **Hero floating labels** (`heroLabels` in config): `BURP SUITE`, `LINUX`, `PYTHON`, `BUGCROWD`.
- **About blocks** (`index.html`, `#about`): the three short Who / What / Next paragraphs.
- **Stat chips** (`index.html`, `.stats`): `2` hackathons (Smart India Hackathon 2024, Rackathon 2025), `4` featured builds, researching since `2024`. These are counted from the verified list, not supplied numbers. Replace or remove if he prefers other figures. Do not add bounty counts, rankings, or acceptance numbers unless he confirms them.
- **Work card wording**: titles, one-line summaries, impact lines, chips, and the three detail lines per card. The old site claimed specific finding types for the internship (SQL injection, XSS, auth bypass); these were left out because the brief does not verify them.
- **Hackathon labels conflict**: the old site tagged the segmentation project "(SIH)" and a separate SmartWardrobe project "(Rackathon)", while the brief says segmentation was the Rackathon project. The site follows the brief. Confirm, and say whether SmartWardrobe should be one of the six cards.
- **Origin log lines** (`index.html`, `[data-origin-log]`): Enrolled 2022, Smart India Hackathon 2024, Rackathon 2025, Graduating 2026.
- **Bug report labels** inside Work card 2: "Write-up: clickjacking report" and "Write-up: vulnerability report".

## 5. Certifications

`certifications: []` in config. The site shows one "More in progress" tile. Add verified entries as `{ name, issuer, date, url }`. Courses or labs (e.g. TryHackMe rooms) should be listed only if he confirms they count as certifications.

## 6. Skill levels

Every chip in `skills` (config) ships as `working`. Kamalesh sets each one to `learning`, `working`, or `strong`. The chip list itself is the brief's suggestion; add, remove, or move chips there.

## 7. Content intentionally not carried over

Phone number, exact birthday, percentage skill bars, dead social links (`href="#"`), and the old stock template visuals. Location is shown at city and state level only.
