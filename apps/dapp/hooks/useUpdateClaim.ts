// import { useClaimableContext } from "@/contexts/claimableContext";
import { useState, useCallback } from "react";
interface UpdateClaimParams {
  user: string;
  lastClaimedBlock: number;
  lastTxnClaimedHash?: string;
  tokensLastClaimed: number;
}

interface UpdateClaimResponse {
  success: boolean;
  message: string;
}
export function useUpdateClaim() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const { setUserInfo } = useClaimableContext();

  const updateClaim = useCallback(
    async (params: UpdateClaimParams): Promise<UpdateClaimResponse | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/user/update/lastclaimed", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to update claim information");
        }

        return data;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  ); // No dependencies needed since we only use state setters

  return { updateClaim, isLoading, error };
}
