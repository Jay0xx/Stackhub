/**
 * data/templates.ts
 * Static seed data for the /templates page.
 * Each template has a deploy URL (Vercel, thirdweb, Railway, etc.) and
 * a GitHub link so visitors can jump straight to deploying or inspecting.
 */

export type TemplateCategory =
  | "All"
  | "Full-Stack"
  | "Smart Contracts"
  | "Frontend Only"
  | "Solana"
  | "Base"
  | "Indexing";

export interface Template {
  slug: string;
  name: string;
  description: string;
  /** Primary grouping shown in the filter bar. */
  category: Exclude<TemplateCategory, "All">;
  /** Tech stack chips — kept short. */
  stack: string[];
  githubUrl: string;
  /** One-click deploy URL. null = no deploy button (browse-only). */
  deployUrl: string | null;
  /** Optional platform label shown next to the deploy button. */
  deployLabel?: string;
}

export const templates: Template[] = [
  // ── Full-Stack ────────────────────────────────────────────────────────────
  {
    slug: "nextjs-wagmi-base",
    name: "Next.js + wagmi + Base",
    description:
      "Production-ready dApp starter on Base. Includes wallet connection, contract reads/writes, and Tailwind styling out of the box.",
    category: "Base",
    stack: ["Next.js", "wagmi", "viem", "Base", "Tailwind"],
    githubUrl: "https://github.com/base-org/web/tree/master/templates/next-wagmi",
    deployUrl: "https://vercel.com/new/clone?repository-url=https://github.com/base-org/web/tree/master/templates/next-wagmi",
    deployLabel: "Vercel",
  },
  {
    slug: "nextjs-thirdweb-dapp",
    name: "Next.js + thirdweb Full dApp",
    description:
      "Full-stack dApp with thirdweb SDK, embedded wallet, smart contracts, and NFT minting — deployable in one click.",
    category: "Full-Stack",
    stack: ["Next.js", "thirdweb", "TypeScript", "Tailwind"],
    githubUrl: "https://github.com/thirdweb-example/next-starter",
    deployUrl: "https://thirdweb.com/templates/next-starter",
    deployLabel: "thirdweb",
  },
  {
    slug: "rainbowkit-wagmi-starter",
    name: "RainbowKit + wagmi Starter",
    description:
      "Minimal wallet connection starter using RainbowKit's ConnectButton wired to wagmi. Everything configured, nothing extra.",
    category: "Frontend Only",
    stack: ["Next.js", "RainbowKit", "wagmi", "viem"],
    githubUrl: "https://github.com/rainbow-me/rainbowkit/tree/main/examples/with-next-app",
    deployUrl: "https://vercel.com/new/clone?repository-url=https://github.com/rainbow-me/rainbowkit/tree/main/examples/with-next-app",
    deployLabel: "Vercel",
  },
  {
    slug: "scaffold-eth-2",
    name: "Scaffold-ETH 2",
    description:
      "Batteries-included monorepo with Next.js, Hardhat, and wagmi pre-wired. The fastest way from idea to working dApp.",
    category: "Full-Stack",
    stack: ["Next.js", "Hardhat", "wagmi", "TypeScript"],
    githubUrl: "https://github.com/scaffold-eth/scaffold-eth-2",
    deployUrl: "https://vercel.com/new/clone?repository-url=https://github.com/scaffold-eth/scaffold-eth-2",
    deployLabel: "Vercel",
  },
  {
    slug: "the-graph-nextjs-starter",
    name: "The Graph + Next.js Indexer",
    description:
      "Query on-chain data from a deployed subgraph inside a Next.js app. Apollo Client configured, typed queries included.",
    category: "Indexing",
    stack: ["Next.js", "The Graph", "GraphQL", "Apollo"],
    githubUrl: "https://github.com/graphprotocol/graph-tooling/tree/main/examples/with-next",
    deployUrl: "https://vercel.com/new/clone?repository-url=https://github.com/graphprotocol/graph-tooling/tree/main/examples/with-next",
    deployLabel: "Vercel",
  },

  // ── Smart Contracts ───────────────────────────────────────────────────────
  {
    slug: "hardhat-foundry-starter",
    name: "Hardhat + Foundry Dual Setup",
    description:
      "Write and compile contracts with Hardhat, fuzz-test them with Foundry forge. Both toolchains share the same Solidity source.",
    category: "Smart Contracts",
    stack: ["Hardhat", "Foundry", "Solidity", "TypeScript"],
    githubUrl: "https://github.com/nomicfoundation/hardhat-foundry-template",
    deployUrl: null,
  },
  {
    slug: "openzeppelin-upgradeable",
    name: "OpenZeppelin Upgradeable Contracts",
    description:
      "UUPS proxy template with OpenZeppelin upgradeable contracts, Hardhat deploy scripts, and a full upgrade test suite.",
    category: "Smart Contracts",
    stack: ["Solidity", "OpenZeppelin", "Hardhat", "UUPS"],
    githubUrl: "https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable",
    deployUrl: null,
  },
  {
    slug: "erc20-frontend",
    name: "ERC-20 Token + Frontend",
    description:
      "Minimal ERC-20 contract paired with a Next.js UI for minting, transferring, and displaying balances via wagmi hooks.",
    category: "Full-Stack",
    stack: ["Solidity", "Next.js", "wagmi", "OpenZeppelin"],
    githubUrl: "https://github.com/thirdweb-example/erc20-token",
    deployUrl: "https://thirdweb.com/templates/erc20-token",
    deployLabel: "thirdweb",
  },

  // ── Solana ────────────────────────────────────────────────────────────────
  {
    slug: "solana-anchor-nextjs",
    name: "Solana Anchor + Next.js",
    description:
      "Full-stack Solana dApp: Anchor program on-chain, generated TypeScript client, and a Next.js frontend with wallet adapter.",
    category: "Solana",
    stack: ["Anchor", "Rust", "Next.js", "Solana Wallet Adapter"],
    githubUrl: "https://github.com/solana-developers/create-solana-dapp",
    deployUrl: "https://vercel.com/new/clone?repository-url=https://github.com/solana-developers/create-solana-dapp",
    deployLabel: "Vercel",
  },
  {
    slug: "solana-token-creator",
    name: "Solana Token Creator",
    description:
      "Create and manage SPL tokens with a minimal Next.js frontend. Wallet connection, mint, transfer, and burn all included.",
    category: "Solana",
    stack: ["Next.js", "SPL Token", "Solana Web3.js", "TypeScript"],
    githubUrl: "https://github.com/solana-developers/program-examples/tree/main/tokens/spl-token",
    deployUrl: null,
  },
];

/* ── Helpers ──────────────────────────────────────────────────────────────── */

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  "All",
  "Full-Stack",
  "Smart Contracts",
  "Frontend Only",
  "Solana",
  "Base",
  "Indexing",
];

export function filterTemplates(
  items: Template[],
  category: TemplateCategory,
): Template[] {
  if (category === "All") return items;
  return items.filter((t) => t.category === category);
}
