<div align="center">

```
███████╗████████╗ █████╗  ██████╗██╗  ██╗██╗  ██╗██╗   ██╗██████╗
██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝██║  ██║██║   ██║██╔══██╗
███████╗   ██║   ███████║██║     █████╔╝ ███████║██║   ██║██████╔╝
╚════██║   ██║   ██╔══██║██║     ██╔═██╗ ██╔══██║██║   ██║██╔══██╗
███████║   ██║   ██║  ██║╚██████╗██║  ██╗██║  ██║╚██████╔╝██████╔╝
╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝
```

**The central hub for Web3 developer tools and documentation.**

Discover, compare, and learn the best libraries, frameworks, and infrastructure for building on-chain.

---

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-black?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-black?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-black?style=flat-square&logo=supabase)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-black?style=flat-square)](./LICENSE)

[Live Demo](https://stackhub.dev) · [Submit a Tool](https://stackhub.dev/submit) · [Report a Bug](https://github.com/yourusername/stackhub/issues) · [Request a Feature](https://github.com/yourusername/stackhub/issues)

</div>

---

## Screenshots

> _Screenshots coming soon. Run locally to preview._

| Home | Browse Tools | Tool Detail |
|------|-------------|-------------|
| ![Home page placeholder](https://placehold.co/400x240/000000/FFFFFF?text=Home) | ![Browse tools placeholder](https://placehold.co/400x240/111111/FFFFFF?text=Browse+Tools) | ![Tool detail placeholder](https://placehold.co/400x240/1F1F1F/FFFFFF?text=Tool+Detail) |

---

## Features

- **Curated catalog** — hand-reviewed Web3 developer tools across 8 categories: DeFi, NFTs, Infrastructure, Smart Contracts, Wallets, Storage, Indexing, and Security
- **Live GitHub stars** — real-time star counts fetched from the GitHub API with a 5-minute in-memory cache, falling back gracefully to stored values
- **Full-text search** — instant client-side search across tool names, descriptions, categories, and tags
- **Filter + sort** — filter by category, sort by Most Stars / Recently Added / A–Z / Last Updated
- **Learning roadmaps** — curated step-by-step paths (Beginner → Advanced) linking to real tools in the catalog
- **Starter templates** — copy-paste scaffolds covering Full-Stack dApps, Smart Contracts, Indexing, and Solana
- **Community submissions** — anyone can submit a tool; it enters a pending queue for admin review before going live
- **Admin dashboard** — password-gated dashboard to approve or reject pending submissions
- **SEO-ready** — full Open Graph, Twitter cards, sitemap.xml, robots.txt, and canonical URLs
- **Zero color** — strictly black, white, and gray palette. No accent colors anywhere
- **Minimal UI** — Inter font, generous whitespace, thin borders, no shadows, no decorations

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org) (App Router, React 19) |
| Language | [TypeScript 5](https://www.typescriptlang.org) (strict) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Components | [shadcn/ui](https://ui.shadcn.com) (nova style, base-ui primitives) |
| Database | [Supabase](https://supabase.com) (PostgreSQL + Row Level Security) |
| Forms | [React Hook Form](https://react-hook-form.com) + [Zod v4](https://zod.dev) |
| Fonts | [Inter](https://rsms.me/inter/) via `next/font/google` |
| Deployment | [Vercel](https://vercel.com) |

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+ (or pnpm / yarn)
- A free [Supabase](https://supabase.com) project

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/stackhub.git
cd stackhub
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. In the Supabase dashboard, go to **SQL Editor**
3. Run the full schema from [`supabase/schema.sql`](./supabase/schema.sql)

   This creates the `tools` table, seeds 16 approved tools, and sets up Row Level Security policies.

### 4. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

Open `.env.local` and set:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> Your Supabase URL and anon key are in **Project Settings → API**.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 6. (Optional) Seed the database

The schema file already includes 16 seed tools. To add more, either:
- Use the `/submit` page UI (they'll be `pending` until approved via `/admin`)
- Insert rows directly in the Supabase Table Editor

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Your Supabase anon/public key |
| `NEXT_PUBLIC_SITE_URL` | No | Production URL — used for `metadataBase`, sitemap, and OG images. Defaults to `https://stackhub.dev` |

> **Note:** Both Supabase variables are prefixed with `NEXT_PUBLIC_` because the Supabase client runs in the browser as well as the server. They are **not** secret — your Supabase Row Level Security policies control what these keys can access.

---

## Project Structure

```
stackhub/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Home — hero + featured + recently added
│   ├── tools/
│   │   ├── page.tsx        # Browse all tools
│   │   └── [slug]/page.tsx # Tool detail (SSG)
│   ├── templates/page.tsx  # Starter templates
│   ├── roadmaps/page.tsx   # Learning roadmaps
│   ├── submit/page.tsx     # Submit a tool
│   ├── admin/page.tsx      # Admin dashboard (password-gated)
│   ├── about/page.tsx      # About page
│   ├── sitemap.ts          # /sitemap.xml
│   └── robots.ts           # /robots.txt
├── components/             # Reusable UI components
│   ├── ui/                 # shadcn base primitives
│   ├── navbar.tsx          # Responsive sticky header
│   ├── footer.tsx
│   ├── tool-card.tsx       # Tool card with live stars
│   ├── tool-browser.tsx    # Search + filter + sort + paginate
│   ├── admin-dashboard.tsx # Admin review UI
│   └── ...
├── hooks/                  # Custom React hooks
│   ├── use-live-stars.ts   # Live GitHub star count
│   └── use-search-focus.ts # "/" keyboard shortcut
├── lib/                    # Utilities and data helpers
│   ├── data.ts             # All Supabase fetch/mutate helpers
│   ├── github.ts           # GitHub stars API + cache
│   ├── supabase.ts         # Typed Supabase client
│   ├── types.ts            # Shared TypeScript types
│   └── utils.ts            # cn() and other utils
├── data/                   # Static fallback data
│   ├── tools.ts            # 16 seed tools (StaticToolData[])
│   ├── templates.ts        # 10 starter templates
│   └── roadmaps.ts         # 6 learning roadmaps
├── supabase/
│   └── schema.sql          # Full DB schema + seed data
└── public/
    ├── favicon.svg
    └── og-default.svg
```

---

## Deployment

### Deploy to Vercel (recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/stackhub)

1. Click the button above or import the repo manually at [vercel.com/new](https://vercel.com/new)
2. Add the three environment variables in the Vercel dashboard
3. Set `NEXT_PUBLIC_SITE_URL` to your production domain (e.g. `https://stackhub.dev`)
4. Deploy

### Deploy elsewhere

StackHub is a standard Next.js app. It works on any platform that supports Node.js:

```bash
npm run build
npm run start
```

Or export to static HTML (note: the admin dashboard requires a server since it reads `sessionStorage`):

```bash
# Not recommended — use a Node.js server to keep API routes working
```

---

## Contributing

Contributions are welcome and appreciated. Please read [`CONTRIBUTING.md`](./CONTRIBUTING.md) before opening a PR.

Quick guide:
1. **Fork** the repository
2. **Create a branch** — `git checkout -b feat/your-feature`
3. **Make your changes** — follow the code style guidelines in CONTRIBUTING.md
4. **Test** — run `npm run build` and confirm zero TypeScript errors
5. **Open a PR** — use the PR template and describe what you changed

---

## Adding a Tool

The fastest way to add a tool is through the live site at `/submit`. For bulk additions or if you want to contribute via code:

1. Add an entry to `data/tools.ts` following the `StaticToolData` type
2. Add a corresponding row in `supabase/schema.sql` if you're seeding a new deployment
3. Open a PR — see the [tool submission template](./.github/ISSUE_TEMPLATE/tool-submission.md)

---

## License

MIT — see [`LICENSE`](./LICENSE) for details.

---

<div align="center">

Built with care. No tracking. No ads. No color.

</div>
