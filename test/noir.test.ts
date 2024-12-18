// tslint:disable-next-line no-implicit-dependencies
import { expect } from "chai";
import path from "path";
import { Noirenberg } from "../src/noirenberg";
import { toHex, padHex } from "viem";
process.chdir(path.join(__dirname));
const hre = require("hardhat");

describe("Integration tests examples", function () {
  it("Deploys a verifier", async function () {
    const { noir, backend } = await hre.noirenberg.compile();
    await hre.noirenberg.getSolidityVerifier();
    await hre.run("compile");

    const { witness } = await noir.execute({ x: 1, y: 2 });
    const proof = await backend.generateProof(witness, { keccak: true });
    await backend.verifyProof(proof);

    const contract = await hre.viem.deployContract("HonkVerifier");

    // currently not working
    // const result = await contract.read.verify([
    //   toHex(proof.proof),
    //   proof.publicInputs,
    // ]);

    expect(contract.abi[3].name).to.equal("verify");
  });
});
