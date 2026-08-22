# KEMBALI

> **Giving pre-loved items a second chance through community action.**

KEMBALI (**Kolaborasi Ekonomi Masyarakat Berbasis Lingkungan**) is a web platform that brings individuals, communities, small businesses, and waste banks together through a circular-economy ecosystem.

<p align="left">
  <a href="https://kembali-donasi.vercel.app/"><strong>Live Demo</strong></a>
  ·
  <a href="https://github.com/ozzie5555/ngoding-sama-wisnu-dan-3anomali"><strong>Repository</strong></a>
</p>

## About

KEMBALI is designed to help people sell, exchange, donate, repair, and recycle items that still have practical or economic value. Instead of treating used goods as waste, the platform provides a more organized way to put them back into circulation through community partners and verified organizations.

The project responds to two connected challenges: the growing amount of household waste and the difficulty communities face when looking for usable goods. KEMBALI addresses both through a structured donation flow, verified community information, item-photo verification, donation tracking, and impact-oriented communication.

The platform is intended for donors, community partners, waste banks, small businesses, and administrators. Its goal is to make responsible reuse easier to understand and easier to practice, while giving each party the information needed to participate in the process.

## Features

- **Verified community discovery** — Browse partner communities, their locations, descriptions, and current needs.
- **Donation submission** — Submit reusable goods or upcycled work with item details, a pickup address, and verification photos.
- **Donation tracking** — Follow each submission through verification, pickup, shipping, and receipt by the partner community.
- **Donation activity and history** — Review active submissions, completed donations, recipient communities, and status details from the user profile.
- **Profile and privacy settings** — Manage account information, profile photo, general location, contribution visibility, impact reporting, and donation history preferences.
- **Account authentication** — Sign in with email or username, use Google OAuth, recover a password, complete a profile, and pass Cloudflare Turnstile verification.
- **Community live chat** — Logged-in users can participate in community conversations, reply to messages, copy or edit their own messages, and send image attachments.
- **Donor leaderboard** — Display donor contributions based on non-cancelled donations while respecting each user's contribution-visibility setting.
- **Admin and manager dashboard** — Review submissions, inspect item photos, assign or release tasks, update donation statuses, and monitor activity.
- **Testimonial moderation** — Donors can submit feedback after a donation is received, while administrators decide which testimonials appear on the homepage.
- **Responsive interface** — The layout adapts to desktop, tablet, and mobile screens with touch-friendly controls, compact card rails, and adaptive navigation.

## Design and User Experience

The interface uses a clean and approachable visual system based on the project's environmental theme. Green tones communicate sustainability and growth, while rounded cards, soft shadows, illustrations, and consistent spacing keep the content easy to scan.

The experience is built around clear feedback and predictable actions. Important operations provide loading states, validation messages, confirmation dialogs, success animations, and visible donation statuses. The same interaction principles are carried across desktop and mobile layouts so that the main flow remains familiar on different screen sizes.

## Core Donation Flow

The primary flow is intentionally straightforward:

1. Explore verified communities and their current needs.
2. Sign in or create a KEMBALI account.
3. Complete the profile and location information needed for coordination.
4. Submit the donation details, pickup address, and item photos.
5. Let the community or administrator review and process the submission.
6. Track pickup, shipping, and receipt status from the donation activity page.
7. Submit feedback after the item has been received.

## User Flow

```text
+------------------+
|    Landing Page  |
+--------+---------+
         |
         +--> Explore communities and needs
         |          |
         |          +--> Donation form
         |
         +--> Authentication
                    |
                    +--> Complete profile
                    +--> Donation activity and tracking
                    +--> Profile, privacy, and security
                    +--> Community live chat

Admin / Community Manager
         |
         +--> Monitor donation queue
         +--> Verify items and photos
         +--> Assign work and update statuses
         +--> Moderate user testimonials
```

## Technology Stack

| Category | Technology |
| --- | --- |
| Frontend | React 19 and Vite |
| Routing | React Router 7 |
| Styling | Responsive CSS and SVG assets |
| Backend services | Supabase Auth, Edge Functions, Storage, and Realtime |
| Database | PostgreSQL through Supabase |
| Security | Row Level Security (RLS) and Cloudflare Turnstile |
| Deployment | Vercel |

## Project Structure

```text
project/
├── public/                 # Logos, illustrations, icons, and public assets
├── src/
│   ├── components/         # Shared UI, profile, donation, and admin components
│   ├── context/            # Authentication and application state
│   ├── features/auth/      # Sign in, sign up, password reset, and auth services
│   ├── lib/                # Supabase client and shared utilities
│   └── pages/              # Home, donation, community, insight, profile, and admin pages
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
- A Supabase project for backend services

### Installation

```bash
git clone https://github.com/ozzie5555/ngoding-sama-wisnu-dan-3anomali.git
cd ngoding-sama-wisnu-dan-3anomali
npm install
```

### Environment Variables

Create a local environment file from the provided example:

```bash
cp .env.example .env.local
```

Set the following frontend variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
VITE_TURNSTILE_SITE_KEY=your_cloudflare_turnstile_site_key
VITE_ENABLE_DEMO_OTP=true
```

`VITE_ENABLE_DEMO_OTP=true` is included for the competition demonstration flow while a production WhatsApp OTP provider is not configured. The demonstration code is `1234`. Do not commit `.env.local`, service-role keys, database passwords, Turnstile secret keys, or any other private credentials.

### Run Locally

```bash
npm run dev
```

The application runs at:

```text
http://localhost:5173
```

Before submitting changes, run the available checks:

```bash
npm run lint
npm run build
```

## Deployment

The production application is deployed to Vercel using the Vite build configuration.

- **Live website:** https://kembali-donasi.vercel.app/
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Node.js version:** `22.x`

The `VITE_*` variables must be added to the Vercel Project Settings for both Preview and Production environments. Supabase Auth redirect URLs and the Cloudflare Turnstile hostname must also include the production domain.

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
- **Team:** Wisnu_bersama_3_anomali

## Future Improvements

- Connect WhatsApp OTP to a production messaging provider such as Twilio.
- Add direct community, needs, and article management to the administrator dashboard.
- Provide more detailed impact analytics and downloadable donation reports.
- Expand automated testing for realtime donation updates, live chat, and role-based access.
- Extend the partner network to include more waste banks, small businesses, and community organizations.

## License

This project was created by the KEMBALI team for **SATU CREANOVA 2026 — Web Development**.
