# KEMBALI

> **Give pre-loved items a second chance. Create real impact together.**

KEMBALI is a circular-donation platform that connects people with reusable items to verified communities that need them.

<p align="left">
  <a href="https://kembali-donasi.vercel.app/"><strong>Live Demo</strong></a>
  ·
  <a href="https://github.com/ozzie5555/ngoding-sama-wisnu-dan-3anomali"><strong>Repository</strong></a>
</p>

![KEMBALI homepage preview](https://raw.githubusercontent.com/ozzie5555/ngoding-sama-wisnu-dan-3anomali/main/ekspor/Landing%20Page%20%2B%20Homepage.png)

## About

KEMBALI was built as a web platform for donating reusable goods and upcycled work to communities and organizations that need them. The platform brings together donors, verified community partners, and administrators in one clear donation journey—from discovering a community and submitting an item, to status tracking and delivery confirmation.

The project addresses a simple but important problem: many usable items are discarded because donors do not know where to send them, while communities often struggle to find the resources they need. KEMBALI offers a structured and transparent alternative through verified partners, item-photo verification, donation status updates, and impact-oriented information.

The primary users are individuals who want to donate, community partners who receive and manage donations, and administrators who verify submissions and monitor the donation lifecycle. The experience is designed to stay approachable for first-time users while providing the operational tools needed for a reliable donation process.

## Features

- **Community discovery** — Explore verified communities, their locations, descriptions, and current needs.
- **Donation submission** — Submit reusable goods or upcycled work with item details, pickup address, and verification photos.
- **Donation tracking** — Follow the journey of a donation through pending, verification, pickup, shipping, and received stages.
- **Profile & privacy controls** — Manage personal information, avatar, location visibility, contribution visibility, impact reporting, and donation history.
- **Authentication** — Email/password, username login, Google OAuth, password recovery, Cloudflare Turnstile, and profile completion flow.
- **Realtime community chat** — Communicate with community members and view the current top-donor leaderboard.
- **Admin monitoring** — Review donation submissions, assign staff, update statuses, inspect item photos, and moderate user testimonials.
- **Impact testimonials** — Donors can submit a review after a donation is received; approved testimonials can appear on the homepage.
- **Responsive Design** — A mobile-first experience with adaptive navigation, compact card rails, touch-friendly controls, and responsive layouts for desktop and mobile screens.

## Design & Experience

The interface follows a clean, warm, and approachable visual language inspired by the idea of reuse and community care. Soft green tones, generous spacing, rounded cards, and clear status indicators create a calm experience without hiding important actions.

Design decisions focus on accessibility, clarity, feedback, and consistent interaction patterns. Loading states, success checkmark animations, validation messages, modal confirmations, and realtime updates help users understand what is happening at each step.

## Preview

### Homepage

![Homepage](https://raw.githubusercontent.com/ozzie5555/ngoding-sama-wisnu-dan-3anomali/main/ekspor/Landing%20Page%20%2B%20Homepage.png)

### Donation page

![Donation page](https://raw.githubusercontent.com/ozzie5555/ngoding-sama-wisnu-dan-3anomali/main/ekspor/Donasi.png)

### Main feature

The main feature is the end-to-end donation flow:

1. Discover a verified community and its needs.
2. Sign in or create an account.
3. Submit the item, pickup address, and verification photos.
4. Track the donation status from the profile or donation page.
5. Receive the item through the partner community.
6. Share feedback after the donation is received.

## User Flow

```text
Landing Page
    │
    ├── Explore communities and needs
    │       │
    │       └── Donation form
    │
    └── Authentication
            │
            ├── Complete profile
            ├── Donation activity & tracking
            ├── Profile, privacy & security
            └── Community chat

Admin / Manager
    │
    ├── Monitor donation queue
    ├── Verify item submissions
    ├── Assign and update donation status
    └── Moderate testimonials
```

## Tech Stack

| Category | Technology |
| --- | --- |
| Frontend | React 19 + Vite |
| Routing | React Router 7 |
| Styling | CSS, responsive CSS, SVG assets |
| Backend | Supabase Auth, Edge Functions, Storage, Realtime |
| Database | PostgreSQL through Supabase |
| Security | Row Level Security (RLS) + Cloudflare Turnstile |
| Deployment | Vercel |

## Project Structure

```text
project/
├── public/                 # Logos, illustrations, icons, and public assets
├── src/
│   ├── components/         # Shared UI and profile/admin components
│   ├── context/            # Authentication and application context
│   ├── features/auth/      # Login, signup, reset password, and auth services
│   ├── lib/                # Supabase client and shared utilities
│   └── pages/              # Homepage, donation, community, insight, profile, admin
├── supabase/
│   ├── functions/          # Supabase Edge Functions
│   └── migrations/         # Database schema, policies, RPCs, and realtime setup
├── ekspor/                 # Design exports and visual references
├── backend.md              # Backend architecture and implementation notes
├── userflow.md             # Product and user-flow documentation
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 22.x
- npm
- Git
- A Supabase project for backend features

### Installation

```bash
git clone https://github.com/ozzie5555/ngoding-sama-wisnu-dan-3anomali.git
cd ngoding-sama-wisnu-dan-3anomali
npm install
```

### Environment Variables

Create a `.env.local` file from the example:

```bash
cp .env.example .env.local
```

Configure the required frontend variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
VITE_TURNSTILE_SITE_KEY=your_cloudflare_turnstile_site_key
VITE_ENABLE_DEMO_OTP=true
```

`VITE_ENABLE_DEMO_OTP=true` is intended for the competition demonstration flow while a production WhatsApp OTP provider is not configured. The demo code is `1234`. Never commit `.env.local`, service-role keys, database passwords, Turnstile secret keys, or other private credentials.

### Run Locally

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

Useful quality checks:

```bash
npm run lint
npm run build
```

## Deployment

The production deployment uses Vercel with Vite:

- **Live Website:** https://kembali-donasi.vercel.app/
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Node.js:** `22.x`

Add the same `VITE_*` variables in Vercel Project Settings for Preview and Production environments. Supabase Auth redirect URLs and the Cloudflare Turnstile hostname must include the deployed domain.

## Team

| Member | Role |
| --- | --- |
| Hanin | UI/UX Designer |
| Elok | UI/UX Designer · Frontend Developer |
| Wisnu | Frontend Developer |
| Krisna | Frontend Developer · Backend Developer |

## Competition

- **Competition:** SATU CREANOVA
- **Year:** 2026
- **Category:** Web Development

## Future Improvements

- Connect WhatsApp OTP to a production messaging provider such as Twilio.
- Expand community and article management tools for administrators and community managers.
- Add richer impact analytics and downloadable donation reports.
- Strengthen automated end-to-end testing for realtime status updates, chat, and role-based access.

## License

This project was created by the KEMBALI team as part of **SATU CREANOVA 2026 — Web Development**.
