"use client";

import { PageRoutes } from "@/helpers/string_const";
import { LogIn } from "lucide-react";

export default function LoginButton() {
  return (
    <a
      href={`${PageRoutes.LOGIN}?returnTo=${PageRoutes.PRIVATE}`}
      className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white dark:text-[#3D2F1F] bg-[#8B7355] dark:bg-[#C9B299] rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-[rgba(43,37,32,0.2)] dark:hover:shadow-[rgba(0,0,0,0.4)] hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#8B7355]/50 dark:focus:ring-[#C9B299]/50"
      aria-label="Log in to your account"
    >
      <span className="absolute inset-0 w-full h-full bg-[#F5EFE7] dark:bg-[#5C4A38] text-[#3D2F1F] dark:text-[#E8DFD3] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      <LogIn className="relative w-5 h-5 transition-transform duration-200 group-hover:rotate-12" />
      <span className="relative font-bold tracking-wide">Log In</span>
    </a>
  );
}
