/* Everything the page knows about my projects lives here, so the map, the tiles, the project viewer and the
   quick-jump menu all read the same facts. Only things that are true go in. */
window.VK = window.VK || {};

VK.EMAIL = 'vickemboi45@gmail.com';

/* status: the plain truth about where each one stands. Colours are used for the tile and the viewer. */
VK.PROJECTS = [
  {
    id: 'dreampath',
    name: 'DreamPath Travel',
    kind: 'Web app',
    status: 'Diploma project',
    year: '2026',
    bg: '#0F2D3A', fg: '#F2F7F6', accent: '#FF5C7A',
    blurb: 'Friends save for a trip together. The app works out each share and drops anyone who misses the deposit deadline.',
    stack: 'Node.js, Express, PostgreSQL, React, Vite, Socket.IO, Leaflet, Jest',
    story: [
      'This is my Diploma in IT research project at Kabarak University. Group trips usually fall apart the same way: everyone says they are coming, a few pay, and the organiser ends up chasing people. DreamPath puts the rules in the software instead.',
      'A group sets a trip goal and a deposit deadline. Each person pays toward their share. When the deadline passes, anyone who has not paid is removed, partial payments are refunded, and the share is recalculated for the people who stayed.'
    ],
    facts: [
      'Shares use one rule: the total is the shared costs plus the per-person costs for everyone in, plus a safety buffer, split evenly and rounded up to the next shilling.',
      'Every deposit, refund and booking goes into a ledger that cannot be edited afterwards.',
      'A map of 11 real Kenyan places works out distance and drive time between stops, and warns when two stops are too close together for the drive between them.',
      'M-Pesa payments run in simulation mode for the demo, so no real money moves.',
      '59 automated tests, 11 database tables, and a live group page that updates for everyone through Socket.IO.'
    ],
    quota: true,
    shots: [
      { src: 'img/dreampath-rule.webp', alt: 'The deadline demo in DreamPath: six friends, three of them unpaid, and the share rising from KES 14,175 to KES 18,375 once the deadline runs.', cap: 'The deadline rule, shown with the real sharing maths.' },
      { src: 'img/dreampath-route.webp', alt: 'DreamPath’s map of Kenya with a safari route drawn from Maasai Mara through Amboseli to the Taita Hills.', cap: 'The route planner. Pick places on the map and it adds up the distance and the drive.' }
    ],
    links: []
  },
  {
    id: 'dawatrack',
    name: 'DawaTrack',
    kind: 'Web app and Android app',
    status: 'Ready for client demos',
    year: '2026',
    bg: '#0E3B2E', fg: '#EEF7F1', accent: '#7DE0A6',
    blurb: 'Stock and profit management for a pharmacy, on the web and as an offline-first Android app.',
    stack: 'Node.js, Express, EJS, MySQL, Kotlin, Jetpack Compose, Room, M-Pesa Daraja',
    story: [
      'DawaTrack helps a pharmacy see what is in stock and what it actually earns. I built the web version through five major versions, then ported the whole thing to Android so it keeps working without internet.'
    ],
    facts: [
      'M-Pesa STK Push for payments, plus a bank payment option.',
      'Owner and seller roles, so a seller sees only what they should.',
      'Cash shift accountability: each shift is opened and closed against the cash that should be there.',
      'Weighted average cost pricing, so profit is worked out from what the stock really cost.',
      'The web version is deployed from GitHub to Render with the database on Aiven. The Android version stores data on the phone with Room and replicates the core business rules.'
    ],
    links: []
  },
  {
    id: 'vivet',
    name: 'Vivet Hotel Management System',
    kind: 'Web app',
    status: 'In progress',
    year: '2026',
    bg: '#3A2A1A', fg: '#F7EEE0', accent: '#E8B45C',
    blurb: 'A hotel management system with a guest website and a back office, built to a written project proposal.',
    stack: 'Full-stack web',
    story: [
      'I am building this one end to end: the guest-facing website and the back office that runs the hotel. It follows a written project proposal for a hotel in Nakuru, and I am making the guest site as interactive as I can.'
    ],
    facts: [
      'Guest site and back office, built together as one system.',
      'Work in progress, so there is nothing public to open yet.'
    ],
    links: []
  },
  {
    id: 'stfrancis',
    name: 'St Francis Girls’ High School, Suwerwa',
    kind: 'Website',
    status: 'Live',
    year: '2026',
    bg: '#6B1212', fg: '#FBF3E6', accent: '#E2C06A',
    blurb: 'The school’s website, with a dashboard so the school can update its own pages.',
    stack: 'HTML, CSS, JavaScript, Netlify',
    story: [
      'A multi-page website for a girls’ boarding school in Cherangany, Trans Nzoia. We built it as a group project, and the colours come from the school’s own signage boards: black, gold, blue and the crest’s navy and red.',
      'The school can change its own content from a dashboard, from any device, without touching code.'
    ],
    facts: [
      'Principals, board chairpersons, motto, mission, vision and ten core values taken from the school’s boards.',
      'A KCSE results table for 2013 to 2024.',
      'Admission information written for the CBC system: Grade 10 placement and the senior school pathways.',
      'Runs from plain files, so it opens even when double-clicked.'
    ],
    links: [{ label: 'Open the live site', href: 'https://stfrancissuwerwa.netlify.app' }]
  },
  {
    id: 'nakurunest',
    name: 'NakuruNest',
    kind: 'Website',
    status: 'Demo',
    year: '2026',
    bg: '#2D6A4F', fg: '#F4FBF6', accent: '#FDBA74',
    blurb: 'A bed and breakfast booking platform for Nakuru, with listings, search and host sign-up.',
    stack: 'HTML, CSS, JavaScript',
    story: [
      'NakuruNest is a booking platform for B&Bs in Nakuru. Guests can search properties and browse destinations, and hosts can sign up to list a place.'
    ],
    facts: [
      'Property listings with search and destination pages.',
      'A host sign-up flow.',
      'It still needs live hosting and photos from Nakuru itself.'
    ],
    preview: { src: 'projects/nakuru-nest/index.html', title: 'Live preview of NakuruNest' },
    links: [{ label: 'Open the demo', href: 'projects/nakuru-nest/index.html' }]
  },
  {
    id: 'kmtc',
    name: 'KMTC Nakuru website',
    kind: 'Website',
    status: 'Demo',
    year: '2026',
    bg: '#003D73', fg: '#F2F8FD', accent: '#8FD0FF',
    blurb: 'A college portal: programmes, admissions, news and contact, with a hero slider and animated numbers.',
    stack: 'HTML, CSS, JavaScript',
    story: [
      'A portfolio build of a college website for Kenya Medical Training College, Nakuru. It is a demo of what a college portal could be, not the official KMTC site.'
    ],
    facts: [
      'Programmes, admissions, news and contact pages.',
      'A hero slider and animated statistics.'
    ],
    preview: { src: 'projects/nakuru-kmtc/index.html', title: 'Live preview of the KMTC Nakuru website' },
    links: [{ label: 'Open the demo', href: 'projects/nakuru-kmtc/index.html' }]
  },
  {
    id: 'pos',
    name: 'Liquor POS',
    kind: 'Web app',
    status: 'Deployed for a client',
    year: '2026',
    bg: '#2B2250', fg: '#F2EFFA', accent: '#B9A6FF',
    blurb: 'A point-of-sale system for a client, running on Netlify with a hosted SQLite database.',
    stack: 'JavaScript, Netlify Functions, Turso (libSQL)',
    story: [
      'A point-of-sale system I built for a client. The pages are served by Netlify, the logic runs in Netlify serverless functions, and the data lives in Turso, a hosted SQLite database.',
      'I am planning to hand it over to the customer.'
    ],
    facts: [
      'Serverless functions read their database address and key from environment variables, so no secrets sit in the code.',
      'Private to the client, so there is no public link.'
    ],
    links: []
  },
  {
    id: 'mergegame',
    name: 'MergeGame',
    kind: 'Android app',
    status: 'In development',
    year: '2026',
    bg: '#4A2A6B', fg: '#F7F0FB', accent: '#FFB84D',
    blurb: 'A merge puzzle game for Android, planned for a global audience.',
    stack: 'Kotlin, Jetpack Compose',
    story: [
      'A merge puzzle game for Android written in Kotlin with Jetpack Compose. I built it with ways to earn from it planned in from the start.'
    ],
    facts: [
      'Native Android, no game engine.',
      'Monetisation hooks planned.'
    ],
    links: []
  }
];

/* Places on the map. Positions are real latitudes and longitudes; Suwerwa is placed at the Cherangany area, so it is approximate. */
VK.NAKURU = { lat: -0.3031, lng: 36.08 };
VK.SUWERWA = { lat: 1.09, lng: 35.14 };
/* Projects that live in Nakuru town. On the map they sit in a ring around the town marker. */
VK.NAKURU_RING = ['nakurunest', 'kmtc', 'vivet'];
/* The places DreamPath already knows (copied from the app's own place list). */
VK.DREAM_PLACES = [
  ['Lake Nakuru', -0.3667, 36.0833], ['Hell’s Gate', -0.9, 36.317], ['Menengai', -0.2, 36.07], ['Lake Naivasha', -0.7716, 36.3636],
  ['Maasai Mara', -1.4061, 35.1], ['Mount Kenya', -0.1521, 37.3084], ['Diani', -4.2797, 39.5947], ['Lamu', -2.2717, 40.902],
  ['Amboseli', -2.6527, 37.2606], ['Taita Hills', -3.4, 38.35], ['Samburu', 0.57, 37.55]
];
/* The order of the DreamPath route drawn on the map. */
VK.DREAM_ROUTE = ['Lake Nakuru', 'Lake Naivasha', 'Maasai Mara', 'Amboseli', 'Taita Hills', 'Diani', 'Lamu', 'Samburu', 'Mount Kenya'];

/* Where the camera goes for each step of the story: centre (lat, lng) and zoom (1 = the whole country). */
VK.CAMERA = [
  { lat: 0.2, lng: 37.9, k: 1 },
  { lat: -0.3031, lng: 36.08, k: 6.5 },
  { lat: -0.3031, lng: 36.08, k: 11 },
  { lat: 1.09, lng: 35.14, k: 8 },
  { lat: 0.2, lng: 37.9, k: 1 }
];

VK.CONTACT = {
  github: 'https://github.com/vick45-dot',
  fiverr: 'https://www.fiverr.com/vict0r_build',
  whatsapp: 'https://wa.me/254757593161'
};
