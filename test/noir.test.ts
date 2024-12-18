// tslint:disable-next-line no-implicit-dependencies
import { expect } from "chai";
import path from "path";
import { Noirenberg } from "../src/noirenberg";
import { toHex, padHex } from "viem";
process.chdir(path.join(__dirname));
const hre = require("hardhat");

describe("Integration tests examples", function () {
  it("deploys a verifier directly", async function () {
    const noirenberg = await Noirenberg.new(hre);
    await noirenberg.getSolidityVerifier();
    const { noir, backend } = noirenberg;

    const { witness } = await noir.execute({ x: 1, y: 2 });
    const proof = await backend.generateProof(witness, { keccak: true });

    await hre.run("compile");

    const contract = await hre.viem.deployContract("HonkVerifier");
    console.log(proof);
    await backend.verifyProof(proof);
    const result = await contract.read.verify([
      toHex(proof.proof),
      proof.publicInputs,
    ]);

    expect(contract.abi[3].name).to.equal("verify");
  });
});
