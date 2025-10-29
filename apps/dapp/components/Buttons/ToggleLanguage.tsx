"use client"
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const ToggleLanguage = () => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState("en");

  useEffect(() => {
    const storedLang = localStorage.getItem("language") || "en";
    setCurrentLang(storedLang);
  }, []);

  const toggleLanguage = () => {
    const newLang = currentLang === "en" ? "es" : "en";
    i18n.changeLanguage(newLang);
    setCurrentLang(newLang);
    localStorage.setItem("language", newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="transition-transform hover:scale-105 focus:outline-none relative"
      aria-label={`Switch to ${currentLang === "en" ? "Spanish" : "English"}`}
    >
      <svg
        width="66"
        height="36"
        viewBox="0 0 66 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="button_color"
            x1={currentLang === "en" ? "0" : "30"}
            y1="0"
            x2={currentLang === "en" ? "30" : "60"}
            y2="30"
            gradientUnits="userSpaceOnUse"
            // className="transition-all duration-3600 ease-in"
          >
            <stop stopColor="#7D0BF4" />
            <stop offset="0.5" stopColor="#1A26E7" />
            <stop offset="1" stopColor="#0D4BEF" />
          </linearGradient>
          <linearGradient
            id="border_color"
            x1="0"
            y1="0"
            x2="60"
            y2="60"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#9B3CFF" />
            <stop offset="1" stopColor="#2D67FF" />
          </linearGradient>
        </defs>
        {/* Background and border */}
        <rect x="0.5" y="0.5" width="65" height="35" rx="17.5" fill="#161616" />
        <rect
          x="0.5"
          y="0.5"
          width="65"
          height="35"
          rx="17.5"
          stroke="url(#border_color)"
        />

        {/* Sliding gradient circle */}
        <circle
          cx={currentLang === "en" ? "18" : "48"}
          cy="18"
          r="15"
          fill="url(#button_color)"
          // className="transition-all duration-300 ease-in-out"
        />

        {/* EN Text - Now after the circle */}
        <g
          className="transition-opacity duration-300"
          style={{ opacity: currentLang === "en" ? 1 : 0.5 }}
        >
          <path
            d="M16.988 14.47H12.308V16.29H16.156V18.058H12.308V19.878H16.988V21.75H10.124V12.598H16.988V14.47ZM23.0772 14.678C23.8398 14.678 24.4422 14.925 24.8842 15.419C25.3262 15.913 25.5472 16.6367 25.5472 17.59V21.75H23.4672V18.422C23.4672 17.9107 23.4282 17.512 23.3502 17.226C23.2722 16.94 23.1552 16.7407 22.9992 16.628C22.8432 16.5067 22.6352 16.446 22.3752 16.446C22.0892 16.446 21.8205 16.5587 21.5692 16.784C21.3265 17.0093 21.1315 17.3257 20.9842 17.733C20.8368 18.1403 20.7632 18.5997 20.7632 19.111V21.75H18.6832V14.886H20.7632V15.211C20.7632 15.3583 20.7458 15.4927 20.7112 15.614C20.6852 15.7267 20.6462 15.8393 20.5942 15.952C20.5855 15.9607 20.5768 15.9737 20.5682 15.991C20.5682 15.9997 20.5682 16.0083 20.5682 16.017C20.5075 16.1383 20.4685 16.2423 20.4512 16.329C20.4338 16.407 20.4598 16.459 20.5292 16.485C20.5898 16.511 20.6375 16.5067 20.6722 16.472C20.7155 16.4373 20.7545 16.381 20.7892 16.303C20.7978 16.2943 20.8022 16.29 20.8022 16.29C20.9235 16.03 21.0882 15.7787 21.2962 15.536C21.5128 15.2933 21.7728 15.0897 22.0762 14.925C22.3795 14.7603 22.7132 14.678 23.0772 14.678Z"
            fill="white"
          />
        </g>

        {/* ES Text - Now after the circle */}
        <g
          className="transition-opacity duration-300"
          style={{ opacity: currentLang === "es" ? 1 : 0.5 }}
        >
          <path
            d="M47.488 14.47H42.808V16.29H46.656V18.058H42.808V19.878H47.488V21.75H40.624V12.598H47.488V14.47ZM50.8212 19.358C50.8298 19.5487 50.8732 19.722 50.9512 19.878C51.0378 20.034 51.1765 20.1597 51.3672 20.255C51.5665 20.3503 51.8222 20.398 52.1342 20.398C52.4202 20.398 52.6542 20.372 52.8362 20.32C53.0182 20.268 53.1482 20.1943 53.2262 20.099C53.3042 20.0037 53.3432 19.8953 53.3432 19.774C53.3432 19.644 53.2782 19.54 53.1482 19.462C53.0182 19.3753 52.8318 19.3103 52.5892 19.267C52.3552 19.215 52.0258 19.163 51.6012 19.111C51.5925 19.111 51.5838 19.111 51.5752 19.111C51.5752 19.111 51.5708 19.111 51.5622 19.111C50.5135 18.9897 49.8202 18.7253 49.4822 18.318C49.1442 17.902 48.9752 17.434 48.9752 16.914C48.9752 16.5153 49.0965 16.147 49.3392 15.809C49.5818 15.471 49.9415 15.198 50.4182 14.99C50.8948 14.782 51.4625 14.678 52.1212 14.678C52.9965 14.678 53.7158 14.8817 54.2792 15.289C54.8512 15.6877 55.1632 16.2813 55.2152 17.07H53.1612C53.1438 16.8013 53.0485 16.5977 52.8752 16.459C52.7105 16.3117 52.4462 16.238 52.0822 16.238C51.7268 16.238 51.4668 16.29 51.3022 16.394C51.1375 16.498 51.0552 16.641 51.0552 16.823C51.0552 16.9183 51.0855 17.0007 51.1462 17.07C51.2068 17.1307 51.3282 17.1913 51.5102 17.252C51.7008 17.304 51.9738 17.3473 52.3292 17.382C53.3345 17.4773 54.1015 17.7027 54.6302 18.058C55.1588 18.4047 55.4232 18.9333 55.4232 19.644C55.4232 20.086 55.2888 20.4847 55.0202 20.84C54.7515 21.1867 54.3658 21.4597 53.8632 21.659C53.3605 21.8583 52.7668 21.958 52.0822 21.958C51.0422 21.958 50.2405 21.7327 49.6772 21.282C49.1138 20.8227 48.8105 20.1813 48.7672 19.358H50.8212Z"
            fill="white"
          />
        </g>
      </svg>
    </button>
  );
};