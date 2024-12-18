import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import type { Noir, CompiledCircuit } from "@noir-lang/noir_js";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { RawBuffer } from "@aztec/bb.js";
import type { UltraHonkBackend as UltraHonkBackendType } from "@aztec/bb.js";

import { compile, createFileManager } from "@noir-lang/noir_wasm";
import { resolve } from "path";

export class Noirenberg {
  noir: Noir;
  backend: UltraHonkBackendType;

  private constructor(
    _noir: Noir,
    _backend: UltraHonkBackendType,
    private hre: HardhatRuntimeEnvironment,
  ) {
    this.noir = _noir;
    this.backend = _backend;
  }

  static async new(hre: HardhatRuntimeEnvironment) {
    const { Noir } = await import("@noir-lang/noir_js");
    const { UltraHonkBackend } = await import("@aztec/bb.js");
    const circuit = await this.compileCircuit(hre.config.paths.noir);

    const noir = new Noir(circuit);
    const backend = new UltraHonkBackend(circuit.bytecode);
    return new Noirenberg(noir, backend, hre);
  }

  /**
   * Compiles a Noir circuit from the specified path.
   *
   * @param path Path to the Noir circuit directory. Defaults to "./noir"
   * @returns The compiled circuit
   * @throws Error if compilation fails
   */

  static async compileCircuit(path: string) {
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
    const vk = await this.backend.getVerificationKey();
    const contractBytes = await this.backend.getSolidityVerifier(
      new RawBuffer(vk),
    );
    const contract = Buffer.from(contractBytes).toString("utf-8");
    mkdirSync(path.resolve(this.hre.config.paths.sources), {
      recursive: true,
    });
    writeFileSync(
      path.resolve(this.hre.config.paths.sources, "HonkVerifier.sol"),
      contract,
    );
  }
}
