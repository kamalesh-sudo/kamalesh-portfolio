/*
 * Single source of truth for every placeholder on the site.
 * Change a `value` here to swap it in everywhere. `null` means "not supplied yet":
 * the site shows a tasteful pending state instead of a broken link.
 * Status: "confirmed" | "candidate" (suggested, needs a yes) | "missing".
 * Every entry is mirrored in PLACEHOLDERS.md.
 */
window.KS_CONFIG = {
  placeholders: {
    PHOTO_PORTRAIT_CUTOUT: {
      value: null,
      status: 'missing',
      note: 'Transparent-background portrait, e.g. assets/images/kamalesh-portrait-cutout.png'
    },
    PHOTO_PORTRAIT_FALLBACK: {
      value: null,
      status: 'missing',
      note: 'Normal portrait shown in a chamfered frame, e.g. assets/images/kamalesh-portrait.jpg'
    },
    PORTRAIT_STANDIN: {
      value: 'assets/images/portrait-standin.svg',
      status: 'confirmed',
      note: 'Code-drawn silhouette used until a real photo is supplied'
    },
    FAVICON: { value: 'assets/images/favicon.svg', status: 'candidate', note: 'Code-drawn KS monogram; supply favicon.ico if preferred' },
    OG_IMAGE: { value: null, status: 'missing', note: '1200x630 share image, e.g. assets/images/og-preview.png' },

    GITHUB_PROFILE_URL: { value: 'https://github.com/kamalesh-sudo', status: 'candidate' },
    LINKEDIN_URL: { value: 'https://www.linkedin.com/in/kamalesh-s-260588305/', status: 'candidate' },
    BUGCROWD_PROFILE_URL: { value: 'https://bugcrowd.com/h/kamalesh2428k', status: 'candidate' },
    LIVE_SITE_URL: { value: 'https://kamalesh-sudo.github.io/kamalesh-portfolio/', status: 'candidate' },

    NEUROSPLOIT_REPO_URL: { value: 'https://github.com/kamalesh-sudo/neurosploit', status: 'candidate' },
    BEHAVIORAL_AUTH_REPO_URL: { value: 'https://github.com/kamalesh-sudo/Behavioral_Auth_System', status: 'candidate' },
    SATELLITE_REPO_URL: { value: 'https://github.com/kamalesh-sudo/Smooth-Visualization-of-Satellite-Imagery', status: 'candidate' },
    SEGMENTATION_REPO_URL: { value: 'https://github.com/kamalesh-sudo/geo-wms-segmentation', status: 'candidate', note: 'Old site linked github.com/iharishragav/geo-wms-segmentation (different account)' },
    BUG_REPORT_URL_1: { value: 'https://github.com/kamalesh-sudo/kamalesh-portfolio/blob/main/assets/report/fusionauth.md', status: 'candidate', note: 'Old site: clickjacking write-up under github.com/iharishragav' },
    BUG_REPORT_URL_2: { value: 'https://github.com/kamalesh-sudo/kamalesh-portfolio/blob/main/assets/report/thefork.md', status: 'candidate', note: 'Old site: second report under github.com/iharishragav' },

    EMAIL: { value: 'kamalesh.bluemailx.com', status: 'candidate', note: 'Two different emails appear across his pages; publish only the one he picks' },
    RESUME_URL: { value: 'https://github.com/kamalesh-sudo/kamalesh-portfolio/blob/main/assets/docs/Kamalesh-Cv.pdf', status: 'candidate', note: 'Terminal "resume" command shows "coming soon" until set' },
    CONTACT_FORM_ENDPOINT: { value: 'https://formspree.io/f/mblyqqjz', status: 'confirmed', note: 'Reused from the current site index.html' },

    INTERN_DATES: { value: '23 Jun 2025 to 28 Jul 2026', status: 'candidate', token: '{{DATES}}', note: 'Elevate Labs internship month/year range' },
    NEUROSPLOIT_DATE: { value: null, status: 'missing', token: '{{DATE}}' },
    BEHAVIORAL_AUTH_DATE: { value: null, status: 'missing', token: '{{DATE}}' }
  },

  /* Hero floating labels (user to confirm the final four). */
  heroLabels: ['BURP SUITE', 'LINUX', 'PYTHON', 'BUGCROWD'],

  /*
   * Verified certifications only. Each entry: { name, issuer, date, url }.
   * Leave empty to show a single "more in progress" tile.
   */
  certifications: [],

  /*
   * Skill chips and their level: "learning" | "working" | "strong".
   * Levels are unconfirmed; every chip ships as "working" until Kamalesh sets them.
   */
  skills: [
    { bay: 'Security', chips: [
      ['Burp Suite', 'working'], ['OWASP ZAP', 'working'], ['Nmap', 'working'],
      ['Wireshark', 'working'], ['Aircrack-ng', 'working'], ['Metasploit', 'working']
    ] },
    { bay: 'Systems and Linux', chips: [
      ['Arch Linux', 'working'], ['Kali', 'working'], ['Bash', 'working'], ['Hyprland', 'working']
    ] },
    { bay: 'Development', chips: [
      ['Python', 'working'], ['FastAPI', 'working'], ['REST APIs', 'working']
    ] },
    { bay: 'AI and Geospatial', chips: [
      ['Semantic segmentation', 'working'], ['Frame interpolation', 'working'], ['WMS and GeoServer', 'working']
    ] }
  ]
};
