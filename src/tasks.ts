import { task } from "hardhat/config";
import { TASK_COMPILE } from "hardhat/builtin-tasks/task-names";

task(TASK_COMPILE, "Compile and generate circuits and contracts").setAction(
  async (args, hre, runSuper) => {
    await hre.noirenberg.compile();
    await hre.noirenberg.getSolidityVerifier();
    await runSuper();
  },
);
