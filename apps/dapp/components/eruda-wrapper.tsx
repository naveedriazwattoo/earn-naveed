'use client'

import dynamic from 'next/dynamic'

const ErudaProvider = dynamic(
  () => import("./Eruda").then((c) => c.ErudaProvider),
  {
    ssr: false,
  }
)

export default function ErudaWrapper({ children }: { children: React.ReactNode }) {
  // Disable eruda in production or when NEXT_PUBLIC_DISABLE_ERUDA is set
  if (
    process.env.NEXT_PUBLIC_ENVIRONMENT === "production" ||
    process.env.NEXT_PUBLIC_DISABLE_ERUDA === "true"
  ) {
    return <>{children}</>;
  }
  return <ErudaProvider>{children}</ErudaProvider>
} 