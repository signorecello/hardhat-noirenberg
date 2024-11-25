// tslint:disable-next-line no-implicit-dependencies
import { assert, expect } from "chai";
import fs from "fs";
import { TASK_CLEAN, TASK_COMPILE } from "hardhat/builtin-tasks/task-names";
import path from "path";
import { NoirExtension } from "../src/Noir";
import { useEnvironment } from "./helpers";

describe("Integration tests examples", function () {
  describe("Hardhat Runtime Environment extension", function () {
    useEnvironment("hardhat-project");

    it("Should add the example field", function () {
      assert.instanceOf(this.hre.noir, NoirExtension);
    });

    it("should compile", async function () {
      let start;
      await this.hre.run(TASK_CLEAN);

      start = performance.now();
      await this.hre.run(TASK_COMPILE);
      const coldCompileTime = performance.now() - start;
      const COLD_COMPILE_THRESHOLD = 600;
      expect(coldCompileTime).to.be.gt(COLD_COMPILE_THRESHOLD);

      start = performance.now();
      await this.hre.run(TASK_COMPILE);
      const warmCompileTime = performance.now() - start;
      console.log("cold", coldCompileTime);
      console.log("warm", warmCompileTime);
      expect(warmCompileTime).to.be.lt(COLD_COMPILE_THRESHOLD);

      const { circuit } = await this.hre.noir.getCircuit("my_circuit");
      expect(circuit.bytecode.length).to.be.gt(0);
    });

    it("creates a package", async function () {
      const name = "my_package";
      await this.hre.run("noir-new", { name });
      const dir = path.join(this.hre.config.paths.noir, name);
      const exists = fs.existsSync(dir);
      expect(exists).to.be.eq(true);
      fs.rmSync(dir, { recursive: true });
    });
  });

  describe("HardhatConfig extension", function () {
    useEnvironment("hardhat-project");

    it("Should add the newPath to the config", function () {
      assert.equal(
        this.hre.config.paths.noir,
        path.join(process.cwd(), "noir2"),
      );
    });
  });

  describe("no extra solidity contracts", function () {
    useEnvironment("no-extra-contracts");

    it("deploys a verifier directly", async function () {
      await this.hre.run("compile");

      const contractFactory =
        await this.hre.ethers.getContractFactory("UltraVerifier");
      const contract = await contractFactory.deploy();
      await contract.waitForDeployment();
      console.log("verifier", await contract.getAddress());
    });
  });
});

// describe("Unit tests examples", function () {
//   describe("ExampleHardhatRuntimeEnvironmentField", function () {
//     describe("sayHello", function () {
//       it("Should say hello", function () {
//         const field = new Noir();
//         assert.equal(field.hello(), "hello");
//       });
//     });
//   });
// });
