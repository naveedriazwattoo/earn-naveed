declare module '@mini/shared' {
  export const TOKENS_PER_TX: number;
  export const MAX_TOKENS_PER_24H: number;
  export const prisma: import('@prisma/client').PrismaClient;
  export const MiniTokenAbi: any;
}

declare module '@mini/shared/abi' {
  export const MiniTokenAbi: any;
} 