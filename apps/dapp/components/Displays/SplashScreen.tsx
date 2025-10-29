import { useEffect } from "react";
import FullPageLoading from "../Loading/FullPageLoading";
const SplashScreen = ({ onComplete, time = 3000 }: { onComplete: () => void, time?: number }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, time);

    return () => clearTimeout(timer);
  }, [onComplete, time]);

  return (
    <FullPageLoading />
  );
};

export default SplashScreen;
