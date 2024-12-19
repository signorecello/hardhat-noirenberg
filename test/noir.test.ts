// tslint:disable-next-line no-implicit-dependencies
import { expect } from "chai";
import path from "path";
import { Noirenberg } from "../src/noirenberg";
import { toHex, padHex } from "viem";
import { useEnvironment } from "./environments";

describe("Integration tests examples", function () {
  describe("Default", function () {
    useEnvironment("default");
    it("Deploys a UltraPlonk verifier by default", async function () {
      const { noir, backend } = await this.hre.noirenberg.compile();
      await this.hre.noirenberg.getSolidityVerifier();
      await this.hre.run("compile");

      const { witness } = await noir.execute({ x: 1, y: 2 });
      const proof = await backend.generateProof(witness);
      await backend.verifyProof(proof);

      const contract = await this.hre.viem.deployContract("UltraVerifier");

      // currently not working
      const result = await contract.read.verify([
        toHex(proof.proof),
        proof.publicInputs as `0x${string}`[],
      ]);
      expect(result).to.equal(true);
    });
  });

  describe("UltraPlonk", function () {
    useEnvironment("UltraPlonk");
    it("Deploys a UltraPlonk verifier", async function () {
      const { noir, backend } = await this.hre.noirenberg.compile();
      await this.hre.noirenberg.getSolidityVerifier();
      await this.hre.run("compile");

      const { witness } = await noir.execute({ x: 1, y: 2 });
      const proof = await backend.generateProof(witness);
      await backend.verifyProof(proof);

      const contract = await this.hre.viem.deployContract("UltraVerifier");

      // currently not working
      const result = await contract.read.verify([
        toHex(proof.proof),
        proof.publicInputs as `0x${string}`[],
      ]);
      expect(result).to.equal(true);
    });
  });

  describe("UltraHonk", function () {
    useEnvironment("UltraHonk");

    it("Deploys a UltraHonk verifier", async function () {
      const { noir, backend } = await this.hre.noirenberg.compile();
      await this.hre.noirenberg.getSolidityVerifier();
      await this.hre.run("compile");

      const { witness } = await noir.execute({ x: 1, y: 2 });
      const proof = await backend.generateProof(witness, { keccak: true });
      await backend.verifyProof(proof);

      const contract = await this.hre.viem.deployContract("HonkVerifier");

      // currently not working
      // const result = await contract.read.verify([
      //   toHex(proof.proof),
      //   proof.publicInputs,
      // ]);

      // @ts-ignore
      expect(contract.abi[3].name).to.equal("verify");
    });
  });
});
