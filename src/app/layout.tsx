import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import Logo from "@/components/logo";
import { LogoLong } from "@/components/logo-long";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Onco EMR",
  description: "developed by Scale Healthcare",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scale-85 -mt-12  bg-[#064a73]">
      <body
        className={cn("min-h-screen font-sans antialiased", fontSans.className)}
      >
        <nav className="flex bg-white lg:hidden min-w-full gap-2 justify-between items-center mb-0 md:mb-4 navbar">
          <LogoLong className="p-4" />
        </nav>
        <div className="flex flex-col md:flex-row w-full justify-evenly items-center md:items-start gap-2 ">
          <div className="flex justify-end w-fit h-fit mx-5 max-w-xs sm:bg-transparent">
            <Logo className="hidden lg:block" />
          </div>
          <div className="max-w-2xl w-[65rem] col-span-4">{children}</div>
          <div className="my-14 px-4 mx-2 max-w-sm space-y-5 text-base md:text-md text-white">
            <h3 className="text-lg">Instructions for New Patient Entry</h3>
            <ul className="space-y-5 ml-6 list-disc">
              <li>
                All fields are required (only enter middle name/initial if on
                insurance card.
              </li>
              <li>
                Effective date of insurance will be defaulted to the current
                date.
              </li>
              <li>
                If policy holder is not &quot;Self&quot; please populate the
                last three fields.
                <br />
                If it is &quot;Self&quot; these fields will be populated with
                the data above.
              </li>
              <li>Upon Submission, you will be given a member if number.</li>
              <li>
                If additional information is required to be entered, please open
                patient in Onco EMR after submission.
              </li>
            </ul>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
