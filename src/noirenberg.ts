import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { CompiledCircuit } from "@noir-lang/noir_js";
import {
  HardhatRuntimeEnvironment,
  HardhatUserConfig,
  ProjectPathsConfig,
} from "hardhat/types";
import { RawBuffer } from "@aztec/bb.js";
import type {
  UltraHonkBackend as UltraHonkBackendType,
  UltraPlonkBackend as UltraPlonkBackendType,
} from "@aztec/bb.js";

import { compile, createFileManager } from "@noir-lang/noir_wasm";
import { resolve } from "path";
import { Noir } from "@noir-lang/noir_js";
import { ProvingSystem } from "./type-extensions";
export class Noirenberg {
  noir: Noir | undefined;
  backend: UltraHonkBackendType | UltraPlonkBackendType | undefined;

  constructor(
    private paths: ProjectPathsConfig,
    private noirenberg: HardhatUserConfig["noirenberg"],
  ) {}

  async compile() {
    const circuit = await this.compileCircuit(this.paths.noir);

    this.noir = new Noir(circuit);
    if (this.noirenberg?.provingSystem == ProvingSystem.UltraPlonk) {
      const { UltraPlonkBackend } = await import("@aztec/bb.js");
      this.backend = new UltraPlonkBackend(circuit.bytecode);
    } else {
      const { UltraHonkBackend } = await import("@aztec/bb.js");
      this.backend = new UltraHonkBackend(circuit.bytecode);
    }
    return { noir: this.noir, backend: this.backend };
  }

  /**
   * Compiles a Noir circuit from the specified path.
   *
   * @param path Path to the Noir circuit directory. Defaults to "./noir"
   * @returns The compiled circuit
   * @throws Error if compilation fails
   */

  private async compileCircuit(path: string) {
    const fm = createFileManager(resolve(path));
    const result = await compile(fm);
    if (!("program" in result)) {
      throw new Error("Compilation failed");
    }
    return result.program as CompiledCircuit;
  }

  /**
   * Gets a backend instance for a Noir circuit using UltraHonk
   * @param circuit The compiled Noir circuit
   * @returns Object containing the UltraHonk backend instance
   */
  async getSolidityVerifier() {
    if (!this.backend) {
      await this.compile();
    }

    const vk = await this.backend!.getVerificationKey();
    const contractBytes = await this.backend!.getSolidityVerifier(
      new RawBuffer(vk),
    );
    const contract = Buffer.from(contractBytes).toString("utf-8");
    mkdirSync(path.resolve(this.paths.sources), {
      recursive: true,
    });

    if (this.noirenberg?.provingSystem == ProvingSystem.UltraPlonk) {
      writeFileSync(
        path.resolve(this.paths.sources, "UltraVerifier.sol"),
        contract,
      );
    } else {
      writeFileSync(
        path.resolve(this.paths.sources, "HonkVerifier.sol"),
        contract,
      );
    }
  }
}
