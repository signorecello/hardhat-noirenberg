import { TASK_CLEAN } from "hardhat/builtin-tasks/task-names";
import { resetHardhatContext } from "hardhat/plugins-testing";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import path, { resolve } from "path";
import fs from "fs";

declare module "mocha" {
  interface Context {
    hre: HardhatRuntimeEnvironment;
  }
}

export function useEnvironment(environment: string) {
  beforeEach("Loading hardhat environment", async function () {
    process.chdir(path.join(__dirname));
    resetHardhatContext();

    fs.copyFileSync(
      resolve("environments", `${environment}.ts`),
      resolve(__dirname, "hardhat.config.ts"),
    );

    this.hre = require("hardhat");
  });

  afterEach("Resetting hardhat", async function () {
    fs.existsSync(resolve("contracts")) &&
      fs.rmdirSync(resolve("contracts"), { recursive: true });
    fs.existsSync(resolve("artifacts")) &&
      fs.rmdirSync(resolve("artifacts"), { recursive: true });
    fs.existsSync(resolve("cache")) &&
      fs.rmdirSync(resolve("cache"), { recursive: true });

    fs.copyFileSync(
      resolve("environments", "default.ts"),
      resolve(__dirname, "hardhat.config.ts"),
    );
    resetHardhatContext();
  });
}
