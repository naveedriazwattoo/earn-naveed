'use client'

import dynamic from 'next/dynamic'

const ErudaProvider = dynamic(
  () => import("./Eruda").then((c) => c.ErudaProvider),
  {
    ssr: false,
  }
)

export default function ErudaWrapper({ children }: { children: React.ReactNode }) {
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === "production") {
    return children;
  }
  return <ErudaProvider>{children}</ErudaProvider>
} 