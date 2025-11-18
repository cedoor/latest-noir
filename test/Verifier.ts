import { expect } from "chai";
import hre from "hardhat";
import { Noir, type CompiledCircuit } from '@noir-lang/noir_js'
import { UltraHonkBackend, type ProofData } from '@aztec/bb.js'
import circuit from '../target/latest_noir.json' with { type: 'json' }

const { ethers, networkHelpers } = await hre.network.connect();

describe("Verifier", function () {
  let verifier: any;

  beforeEach(async function () {
    // Deploy the ZKTranscriptLib library first
    const ZKTranscriptLibFactory = await ethers.getContractFactory("ZKTranscriptLib");
    const zkTranscriptLib = await ZKTranscriptLibFactory.deploy();
    await zkTranscriptLib.waitForDeployment();
    
    // Get the HonkVerifier factory and link the library
    const HonkVerifierFactory = await ethers.getContractFactory("HonkVerifier", {
      libraries: {
        ZKTranscriptLib: await zkTranscriptLib.getAddress(),
      },
    });
    
    // Deploy the HonkVerifier contract
    verifier = await HonkVerifierFactory.deploy();

    await verifier.waitForDeployment();
  });

  it("Should deploy the Verifier contract", async function () {
    const address = await verifier.getAddress();

    expect(address).to.be.properAddress;
  });

  it("Should verify a proof", async function () {
    const noir = new Noir(circuit as CompiledCircuit)
    const backend = new UltraHonkBackend((circuit as CompiledCircuit).bytecode, { threads: 4 })
  
    const { witness } = await noir.execute({ x: 5, y: 10, result: 15 })
    const { proof, publicInputs } = await backend.generateProof(witness, { keccakZK: true })
  
    const isValidd = await backend.verifyProof({ proof, publicInputs }, { keccakZK: true })
    
    console.log('isValid', isValidd)

    await backend.destroy()

    const isValid = await verifier.verify(proof, publicInputs)
  
    expect(isValid).to.be.true
  });
});