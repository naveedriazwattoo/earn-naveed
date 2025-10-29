"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
// packages/shared/prisma.ts
const client_1 = require("@prisma/client");
exports.prisma = global.prisma || new client_1.PrismaClient();
if (process.env.NODE_ENV !== 'production') {
    global.prisma = exports.prisma;
}
