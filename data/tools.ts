import type { StaticToolData } from "@/lib/types";

/**
 * Static seed data for the Discover and Tool Detail pages.
 * Replace with a real catalog when the backing store lands.
 */
export const featuredTools: StaticToolData[] = [
  {
    id: "wagmi",
    name: "wagmi",
    slug: "wagmi",
    description:
      "React Hooks for Ethereum — connect wallets, sign, read, and write.",
    longDescription:
      "wagmi is a collection of React Hooks containing everything you need to start working with Ethereum. It makes it easy to connect a wallet, display ENS and balance information, sign messages, interact with contracts, and much more — all with caching, request deduplication, and persistence handled for you. Built on top of viem, it gives you end-to-end type safety without sacrificing ergonomics.",
    category: "Frontend",
    tags: ["React", "TypeScript", "Wallet"],
    stars: "6.1k",
    starsRaw: 6100,
    createdAt: "2025-01-01T00:00:00Z",
    links: {
      github: "https://github.com/wevm/wagmi",
      docs: "https://wagmi.sh",
      npm: "https://www.npmjs.com/package/wagmi",
      website: "https://wagmi.sh",
    },
    quickstarts: [
      {
        title: "Install",
        language: "bash",
        code: "npm install wagmi viem@2.x @tanstack/react-query",
      },
      {
        title: "Create a config",
        language: "ts",
        code: `import { http, createConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});`,
      },
      {
        title: "Read on-chain data",
        language: "tsx",
        code: `import { useAccount, useBalance } from "wagmi";

export function Profile() {
  const { address } = useAccount();
  const { data } = useBalance({ address });

  if (!address) return <p>Not connected</p>;
  return <p>{data?.formatted} {data?.symbol}</p>;
}`,
      },
    ],
    docsSummary:
      "The official docs cover configuration, connectors, hooks for reading and writing to contracts, ENS utilities, SSR, and testing. Start with the Getting Started guide, then move through Core Concepts before exploring the full hook reference.",
    docsUrl: "https://wagmi.sh",
    communityNotes: [
      {
        author: "@alice.eth",
        timeAgo: "2 weeks ago",
        body: "If you're migrating from v1, the biggest change is the config object — you no longer wrap connectors manually. Follow the migration guide end-to-end; don't cherry-pick.",
      },
      {
        author: "@web3builder",
        timeAgo: "1 month ago",
        body: "Pair wagmi with @tanstack/react-query devtools during development — inspecting query state cuts debugging time dramatically.",
      },
      {
        author: "@samczsun",
        timeAgo: "3 months ago",
        body: "For SSR apps, make sure to hydrate the wagmi config on the server. The cookie storage adapter handles this cleanly.",
      },
    ],
    relatedSlugs: ["viem", "thirdweb", "scaffold-eth-2", "hardhat"],
  },

  {
    id: "thirdweb",
    name: "thirdweb",
    slug: "thirdweb",
    description:
      "Full-stack Web3 development platform — SDKs, contracts, wallets, and infra.",
    longDescription:
      "thirdweb is a complete Web3 development toolkit: a TypeScript/React SDK, audited contract templates, an embedded wallet, account abstraction, and a managed infrastructure layer for RPC, storage, and analytics. It is designed to get a production dApp shipped in hours, not weeks, while still giving advanced teams escape hatches into raw contract interactions.",
    category: "Frontend",
    tags: ["SDK", "Contracts", "Wallets"],
    stars: "2.1k",
    starsRaw: 2100,
    createdAt: "2025-01-01T00:00:00Z",
    links: {
      github: "https://github.com/thirdweb-dev/js",
      docs: "https://portal.thirdweb.com",
      npm: "https://www.npmjs.com/package/thirdweb",
      website: "https://thirdweb.com",
    },
    quickstarts: [
      {
        title: "Install",
        language: "bash",
        code: "npm install thirdweb",
      },
      {
        title: "Create a client",
        language: "ts",
        code: `import { createThirdwebClient } from "thirdweb";

export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});`,
      },
      {
        title: "Connect a wallet in React",
        language: "tsx",
        code: `"use client";

import { ConnectButton } from "thirdweb/react";
import { client } from "./client";

export function Header() {
  return <ConnectButton client={client} />;
}`,
      },
    ],
    docsSummary:
      "The thirdweb portal documents the TypeScript SDK, React hooks, Connect (wallet UI), Engine (server wallets), and pre-built contracts. New projects should start with the Connect quickstart, then layer in Engine for backend automation.",
    docsUrl: "https://portal.thirdweb.com",
    communityNotes: [
      {
        author: "@0xdev",
        timeAgo: "3 days ago",
        body: "The new v5 SDK ships tree-shakeable exports. Bundle sizes dropped ~60% compared to v4 on our production app.",
      },
      {
        author: "@nftbuilder",
        timeAgo: "1 month ago",
        body: "Use the prebuilt Marketplace V3 contract rather than rolling your own — the audited version is battle-tested and saves weeks.",
      },
      {
        author: "@serverlessdao",
        timeAgo: "2 months ago",
        body: "Engine's queued transactions are great for airdrops, but set a conservative rate limit — Engine will faithfully nuke your RPC quota otherwise.",
      },
    ],
    relatedSlugs: ["wagmi", "viem", "hardhat", "scaffold-eth-2"],
  },

  {
    id: "hardhat",
    name: "Hardhat",
    slug: "hardhat",
    description:
      "Flexible Ethereum development environment for professionals.",
    longDescription:
      "Hardhat is a development environment for Ethereum that gives you a local network, a flexible task runner, and first-class TypeScript support. Its plugin ecosystem covers everything from verification (hardhat-verify) to gas reporting, coverage, and deploy pipelines. Hardhat's console.log in Solidity and stack traces for failed transactions remain some of the most loved features in the ecosystem.",
    category: "Smart Contracts",
    tags: ["Solidity", "Testing", "Node"],
    stars: "7.4k",
    starsRaw: 7400,
    createdAt: "2025-01-01T00:00:00Z",
    links: {
      github: "https://github.com/NomicFoundation/hardhat",
      docs: "https://hardhat.org/docs",
      npm: "https://www.npmjs.com/package/hardhat",
      website: "https://hardhat.org",
    },
    quickstarts: [
      {
        title: "Create a new project",
        language: "bash",
        code: `mkdir my-project && cd my-project
npm init -y
npm install --save-dev hardhat
npx hardhat init`,
      },
      {
        title: "A minimal test",
        language: "ts",
        code: `import { expect } from "chai";
import { ethers } from "hardhat";

describe("Counter", () => {
  it("increments", async () => {
    const counter = await ethers.deployContract("Counter");
    await counter.increment();
    expect(await counter.count()).to.equal(1n);
  });
});`,
      },
      {
        title: "Run tests and deploy",
        language: "bash",
        code: `npx hardhat test
npx hardhat run scripts/deploy.ts --network sepolia`,
      },
    ],
    docsSummary:
      "The Hardhat docs are organised around Getting Started, Guides (testing, deployment, forking), the Config reference, and a Plugins directory. The Hardhat for Viem guide is the fastest way to a modern TS + viem workflow.",
    docsUrl: "https://hardhat.org/docs",
    communityNotes: [
      {
        author: "@soliditydev",
        timeAgo: "1 week ago",
        body: "hardhat-ignition has mostly replaced hand-written deploy scripts for anything non-trivial. The declarative module format is worth the short learning curve.",
      },
      {
        author: "@auditor",
        timeAgo: "2 weeks ago",
        body: "Enable the gas reporter and coverage plugins from day one. Retrofitting them into a large test suite is painful.",
      },
      {
        author: "@foundrycurious",
        timeAgo: "1 month ago",
        body: "You don't have to choose — Foundry for fuzz / invariant tests, Hardhat for deploy pipelines and TypeScript integration tests works really well.",
      },
    ],
    relatedSlugs: ["foundry", "wagmi", "slither", "scaffold-eth-2"],
  },

  {
    id: "foundry",
    name: "Foundry",
    slug: "foundry",
    description:
      "Blazing fast Solidity toolkit for building, testing, and deploying smart contracts.",
    longDescription:
      "Foundry is a Rust-based smart contract development toolchain. It is exceptionally fast, writes tests in Solidity (no JS indirection), and comes with world-class fuzzing and invariant testing out of the box. forge, cast, anvil, and chisel cover the entire contract development loop.",
    category: "Smart Contracts",
    tags: ["Solidity", "Rust", "Fuzzing"],
    stars: "8.9k",
    starsRaw: 8900,
    createdAt: "2025-01-01T00:00:00Z",
    links: {
      github: "https://github.com/foundry-rs/foundry",
      docs: "https://book.getfoundry.sh",
      website: "https://getfoundry.sh",
    },
    quickstarts: [
      {
        title: "Install",
        language: "bash",
        code: `curl -L https://foundry.paradigm.xyz | bash
foundryup`,
      },
      {
        title: "New project",
        language: "bash",
        code: `forge init my-project
cd my-project
forge test`,
      },
    ],
    docsSummary:
      "The Foundry Book walks through forge (build + test), cast (CLI RPC), anvil (local node), and chisel (REPL). The fuzz / invariant chapters are the best primer on property-based testing in Solidity.",
    docsUrl: "https://book.getfoundry.sh",
    communityNotes: [
      {
        author: "@fuzzer",
        timeAgo: "5 days ago",
        body: "Turn on invariant testing before you ship anything with an AMM-like state machine — we've caught two separate mispricing bugs this way.",
      },
      {
        author: "@chainhacker",
        timeAgo: "1 month ago",
        body: "cast run <txhash> --quick is unreasonably good for post-mortem debugging of mainnet txs.",
      },
    ],
    relatedSlugs: ["hardhat", "slither", "scaffold-eth-2", "wagmi"],
  },

  {
    id: "viem",
    name: "viem",
    slug: "viem",
    description:
      "Type-safe, lightweight TypeScript interface for Ethereum.",
    longDescription:
      "viem is a TypeScript-first Ethereum library with a strong emphasis on type safety, tree-shakeability, and modern DX. It is the foundation many newer libraries (including wagmi) build on, and exposes a clean public/wallet client split that maps naturally to the JSON-RPC world.",
    category: "Frontend",
    tags: ["TypeScript", "RPC"],
    stars: "4.2k",
    starsRaw: 4200,
    createdAt: "2025-01-01T00:00:00Z",
    links: {
      github: "https://github.com/wevm/viem",
      docs: "https://viem.sh",
      npm: "https://www.npmjs.com/package/viem",
    },
    quickstarts: [
      {
        title: "Install",
        language: "bash",
        code: "npm install viem",
      },
      {
        title: "Read a block",
        language: "ts",
        code: `import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
});

const block = await client.getBlock();`,
      },
    ],
    docsSummary:
      "viem.sh documents Public / Wallet / Test clients, Actions, Contracts, and Utilities. The Contract section's type-inference examples are required reading before writing production read/write flows.",
    docsUrl: "https://viem.sh",
    communityNotes: [
      {
        author: "@typesafe",
        timeAgo: "1 week ago",
        body: "Import ABIs as `const` assertions — without that, viem can't infer return types and you lose most of the reason to pick it over ethers.",
      },
      {
        author: "@rpcnerd",
        timeAgo: "3 weeks ago",
        body: "The built-in multicall batching is off by default. Turn it on in your transport config for a large latency win on chatty pages.",
      },
    ],
    relatedSlugs: ["wagmi", "thirdweb", "hardhat", "foundry"],
  },

  {
    id: "the-graph",
    name: "The Graph",
    slug: "the-graph",
    description:
      "Decentralized indexing protocol for querying on-chain data with GraphQL.",
    category: "Backend & Indexing",
    tags: ["GraphQL", "Indexing"],
    stars: "3.1k",
    starsRaw: 3100,
    createdAt: "2025-01-01T00:00:00Z",
    links: {
      docs: "https://thegraph.com/docs",
      website: "https://thegraph.com",
      github: "https://github.com/graphprotocol/graph-node",
    },
    relatedSlugs: ["wagmi", "viem", "alchemy"],
  },

  {
    id: "alchemy",
    name: "Alchemy",
    slug: "alchemy",
    description:
      "Web3 infrastructure, node APIs, and developer tooling at scale.",
    category: "Infrastructure",
    stars: "1.2k",
    starsRaw: 1200,
    createdAt: "2025-01-01T00:00:00Z",
    links: {
      docs: "https://docs.alchemy.com",
      website: "https://alchemy.com",
    },
    relatedSlugs: ["the-graph", "viem", "wagmi"],
  },

  {
    id: "slither",
    name: "Slither",
    slug: "slither",
    description:
      "Static analysis framework for finding vulnerabilities in Solidity.",
    category: "Security",
    tags: ["Static analysis", "Python"],
    stars: "5.3k",
    starsRaw: 5300,
    createdAt: "2025-01-01T00:00:00Z",
    links: {
      github: "https://github.com/crytic/slither",
      docs: "https://github.com/crytic/slither/wiki",
    },
    relatedSlugs: ["foundry", "hardhat"],
  },

  {
    id: "scaffold-eth-2",
    name: "Scaffold-ETH 2",
    slug: "scaffold-eth-2",
    description:
      "Open-source toolkit to build decentralized apps on Ethereum quickly.",
    category: "Templates",
    tags: ["Starter", "Monorepo"],
    stars: "2.4k",
    starsRaw: 2400,
    createdAt: "2025-01-01T00:00:00Z",
    links: {
      github: "https://github.com/scaffold-eth/scaffold-eth-2",
      docs: "https://docs.scaffoldeth.io",
      website: "https://scaffoldeth.io",
    },
    relatedSlugs: ["wagmi", "hardhat", "viem", "foundry"],
  },

  {
    id: "openzeppelin-contracts",
    name: "OpenZeppelin Contracts",
    slug: "openzeppelin-contracts",
    description:
      "Battle-tested, audited Solidity library for secure smart contract development.",
    longDescription:
      "OpenZeppelin Contracts is the most widely used library in Solidity development. It provides reference implementations of ERC-20, ERC-721, ERC-1155, access control, governance, proxy patterns, and much more — all formally audited and actively maintained. Nearly every serious on-chain project depends on it.",
    category: "Smart Contracts",
    tags: ["Solidity", "ERC-20", "Security"],
    stars: "25.1k",
    starsRaw: 25100,
    createdAt: "2025-01-01T00:00:00Z",
    links: {
      github: "https://github.com/OpenZeppelin/openzeppelin-contracts",
      docs: "https://docs.openzeppelin.com/contracts",
      npm: "https://www.npmjs.com/package/@openzeppelin/contracts",
      website: "https://openzeppelin.com",
    },
    quickstarts: [
      {
        title: "Install",
        language: "bash",
        code: "npm install @openzeppelin/contracts",
      },
      {
        title: "ERC-20 token in 10 lines",
        language: "sol",
        code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20("MyToken", "MTK") {
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }
}`,
      },
    ],
    docsSummary:
      "The OpenZeppelin Contracts docs cover every standard contract, the Wizard (interactive generator), upgrade patterns with transparent and UUPS proxies, and governance. Start with the Wizard to generate a base, then read the relevant module docs.",
    docsUrl: "https://docs.openzeppelin.com/contracts",
    communityNotes: [
      {
        author: "@auditor",
        timeAgo: "4 days ago",
        body: "Always import from a pinned version tag, not latest. A surprising number of production incidents trace back to an unexpected minor-version bump changing initializer behavior.",
      },
      {
        author: "@proxyenjoyer",
        timeAgo: "3 weeks ago",
        body: "Use the Upgrades plugin for Hardhat or Foundry when deploying proxies. Manual proxy deploys are error-prone; the plugin validates your storage layout automatically.",
      },
    ],
    relatedSlugs: ["hardhat", "foundry", "slither", "scaffold-eth-2"],
  },

  {
    id: "rainbowkit",
    name: "RainbowKit",
    slug: "rainbowkit",
    description:
      "Beautiful, customizable wallet connection UI for React dApps.",
    longDescription:
      "RainbowKit is the most polished wallet connection library in the React ecosystem. It ships a fully accessible ConnectButton, wallet switcher, and chain selector out of the box, and integrates cleanly with wagmi. Themes are customizable, and custom wallets can be added in a few lines.",
    category: "Frontend",
    tags: ["React", "Wallet UI"],
    stars: "4.7k",
    starsRaw: 4700,
    createdAt: "2025-01-01T00:00:00Z",
    links: {
      github: "https://github.com/rainbow-me/rainbowkit",
      docs: "https://rainbowkit.com/docs",
      npm: "https://www.npmjs.com/package/@rainbow-me/rainbowkit",
      website: "https://rainbowkit.com",
    },
    quickstarts: [
      {
        title: "Install",
        language: "bash",
        code: "npm install @rainbow-me/rainbowkit wagmi viem@2.x @tanstack/react-query",
      },
      {
        title: "Add ConnectButton",
        language: "tsx",
        code: `import "@rainbow-me/rainbowkit/styles.css";
import { ConnectButton, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "./config";

const queryClient = new QueryClient();

export function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ConnectButton />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}`,
      },
    ],
    docsSummary:
      "The RainbowKit docs cover installation, themes, custom chains, custom wallets, authentication (SIWE), and localization. The theming guide is particularly thorough and shows how to match your brand without losing accessibility.",
    docsUrl: "https://rainbowkit.com/docs",
    communityNotes: [
      {
        author: "@walletbuilder",
        timeAgo: "1 week ago",
        body: "If you need SIWE (Sign-In With Ethereum), RainbowKit's built-in auth adapter saves at least a day of plumbing.",
      },
    ],
    relatedSlugs: ["wagmi", "viem", "thirdweb", "scaffold-eth-2"],
  },
  {
    id: "anchor",
    name: "Anchor",
    slug: "anchor",
    description: "Framework for Solana Sealevel runtime providing DSLs for writing, testing, and deploying programs.",
    category: "Smart Contracts",
    tags: ["Solana", "Rust", "Framework"],
    stars: "3.8k",
    starsRaw: 3800,
    createdAt: "2025-01-01T00:00:00Z",
    links: { github: "https://github.com/coral-xyz/anchor", docs: "https://www.anchor-lang.com" },
    relatedSlugs: ["quicknode", "ponder"],
  },
  {
    id: "quicknode",
    name: "QuickNode",
    slug: "quicknode",
    description: "High-performance blockchain API provider with global node infrastructure for 40+ chains.",
    category: "Infrastructure",
    tags: ["RPC", "API", "Multi-chain"],
    stars: "0.8k",
    starsRaw: 800,
    createdAt: "2025-01-01T00:00:00Z",
    links: { github: "https://github.com/quiknode-labs", docs: "https://www.quicknode.com/docs", website: "https://www.quicknode.com" },
    relatedSlugs: ["alchemy", "the-graph"],
  },
  {
    id: "ethers-js",
    name: "ethers.js",
    slug: "ethers-js",
    description: "Complete Ethereum library and wallet implementation in JavaScript and TypeScript.",
    category: "Frontend",
    tags: ["JavaScript", "TypeScript", "Wallet"],
    stars: "7.9k",
    starsRaw: 7900,
    createdAt: "2025-01-01T00:00:00Z",
    links: { github: "https://github.com/ethers-io/ethers.js", docs: "https://docs.ethers.org", npm: "https://www.npmjs.com/package/ethers" },
    relatedSlugs: ["viem", "wagmi", "hardhat"],
  },
  {
    id: "ponder",
    name: "Ponder",
    slug: "ponder",
    description: "Open-source framework for crypto apps — index blockchain data and serve it via GraphQL.",
    category: "Backend & Indexing",
    tags: ["Indexing", "GraphQL", "TypeScript"],
    stars: "1.6k",
    starsRaw: 1600,
    createdAt: "2025-01-01T00:00:00Z",
    links: { github: "https://github.com/ponder-sh/ponder", docs: "https://ponder.sh/docs", website: "https://ponder.sh" },
    relatedSlugs: ["the-graph", "alchemy", "quicknode"],
  },
  {
    id: "tenderly",
    name: "Tenderly",
    slug: "tenderly",
    description: "All-in-one Web3 development platform with real-time monitoring, alerting, and debugging.",
    category: "Infrastructure",
    tags: ["Debugging", "Monitoring", "DevOps"],
    stars: "0.6k",
    starsRaw: 600,
    createdAt: "2025-01-01T00:00:00Z",
    links: { github: "https://github.com/Tenderly", docs: "https://docs.tenderly.co", website: "https://tenderly.co" },
    relatedSlugs: ["hardhat", "foundry", "slither"],
  },
];

export const tools = featuredTools;

export function getToolBySlug(slug: string): StaticToolData | undefined {
  return featuredTools.find((t) => t.slug === slug);
}

export function getRelatedTools(slugs: string[], limit = 4): StaticToolData[] {
  return slugs
    .slice(0, limit)
    .map((slug) => featuredTools.find((t) => t.slug === slug))
    .filter((t): t is StaticToolData => t !== undefined);
}
