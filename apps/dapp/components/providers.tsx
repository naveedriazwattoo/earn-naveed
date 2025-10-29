"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "../config/wagmi";
import { PropsWithChildren, useState } from "react";
import { ClaimableProvider } from "@/contexts/claimableContext";
import MiniKitProvider from "@/components/minikit-provider";
import { DataProvider } from "@/contexts/dataContext";

export function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <MiniKitProvider>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          <ClaimableProvider>
            <DataProvider>
              {children}
            </DataProvider>
          </ClaimableProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </MiniKitProvider>
  );
}
