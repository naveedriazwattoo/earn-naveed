"use client";
import ClaimableTokenDisplay from "@/components/Displays/ClaimableTokenDisplay";
import SwipeFooter from "@/components/Swipe";
import PageLayout from "@/components/Layouts/PageLayout";
import FullPageLoading from "@/components/Loading/FullPageLoading";
import { useClaimableContext } from "@/contexts/claimableContext";
import { useClaimable } from "@/hooks/useClaimable";
import { useEffect, useState } from "react";
import { useClaimTokens } from "@/hooks/useClaimTokens";
import { useUpdateClaim } from "@/hooks/useUpdateClaim";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
const ClaimPage = () => {
  const router = useRouter();
  const { user, userInfo, setUserInfo, setClaimableTimestamp } =
    useClaimableContext();
  const [loadingTxn, setLoadingTxn] = useState(false);
  const {
    claimableTokens,
    loading: claimableLoading,
    error: claimableError,
  } = useClaimable();
  const {
    claimTokens,
    isLoading,
    isConfirming,
    isConfirmed,
    transactionHash,
    blockNumber,
    validSignature,
    error: claimTokensError,
  } = useClaimTokens();
  const { updateClaim, error: updatingClaimError } = useUpdateClaim();

  // TODO: Update flow to setting db first and then hand onchain call and pass function handleUpdateClaim to SwipeFooter
  useEffect(() => {
    const handleUpdateClaim = async () => {
      const result = await updateClaim({
        user: user!, // user's address
        lastClaimedBlock: blockNumber!,
        lastTxnClaimedHash: transactionHash!,
        tokensLastClaimed: claimableTokens,
      });
      console.log("result from handleUpdateClaim: ", result);

      if (result?.success) {
        router.push("/Dashboard");
      } else {
        console.error("Error: ", updatingClaimError);
      }
    };
    if (isConfirmed && !isLoading && !isConfirming && transactionHash) {
      localStorage.setItem("setClaimableTimestamp", JSON.stringify(new Date()));
      setClaimableTimestamp(new Date());
      handleUpdateClaim();
    }
    console.log("isLoading: ", isLoading);
  }, [
    isConfirmed,
    isLoading,
    isConfirming,
    router,
    setUserInfo,
    updateClaim,
    updatingClaimError,
    user,
    claimableTokens,
    blockNumber,
    transactionHash,
    userInfo,
    setClaimableTimestamp,
  ]);

  useEffect(() => {
    if (isConfirming) {
      setLoadingTxn(true);
    }
    if (updatingClaimError || claimTokensError ) {
      setLoadingTxn(false);
    }
  }, [
    loadingTxn,
    isLoading,
    isConfirming,
    updatingClaimError,
    claimTokensError,
    claimableTokens,
    claimableLoading,
    validSignature,
  ]);

  if (
    !user ||
    !userInfo ||
    !claimableTokens ||
    claimableLoading ||
    loadingTxn
  ) {
    return <FullPageLoading />;
  }

  const isDisabled = Boolean(
    !user ||
      claimableLoading ||
      claimableError ||
      !claimableTokens ||
      claimableTokens <= 0
  );

  function handleSwipe(amount: string) {
    claimTokens({ amount });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <PageLayout visible={true}>
        <ClaimableTokenDisplay claimableTokens={claimableTokens} />
        <SwipeFooter
          onSwipe={handleSwipe}
          isLoading={isLoading || isConfirming}
          disabled={isDisabled || isLoading || isConfirming}
          amount={claimableTokens ? claimableTokens.toString() : "1"}
        />
      </PageLayout>
    </motion.div>
  );
};
export default ClaimPage;
