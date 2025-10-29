"use client";
import { SeeHowItWorks } from "../Displays/SeeHowItWorks";
import { useSignIn } from "@/hooks/useSignIn";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useClaimableContext } from "@/contexts/claimableContext";
import { useUser } from "@/hooks/useUser";
import SigninButtonState from "./SigninButtonState";

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000; // Prod
// const TWO_MINUTES_MS = 2 * 60 * 1000; // Dev testing
const ZERO_MS = 0;

const TIMER = process.env.NEXT_PUBLIC_ENVIRONMENT === "production"? TWENTY_FOUR_HOURS_MS : ZERO_MS;

const Signin = () => {
  const { isSignedIn, walletAddress, isLoading, error, signIn } = useSignIn();
  const router = useRouter();
  const { setUser, userInfo } = useClaimableContext();
  const { loading: userLoading, error: userError } = useUser(walletAddress);

  useEffect(() => {
    if (isSignedIn && walletAddress) {
      setUser(walletAddress);
    }
  }, [isSignedIn, walletAddress, setUser]);

  const isClaimableTime = useMemo(() => {
    return userInfo?.lastClaimedTimestamp &&
      new Date(userInfo.lastClaimedTimestamp).getTime() <
        Date.now() - TIMER;
  }, [userInfo]);

  console.log("isClaimableTime out: ", isClaimableTime);

  useEffect(() => {
    if (isSignedIn && walletAddress && userInfo) {
      console.log("new user before push: ", walletAddress);

    //   const isClaimableTime = userInfo?.lastClaimedTimestamp &&
    //     new Date(userInfo.lastClaimedTimestamp).getTime() <
    //       Date.now() - 24 * 60 * 60 * 1000;

      console.log("can transfer: ", isClaimableTime);

      if (isClaimableTime) {
        if (
          !userError &&
          !userLoading &&
          isClaimableTime &&
          userInfo &&
          walletAddress === userInfo?.user
        ) {
          router.push("/Claim");
        }
      } else {
        router.push("/Dashboard");
      }
    }
  }, [
    isSignedIn,
    router,
    walletAddress,
    userInfo,
    userError,
    userLoading,
    isClaimableTime,
  ]);

  return (
    <div className="w-full bg-black flex flex-col">
      <div className="flex-none pb-[16px] xs:pb-[24px]">
        <SeeHowItWorks />
      </div>
      <div className="flex items-center pt-[13px] pb-[40px] xs:pt-[20px] xs:pb-[60px] h-[90px] xs:h-[135px]">
        <SigninButtonState
          isLoading={isLoading}
          error={error}
          isSignedIn={isSignedIn}
          onSignIn={signIn}
        />
      </div>
    </div>
  );
};

export default Signin;
