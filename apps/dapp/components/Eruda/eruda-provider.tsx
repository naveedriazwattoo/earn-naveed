"use client";

import eruda from "eruda";
import { ReactNode, useEffect, useState } from "react";

export const Eruda = (props: { children: ReactNode }) => {
  const [erudaInitialized, setErudaInitialized] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || erudaInitialized) {
      return;
    }

    // Delay initialization to avoid interfering with app startup
    const timer = setTimeout(() => {
      try {
        // Check if eruda is already in the DOM
        if (!document.querySelector("#eruda")) {
          eruda.init({
            container: document.body,
          });
          setErudaInitialized(true);
        }
      } catch (error) {
        // Silently fail - eruda is just a dev tool, don't break the app
        if (process.env.NODE_ENV === "development") {
          console.warn("Eruda failed to initialize:", error);
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [erudaInitialized]);

  return <>{props.children}</>;
};
