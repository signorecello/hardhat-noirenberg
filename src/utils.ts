export const PLUGIN_NAME = "hardhat-plugin-noir";

export const makeRunCommand = (cwd?: string) => async (command: string) => {
  const { exec } = await import("child_process");
  const { promisify } = await import("util");
  const execAsync = promisify(exec);
  // TODO(security): escape command arguments (use template strings)
  try {
    return await execAsync(command, { cwd });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error((error as any).stderr || (error as any).message); // Log only error messages
    throw error;
  }
};
