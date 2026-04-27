# Contributing to StackHub

Thank you for taking the time to contribute. StackHub is a community-built catalog — every improvement, no matter how small, makes it more useful for Web3 developers worldwide.

---

## Table of Contents

- [Ways to Contribute](#ways-to-contribute)
- [Good First Issues](#good-first-issues)
- [Development Setup](#development-setup)
- [Code Style](#code-style)
- [Submitting a Tool via PR](#submitting-a-tool-via-pr)
- [Opening a Pull Request](#opening-a-pull-request)
- [Commit Messages](#commit-messages)

---

## Ways to Contribute

### Code
- Bug fixes
- New features (open an issue first to discuss)
- Performance improvements
- Accessibility improvements
- Test coverage

### Content
- Add a missing Web3 tool to the catalog
- Improve an existing tool's description or tags
- Write a new learning roadmap
- Add a starter template

### Quality
- Report inaccurate tool descriptions
- Flag broken links
- Report UI bugs
- Suggest better categorization

---

## Good First Issues

If you're new to the codebase, look for issues tagged [`good first issue`](https://github.com/yourusername/stackhub/labels/good%20first%20issue). Good starting points:

- Add a missing tool to `data/tools.ts`
- Fix a typo or improve a description
- Add a new learning roadmap in `data/roadmaps.ts`
- Improve the mobile layout of an existing page
- Add a missing `aria-label` for accessibility

---

## Development Setup

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/stackhub.git
cd stackhub

# 2. Install dependencies
npm install

# 3. Copy and fill in environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase URL and anon key

# 4. Run the dev server
npm run dev

# 5. Verify the build passes before submitting a PR
npm run build
```

The build **must pass with zero TypeScript errors** before a PR will be reviewed.

---

## Code Style

Keep it simple. The project has no Prettier config — just follow the patterns already in the codebase.

### TypeScript
- Strict mode is enabled — no `any` unless absolutely unavoidable (add a comment explaining why)
- Prefer `type` over `interface` for object shapes
- Always type function return values for exported functions
- Use `satisfies` for config objects when it helps inference

### React / Next.js
- Server Components by default — add `"use client"` only when you need browser APIs or interactivity
- Co-locate small helper components at the bottom of the file that uses them
- Keep pages thin — heavy logic goes in `lib/` helpers or dedicated components
- No `useEffect` for data fetching — use Server Components or React Query patterns

### CSS / Tailwind
- **Black, white, and gray only** — no accent colors, ever. The palette is: `#000000 #111111 #1F1F1F #333333 #666666 #999999 #CCCCCC #E5E5E5 #FFFFFF`
- Use the CSS variables (`text-foreground`, `text-muted-foreground`, `border-border`, `bg-secondary`, etc.) not raw hex values, except for hover states
- Prefer utility classes over custom CSS
- No shadows, no gradients, no decorative elements

### File Organization
- Pages live in `app/`
- Reusable components live in `components/`
- Custom hooks live in `hooks/`
- Supabase helpers live in `lib/data.ts` — pages never import the supabase client directly
- Static fallback data lives in `data/`

---

## Submitting a Tool via PR

To add a new tool to the catalog:

### Step 1 — Add static data

Open `data/tools.ts` and add an entry following the `StaticToolData` type:

```ts
{
  slug: "your-tool-slug",           // URL-safe, lowercase, hyphens only
  name: "Your Tool",
  description: "One sentence. What it does and who it's for.",
  category: "Smart Contracts",      // Must be a valid Category from lib/types.ts
  tags: ["solidity", "testing"],    // 3–6 lowercase tags
  starsRaw: 12400,                  // Approximate, will be updated by live API
  createdAt: "2024-01-01",
  links: {
    github: "https://github.com/org/repo",
    docs: "https://docs.yourtool.dev",
    npm: "https://npmjs.com/package/your-tool",   // optional
    website: "https://yourtool.dev",              // optional
  },
  longDescription: `
    2–4 sentence expanded description. Mention the key value prop,
    who made it, and what problem it solves.
  `,
  docsSummary: [
    { title: "Quick Start", excerpt: "Get running in 5 minutes.", url: "https://..." },
    { title: "API Reference", excerpt: "Full API docs.", url: "https://..." },
  ],
  quickstarts: [
    {
      title: "Install and configure",
      language: "bash",
      code: `npm install your-tool`,
    },
  ],
  relatedSlugs: ["hardhat", "foundry"],  // slugs of related tools in the catalog
}
```

### Step 2 — Add a Supabase seed row (optional)

If you want the tool to appear in a fresh database deployment, add an `INSERT` to `supabase/schema.sql` following the existing pattern.

### Step 3 — Open a PR

Use the [Tool Submission issue template](./.github/ISSUE_TEMPLATE/tool-submission.md) or open a PR directly with the title format:

```
feat(catalog): add <Tool Name>
```

---

## Opening a Pull Request

1. Make sure `npm run build` passes locally with zero errors
2. Fill out the [PR template](./.github/PULL_REQUEST_TEMPLATE.md)
3. Keep PRs focused — one feature or fix per PR
4. Link to any related issues with `Closes #123`

PRs that introduce color, shadows, or non-grayscale design elements will be asked to revert those changes.

---

## Commit Messages

Use the conventional commits format:

```
type(scope): short description

Optional longer description if needed.
```

Types: `feat` `fix` `docs` `style` `refactor` `chore`

Examples:
```
feat(catalog): add Tenderly tool entry
fix(admin): correct error state when Supabase is unreachable
docs: update README env variable table
chore: bump Next.js to 16.3.0
```

---

Thank you for contributing to StackHub.
