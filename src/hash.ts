import * as crypto from "crypto";
import { promises as fs } from "fs";
import { glob } from "glob";
import * as path from "path";

export async function getFileHash(filePath: string): Promise<string> {
  const fileContent = await fs.readFile(filePath);
  return crypto.createHash("sha256").update(fileContent).digest("hex");
}

export async function getHashOfNoirWorkspace(baseDir: string) {
  const filePatterns = ["**/*.nr", "**/Nargo.toml"];
  const files = await Promise.all(
    filePatterns.map((pattern) => glob(pattern, { cwd: baseDir })),
  );

  const allFiles = files.flat().sort();

  const fileHashes = [];
  for (const file of allFiles) {
    const fullPath = path.join(baseDir, file);
    const hash = await getFileHash(fullPath);
    fileHashes.push(hash);
  }

  return crypto.createHash("sha256").update(fileHashes.join("")).digest("hex");
}
