import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/lib/i18n/routing';
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Providers } from "@/lib/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Next.js i18n Auth Starter",
  description: "Production-ready starter template with i18n and auth",
};
 
export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }
 
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages({locale});

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <NextIntlClientProvider messages={messages} locale={locale}>
            {children}
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}