#!/usr/bin/env bash

set -euo pipefail

# Get the project root directory (parent of scripts/)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"

echo "Compiling Noir circuit..."

# Compile the circuit
if ! nargo compile; then
    echo "Error: Noir circuit compilation failed"
    exit 1
fi

# Generate the Verifier Key
echo "Generating Verifier Key..."
if ! bb write_vk -b target/latest_noir.json -o target --oracle_hash keccak; then
    echo "Error: Failed to generate Verifier Key"
    exit 1
fi

# Generate Solidity Verifier
VERIFIER_NAME="Verifier"
echo "Generating Solidity Verifier..."
if ! bb write_solidity_verifier -k target/vk -o "target/${VERIFIER_NAME}.sol"; then
    echo "Error: Failed to generate Solidity Verifier"
    exit 1
fi

# Create contracts directory if it doesn't exist
mkdir -p contracts

# Copy the Solidity Verifier to the contracts folder
echo "Copying Solidity Verifier to contracts folder..."
if ! cp "target/${VERIFIER_NAME}.sol" "contracts/${VERIFIER_NAME}.sol"; then
    echo "Error: Failed to copy Solidity Verifier to contracts folder"
    exit 1
fi

echo "Noir setup completed successfully"
echo "Verifier contract available at: contracts/${VERIFIER_NAME}.sol"