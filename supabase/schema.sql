1|-- =============================================================
-- StackHub — tools table schema + seed data
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- Safe to re-run: uses IF NOT EXISTS + ON CONFLICT DO UPDATE
-- =============================================================

-- ── 1. Schema ──────────────────────────────────────────────────

create extension if not exists "pgcrypto";

create table if not exists public.tools (
  id               uuid primary key default gen_random_uuid(),
  name             text        not null,
  slug             text        not null unique,
  description      text        not null,
  long_description text,
  category         text        not null,
  github_stars     integer,
  github_url       text,
  docs_url         text,
  npm_url          text,
  website_url      text,
  tags             text[],
  related_slugs    text[],
  featured         boolean     not null default false,
  status           text        not null default 'pending',
  created_at       timestamptz not null default now()
);

-- Index the columns we filter/order by
create index if not exists tools_category_idx on public.tools (category);
create index if not exists tools_featured_idx on public.tools (featured);
create index if not exists tools_slug_idx    on public.tools (slug);

-- Full-text search index over name + description
alter table public.tools
  add column if not exists fts tsvector
    generated always as (
      to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, ''))
    ) stored;

create index if not exists tools_fts_idx on public.tools using gin (fts);

-- Row-Level Security (read-only for anon)
alter table public.tools enable row level security;

drop policy if exists "Public read" on public.tools;
create policy "Public read"
  on public.tools for select
  using (true);

-- Allow anonymous inserts (submit form) — status defaults to 'pending'
drop policy if exists "Public insert" on public.tools;
create policy "Public insert"
  on public.tools for insert
  with check (status = 'pending');

-- ── 2. Seed data ───────────────────────────────────────────────
-- Idempotent: ON CONFLICT (slug) DO UPDATE keeps re-running safe.

insert into public.tools
  (name, slug, description, long_description, category, github_stars,
   github_url, docs_url, npm_url, website_url, tags, related_slugs, featured, status)
values

-- ── Smart Contracts ───────────────────────────────────────────
(
  'Foundry',
  'foundry',
  'Blazing fast Solidity toolkit for building, testing, and deploying smart contracts.',
  'Foundry is a Rust-based smart contract development toolchain. It is exceptionally fast, writes tests in Solidity (no JS indirection), and comes with world-class fuzzing and invariant testing out of the box. forge, cast, anvil, and chisel cover the entire contract development loop.',
  'Smart Contracts', 8900,
  'https://github.com/foundry-rs/foundry',
  'https://book.getfoundry.sh',
  null,
  'https://getfoundry.sh',
  array['Solidity','Rust','Fuzzing'],
  array['hardhat','slither','scaffold-eth-2','wagmi'],
  true,'approved'
),
(
  'Hardhat',
  'hardhat',
  'Flexible Ethereum development environment for professionals.',
  'Hardhat is a development environment for Ethereum that gives you a local network, a flexible task runner, and first-class TypeScript support. Its plugin ecosystem covers everything from verification (hardhat-verify) to gas reporting, coverage, and deploy pipelines.',
  'Smart Contracts', 7400,
  'https://github.com/NomicFoundation/hardhat',
  'https://hardhat.org/docs',
  'https://www.npmjs.com/package/hardhat',
  'https://hardhat.org',
  array['Solidity','Testing','Node'],
  array['foundry','wagmi','slither','scaffold-eth-2'],
  true,'approved'
),
(
  'OpenZeppelin Contracts',
  'openzeppelin-contracts',
  'Battle-tested, audited Solidity library for secure smart contract development.',
  'OpenZeppelin Contracts is the most widely used library in Solidity development. It provides reference implementations of ERC-20, ERC-721, ERC-1155, access control, governance, proxy patterns, and much more — all formally audited and actively maintained.',
  'Smart Contracts', 25100,
  'https://github.com/OpenZeppelin/openzeppelin-contracts',
  'https://docs.openzeppelin.com/contracts',
  'https://www.npmjs.com/package/@openzeppelin/contracts',
  'https://openzeppelin.com',
  array['Solidity','ERC-20','Security'],
  array['hardhat','foundry','slither','scaffold-eth-2'],
  true,'approved'
),
(
  'Anchor',
  'anchor',
  'The Solana smart contract framework — safe, fast, and ergonomic.',
  'Anchor is the dominant framework for writing Solana programs. It handles account validation, serialization, and error handling via macros, reducing boilerplate dramatically. TypeScript client generation is built in.',
  'Smart Contracts', 3800,
  'https://github.com/coral-xyz/anchor',
  'https://www.anchor-lang.com',
  null,
  'https://www.anchor-lang.com',
  array['Solana','Rust'],
  array['foundry','hardhat','openzeppelin-contracts'],
  false,'approved'
),

-- ── Frontend ──────────────────────────────────────────────────
(
  'wagmi',
  'wagmi',
  'React Hooks for Ethereum — connect wallets, sign, read, and write.',
  'wagmi is a collection of React Hooks containing everything you need to start working with Ethereum. It makes it easy to connect a wallet, display ENS and balance information, sign messages, interact with contracts, and much more — all with caching, request deduplication, and persistence built in. Built on top of viem.',
  'Frontend', 6100,
  'https://github.com/wevm/wagmi',
  'https://wagmi.sh',
  'https://www.npmjs.com/package/wagmi',
  'https://wagmi.sh',
  array['React','TypeScript','Wallet'],
  array['viem','thirdweb','rainbowkit','hardhat'],
  true,'approved'
),
(
  'viem',
  'viem',
  'Type-safe, lightweight TypeScript interface for Ethereum.',
  'viem is a TypeScript-first Ethereum library with a strong emphasis on type safety, tree-shakeability, and modern DX. It is the foundation many newer libraries (including wagmi) build on, and exposes a clean public/wallet client split that maps naturally to the JSON-RPC world.',
  'Frontend', 4200,
  'https://github.com/wevm/viem',
  'https://viem.sh',
  'https://www.npmjs.com/package/viem',
  null,
  array['TypeScript','RPC'],
  array['wagmi','thirdweb','hardhat','foundry'],
  true,'approved'
),
(
  'thirdweb',
  'thirdweb',
  'Full-stack Web3 development platform — SDKs, contracts, wallets, and infra.',
  'thirdweb is a complete Web3 development toolkit: a TypeScript/React SDK, audited contract templates, an embedded wallet, account abstraction, and a managed infrastructure layer for RPC, storage, and analytics.',
  'Frontend', 2100,
  'https://github.com/thirdweb-dev/js',
  'https://portal.thirdweb.com',
  'https://www.npmjs.com/package/thirdweb',
  'https://thirdweb.com',
  array['SDK','Contracts','Wallets'],
  array['wagmi','viem','hardhat','scaffold-eth-2'],
  true,'approved'
),
(
  'RainbowKit',
  'rainbowkit',
  'Beautiful, customizable wallet connection UI for React dApps.',
  'RainbowKit is the most polished wallet connection library in the React ecosystem. It ships a fully accessible ConnectButton, wallet switcher, and chain selector out of the box, and integrates cleanly with wagmi.',
  'Frontend', 4700,
  'https://github.com/rainbow-me/rainbowkit',
  'https://rainbowkit.com/docs',
  'https://www.npmjs.com/package/@rainbow-me/rainbowkit',
  'https://rainbowkit.com',
  array['React','Wallet UI'],
  array['wagmi','viem','thirdweb'],
  false,'approved'
),
(
  'ethers.js',
  'ethers-js',
  'Complete, compact, and battle-hardened Ethereum library for JavaScript.',
  'ethers.js is one of the original JavaScript Ethereum libraries, known for its clean API, excellent documentation, and long track record. v6 brought ESM-first packaging and TypeScript rework.',
  'Frontend', 7900,
  'https://github.com/ethers-io/ethers.js',
  'https://docs.ethers.org/v6',
  'https://www.npmjs.com/package/ethers',
  null,
  array['JavaScript','TypeScript','RPC'],
  array['viem','wagmi','hardhat'],
  false,'approved'
),

-- ── Backend & Indexing ────────────────────────────────────────
(
  'The Graph',
  'the-graph',
  'Decentralized indexing protocol for querying on-chain data with GraphQL.',
  'The Graph is an indexing protocol for querying networks like Ethereum. Developers build and publish open APIs, called subgraphs, that applications can query using GraphQL.',
  'Backend & Indexing', 3100,
  'https://github.com/graphprotocol/graph-node',
  'https://thegraph.com/docs',
  null,
  'https://thegraph.com',
  array['GraphQL','Indexing'],
  array['wagmi','viem','alchemy','ponder'],
  true,'approved'
),
(
  'Ponder',
  'ponder',
  'Open-source framework for building fast, type-safe blockchain indexers.',
  'Ponder is a Node.js framework for building custom blockchain indexers with a developer experience similar to modern web frameworks. You define event handlers in TypeScript, and Ponder handles reorgs, resyncing, and a local GraphQL API automatically.',
  'Backend & Indexing', 1600,
  'https://github.com/ponder-sh/ponder',
  'https://ponder.sh/docs',
  'https://www.npmjs.com/package/@ponder/core',
  'https://ponder.sh',
  array['TypeScript','GraphQL','Self-hosted'],
  array['the-graph','viem','wagmi'],
  false,'approved'
),

-- ── Infrastructure ────────────────────────────────────────────
(
  'Alchemy',
  'alchemy',
  'Web3 infrastructure, node APIs, and developer tooling at scale.',
  'Alchemy is the leading Web3 development platform, providing node infrastructure, enhanced APIs, and developer tools that power the majority of top dApps.',
  'Infrastructure', 1200,
  null,
  'https://docs.alchemy.com',
  null,
  'https://alchemy.com',
  array['RPC','Node','Analytics'],
  array['the-graph','viem','wagmi','quicknode'],
  true,'approved'
),
(
  'QuickNode',
  'quicknode',
  'Multi-chain node infrastructure with global low-latency endpoints.',
  'QuickNode provides hosted blockchain node infrastructure across 30+ chains including Ethereum, Solana, Base, Arbitrum, and more. It offers dedicated endpoints, streaming data, NFT and token APIs.',
  'Infrastructure', 800,
  'https://github.com/quiknode-labs',
  'https://www.quicknode.com/docs',
  null,
  'https://www.quicknode.com',
  array['RPC','Multi-chain','Streaming'],
  array['alchemy','the-graph','viem'],
  false,'approved'
),

-- ── Security ─────────────────────────────────────────────────
(
  'Slither',
  'slither',
  'Static analysis framework for finding vulnerabilities in Solidity.',
  'Slither is a Solidity static analysis framework written in Python. It runs a suite of vulnerability detectors, prints visual information about contract details, and provides an API to write custom analyses.',
  'Security', 5300,
  'https://github.com/crytic/slither',
  'https://github.com/crytic/slither/wiki',
  null,
  null,
  array['Static analysis','Python'],
  array['foundry','hardhat'],
  true,'approved'
),

-- ── Testing & Deployment ──────────────────────────────────────
(
  'Tenderly',
  'tenderly',
  'Smart contract debugging, simulation, and monitoring platform.',
  'Tenderly is a developer platform centered on visibility into smart contract execution. The debugger steps through transactions with full stack traces and state diffs. Virtual TestNets give teams a shared staging environment.',
  'Testing & Deployment', 600,
  'https://github.com/Tenderly',
  'https://docs.tenderly.co',
  null,
  'https://tenderly.co',
  array['Debugging','Simulation','Monitoring'],
  array['hardhat','foundry','slither'],
  false,'approved'
),

-- ── Templates ─────────────────────────────────────────────────
(
  'Scaffold-ETH 2',
  'scaffold-eth-2',
  'Open-source toolkit to build decentralized apps on Ethereum quickly.',
  'Scaffold-ETH 2 is an open-source toolkit for building dApps on Ethereum. It comes with a Next.js frontend, Hardhat development environment, and wagmi hooks pre-wired, so you can go from zero to a working dApp in minutes.',
  'Templates', 2400,
  'https://github.com/scaffold-eth/scaffold-eth-2',
  'https://docs.scaffoldeth.io',
  null,
  'https://scaffoldeth.io',
  array['Starter','Monorepo'],
  array['wagmi','hardhat','viem','foundry'],
  true,'approved'
)

on conflict (slug) do update set
  name             = excluded.name,
  description      = excluded.description,
  long_description = excluded.long_description,
  category         = excluded.category,
  github_stars     = excluded.github_stars,
  github_url       = excluded.github_url,
  docs_url         = excluded.docs_url,
  npm_url          = excluded.npm_url,
  website_url      = excluded.website_url,
  tags             = excluded.tags,
  related_slugs    = excluded.related_slugs,
  featured         = excluded.featured,
  status           = excluded.status;
