import { defineConfig } from 'typechain';

export default defineConfig({
  outDir: 'src/types',
  target: 'ethers-v6',
  inputDir: 'out',
  alwaysGenerateOverloads: false,
  externalArtifacts: ['externalArtifacts/*.json'],
  deployments: 'deployments',
  deploymentHeaders: 'deployments',
  artifacts: 'out',
  cwd: '.',
}); 