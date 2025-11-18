# Latest Noir

A Noir zero-knowledge proof project with on-chain verification using Hardhat and UltraHonk backend.

## Overview

This project demonstrates a simple Noir circuit that proves knowledge of two numbers `x` and `y` whose sum equals a public `result`. The proof can be verified on-chain using the deployed HonkVerifier contract.

## Setup

```bash
pnpm install
```

## Compile

Compile the Noir circuit:
```bash
pnpm compile:noir
```

Compile Solidity contracts:
```bash
pnpm compile:solidity
```

## Test

Run tests (compiles Noir circuit and runs Hardhat tests):
```bash
pnpm test
```

## Project Structure

- `src/main.nr` - Noir circuit implementation
- `contracts/Verifier.sol` - Solidity verifier contract
- `test/Verifier.ts` - Hardhat tests
- `client/` - Next.js frontend application

