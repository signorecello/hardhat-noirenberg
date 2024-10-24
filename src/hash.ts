export async function getFileHash(filePath: string): Promise<string> {
  const fs = await import("fs/promises");
  const fileContent = await fs.readFile(filePath, "utf-8");
  return sha256(fileContent);
}

export async function getHashOfNoirWorkspace(baseDir: string) {
  const { glob } = await import("glob");
  const path = await import("path");

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

  return sha256(fileHashes.join(""));
}

export async function sha256(data: string) {
  const crypto = await import("crypto");
  return crypto.createHash("sha256").update(data).digest("hex");
}
