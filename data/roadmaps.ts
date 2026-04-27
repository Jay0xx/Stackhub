/**
 * data/roadmaps.ts
 * Static roadmap definitions for the /roadmaps page.
 */

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface RoadmapStep {
  /** Tool slug — links to /tools/[slug] on StackHub */
  toolSlug: string;
  /** Display name (duplicated here so the UI doesn't need a slug → name lookup) */
  toolName: string;
  /** What the learner does / learns in this step */
  description: string;
}

export interface Roadmap {
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  /** Human duration string, e.g. "4–6 weeks" */
  duration: string;
  steps: RoadmapStep[];
}

export const roadmaps: Roadmap[] = [
  {
    slug: "zero-to-production-dapp-base",
    title: "Zero to Production dApp on Base",
    description:
      "Build and ship a full-stack decentralised application on Base from scratch — covering smart contracts, a React frontend, and wallet connection.",
    difficulty: "Beginner",
    duration: "5 weeks",
    steps: [
      {
        toolSlug: "hardhat",
        toolName: "Hardhat",
        description:
          "Set up your local development environment. Write, compile, and test your first Solidity contract using Hardhat's task runner and built-in test network.",
      },
      {
        toolSlug: "openzeppelin-contracts",
        toolName: "OpenZeppelin Contracts",
        description:
          "Import audited base contracts (ERC-20, ERC-721, Ownable) instead of writing security-critical code from scratch.",
      },
      {
        toolSlug: "wagmi",
        toolName: "wagmi",
        description:
          "Connect your React app to Base using wagmi hooks. Read on-chain state, send transactions, and handle wallet events reactively.",
      },
      {
        toolSlug: "viem",
        toolName: "viem",
        description:
          "Use viem under the hood for type-safe contract calls, ABI encoding, and low-level RPC interactions.",
      },
      {
        toolSlug: "rainbowkit",
        toolName: "RainbowKit",
        description:
          "Drop in a polished wallet-connect modal that supports MetaMask, Coinbase Wallet, WalletConnect, and more with a single component.",
      },
      {
        toolSlug: "alchemy",
        toolName: "Alchemy",
        description:
          "Point your app at Alchemy's Base RPC for reliable mainnet and testnet access, and use the SDK for gas estimation and NFT APIs.",
      },
    ],
  },

  {
    slug: "solana-full-stack-developer",
    title: "Solana Full-Stack Developer",
    description:
      "Go from Solana basics to building and deploying production programs with a TypeScript client — covering Rust programs, PDAs, and cross-program invocations.",
    difficulty: "Intermediate",
    duration: "6 weeks",
    steps: [
      {
        toolSlug: "anchor",
        toolName: "Anchor",
        description:
          "Learn the Anchor framework to write safe Solana programs in Rust with account validation macros, automatic discriminators, and a built-in test client.",
      },
      {
        toolSlug: "quicknode",
        toolName: "QuickNode",
        description:
          "Provision a QuickNode Solana endpoint for mainnet-beta and devnet. Use the Solana SDK to send and confirm transactions reliably.",
      },
      {
        toolSlug: "thirdweb",
        toolName: "thirdweb",
        description:
          "Use thirdweb's Solana SDK to mint NFT collections and interact with your Anchor programs from a Next.js frontend without juggling wallet adapters manually.",
      },
      {
        toolSlug: "ponder",
        toolName: "Ponder",
        description:
          "Index your Solana program's event logs into a Ponder database and expose them via a typed GraphQL API your frontend can query.",
      },
    ],
  },

  {
    slug: "smart-contract-security-mastery",
    title: "Smart Contract Security Mastery",
    description:
      "Build the mindset and toolchain of a smart contract auditor — static analysis, fuzzing, formal verification, and common vulnerability patterns.",
    difficulty: "Advanced",
    duration: "8 weeks",
    steps: [
      {
        toolSlug: "foundry",
        toolName: "Foundry",
        description:
          "Master Foundry's forge test for property-based fuzzing and invariant testing. Write tests that automatically discover edge cases your unit tests miss.",
      },
      {
        toolSlug: "slither",
        toolName: "Slither",
        description:
          "Run Slither's static analyser over your contracts to catch reentrancy, integer overflow, unprotected selfdestruct, and 80+ other detectors.",
      },
      {
        toolSlug: "openzeppelin-contracts",
        toolName: "OpenZeppelin Contracts",
        description:
          "Study OpenZeppelin's audited implementations to understand safe patterns for access control, upgradability, and token standards.",
      },
      {
        toolSlug: "tenderly",
        toolName: "Tenderly",
        description:
          "Use Tenderly's debugger and transaction simulator to replay past exploits step-by-step and understand exactly where storage was mutated.",
      },
      {
        toolSlug: "hardhat",
        toolName: "Hardhat",
        description:
          "Build a full audit workflow: fork mainnet with Hardhat Network, reproduce a live vulnerability in a test, then patch and verify the fix.",
      },
    ],
  },

  {
    slug: "build-with-thirdweb-nextjs",
    title: "Build with thirdweb + Next.js",
    description:
      "The fastest path to a working Web3 app — deploy contracts, add wallet login, and display NFTs without writing a single line of Solidity.",
    difficulty: "Beginner",
    duration: "3 weeks",
    steps: [
      {
        toolSlug: "thirdweb",
        toolName: "thirdweb",
        description:
          "Deploy an ERC-721 NFT drop from the thirdweb dashboard — no Solidity required. Configure royalties, claim conditions, and allowlists through the UI.",
      },
      {
        toolSlug: "rainbowkit",
        toolName: "RainbowKit",
        description:
          "Add wallet connection to your Next.js app in under ten minutes using RainbowKit's pre-built modal and wagmi integration.",
      },
      {
        toolSlug: "wagmi",
        toolName: "wagmi",
        description:
          "Read contract state (token balances, NFT ownership) and write transactions directly from React components using wagmi hooks.",
      },
      {
        toolSlug: "alchemy",
        toolName: "Alchemy",
        description:
          "Use Alchemy's NFT API to fetch a wallet's entire collection in one call instead of iterating token IDs manually.",
      },
    ],
  },

  {
    slug: "the-graph-indexing",
    title: "The Graph + Indexing Deep Dive",
    description:
      "Learn how to index on-chain events and serve them as a fast GraphQL API — essential for dashboards, analytics, and data-heavy dApps.",
    difficulty: "Intermediate",
    duration: "4 weeks",
    steps: [
      {
        toolSlug: "hardhat",
        toolName: "Hardhat",
        description:
          "Deploy a test contract that emits events (Transfers, swaps, votes) to a local network for you to index.",
      },
      {
        toolSlug: "the-graph",
        toolName: "The Graph",
        description:
          "Write a subgraph manifest, define entity schemas in GraphQL, and map contract events to entities using AssemblyScript handlers.",
      },
      {
        toolSlug: "ponder",
        toolName: "Ponder",
        description:
          "Compare The Graph's approach to Ponder's — build the same indexer in TypeScript and evaluate which fits your latency and hosting requirements.",
      },
      {
        toolSlug: "alchemy",
        toolName: "Alchemy",
        description:
          "Use Alchemy Subgraphs (hosted service) to deploy your subgraph without running your own Graph Node infrastructure.",
      },
    ],
  },

  {
    slug: "account-abstraction-smart-wallets",
    title: "Account Abstraction & Smart Wallets",
    description:
      "Implement ERC-4337 account abstraction — gasless transactions, batch calls, session keys, and social recovery — without custodying user keys.",
    difficulty: "Advanced",
    duration: "5 weeks",
    steps: [
      {
        toolSlug: "viem",
        toolName: "viem",
        description:
          "Use viem's Account Abstraction extensions to construct UserOperations, interact with the EntryPoint contract, and estimate gas for bundler submission.",
      },
      {
        toolSlug: "thirdweb",
        toolName: "thirdweb",
        description:
          "Use thirdweb's Smart Wallet SDK to provision ERC-4337 wallets for users, enable sponsored gas via a Paymaster, and add session keys.",
      },
      {
        toolSlug: "wagmi",
        toolName: "wagmi",
        description:
          "Wire the smart wallet as a wagmi connector so your existing hooks (useWriteContract, useSendTransaction) work without changes.",
      },
      {
        toolSlug: "alchemy",
        toolName: "Alchemy",
        description:
          "Use Alchemy's Bundler and Gas Manager APIs to submit UserOperations to the mempool and sponsor gas for your users.",
      },
      {
        toolSlug: "tenderly",
        toolName: "Tenderly",
        description:
          "Simulate UserOperations in Tenderly before sending them live — catch revert reasons in the validation and execution phases without spending gas.",
      },
    ],
  },
];
