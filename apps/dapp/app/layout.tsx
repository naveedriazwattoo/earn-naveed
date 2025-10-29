import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import FullPageLoading from "../components/Loading/FullPageLoading";
import ErudaWrapper from "../components/eruda-wrapper";
import { Providers } from "../components/providers";
import I18nProvider from "../components/providers/i18n-provider";
import { metadata } from "../lib/metadata";

const inter = Inter({ subsets: ["latin"] });

export { metadata };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} overflow-hidden touch-action-none overscroll-none rounded-t-3xl`}>
        <ErudaWrapper>
          <I18nProvider>
            <Providers>
              <Suspense fallback={<FullPageLoading />}>
                {children}
              </Suspense>
            </Providers>
          </I18nProvider>
        </ErudaWrapper>
      </body>
    </html>
  );
}
