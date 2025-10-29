import fs from 'fs';
import path from 'path';

const CONTRACT_NAME = 'MiniToken';
const ABI_SOURCE_PATH = path.resolve(
  __dirname,
  '../packages/contracts/out',
  `${CONTRACT_NAME}.sol`,
  `${CONTRACT_NAME}.json`
);

const ABI_DEST_PATH = path.resolve(
  __dirname,
  '../packages/shared/abi',
  `${CONTRACT_NAME}.json`
);

// Ensure output dir exists
fs.mkdirSync(path.dirname(ABI_DEST_PATH), { recursive: true });

const artifact = JSON.parse(fs.readFileSync(ABI_SOURCE_PATH, 'utf8'));
const abi = artifact.abi;

fs.writeFileSync(ABI_DEST_PATH, JSON.stringify(abi, null, 2));
console.log(`✅ Exported ABI to ${ABI_DEST_PATH}`);
